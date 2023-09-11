import React, { useEffect } from 'react';
import axios from 'axios';
import useSendToSandbox from './sendToSandboxHook';
import { PaylodFromSandboxToUi } from '../../types/PayloadType';
import JSZip from 'jszip';

const SERVERLSES_API_URL = 'https://figma-page-serverless-api.vercel.app/api';

// import { saveAs } from 'file-saver';

export type StatusKindType = 'READY' | 'GENERATING' | 'UPLOADING' | 'BUILDING' | 'DONE';

export default function useStartPublishing() {
  const [currentStatus, setCurrentStatus] = React.useState<StatusKindType>('READY');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [pageUrl, setPageUrl] = React.useState<string | null>(null);
  const isError = !!errorMessage;
  const sendToSandbox = useSendToSandbox();

  async function startPublishing() {
    setCurrentStatus('GENERATING');
    const promises = [_getPresignedUrlAsync(), getSourceCodeAsync()] as const;
    const [presignedUrl, sourceCode] = await Promise.allSettled(promises);
    if (sourceCode.status === 'rejected') {
      setCurrentStatus('READY');
      setErrorMessage('Failed to get source code');
      return;
    }
    if (presignedUrl.status === 'rejected') {
      setCurrentStatus('READY');
      setErrorMessage('Failed to get presigned url');
      return;
    }

    setCurrentStatus('UPLOADING');
    const zipBlob = await _zipSourceCodeAsync(sourceCode);
    const response = await fetch(presignedUrl.value.data.url, { method: 'PUT', body: zipBlob, headers: { 'Content-Type': 'application/zip' } });
    if (response.ok) {
      console.log(presignedUrl.value);
      setCurrentStatus('BUILDING');
    } else {
      setCurrentStatus('READY');
      setErrorMessage('Failed to upload zip file');
      console.error(response.statusText);
    }

    // 이 시점에서 UPLOAD FINISHED
    const response2 = await _buildAnDeployAsync(presignedUrl.value.data.url);
    console.log('🚀 ~ file: startPublishHook.ts:49 ~ startPublishing ~ responseData:', response2);

    setCurrentStatus('DONE');
    setPageUrl(response2.data.pageUrl);
  }

  function reInitialize() {
    setCurrentStatus('READY');
    setErrorMessage('');
    setPageUrl(null);
  }

  async function getSourceCodeAsync() {
    const promise = new Promise<PaylodFromSandboxToUi['sourceCode']>((resolve, reject) => {
      window.addEventListener('message', _handleSourceCodeMessage);
      function _handleSourceCodeMessage(event: MessageEvent<{ pluginMessage: PaylodFromSandboxToUi['sourceCode'] }>) {
        window.removeEventListener('message', _handleSourceCodeMessage);
        const payloadFromSandbox = event.data.pluginMessage;
        resolve(payloadFromSandbox);
      }
    });
    sendToSandbox({ command: 'retrieveSourceCode' });
    return promise;
  }

  return { currentStatus, isError, errorMessage, pageUrl, startPublishing, reInitialize };
}

async function _zipSourceCodeAsync(
  sourceCode: PromiseFulfilledResult<{
    command: 'sourceCode';
    data: {
      code: string;
      mediaInfo: import('d:/src/figPressProject/figmaPlugin/src/codegen/store/imageVideoStore/mediaStore').MediaInfoType[];
      fontInfo: import('d:/src/figPressProject/figmaPlugin/src/codegen/store/fontStore/fontStore').FontInfoType[];
    };
  }>
) {
  const zip = new JSZip();
  const sourceCodeInfo = sourceCode.value.data;
  const srcFolder = zip.folder('src') as JSZip;
  srcFolder.file('PageOne.tsx', sourceCodeInfo.code);
  const assetsFolder = srcFolder.folder('assets') as JSZip;
  sourceCodeInfo.mediaInfo.forEach((mediaInfo) => {
    assetsFolder.file(mediaInfo.filename, mediaInfo.contentBytes);
  });
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  return zipBlob;
}

async function _getPresignedUrlAsync() {
  const response = await axios.request({
    method: 'POST',
    url: `${SERVERLSES_API_URL}/presignedUrl`,
  });
  return response.data;
}

async function _buildAnDeployAsync(signedUrl: string) {
  const response = await axios.request({
    method: 'POST',
    url: `${SERVERLSES_API_URL}/buildAndDeploy`,
    data: {
      signedUrl,
    },
    timeout: 1000 * 60 * 3, // 3분
  });
  return response.data;
}

/**
 * convert
 * @param signedUrl
 * @returns
 */
function convertSignedUrlToNormalUrl(signedUrl: string): string {
  const url = new URL(signedUrl);
  const pathname = url.pathname;
  return `https://storage.googleapis.com${pathname}`;
}
