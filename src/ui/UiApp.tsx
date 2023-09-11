import React from 'react';
import ReadyPage from './pages/ReadyPage';
import useStartPublishing from './hooks/startPublishHook';
import IntermediatePage from './pages/IntermediatePage';

export default function App() {
  const { currentStatus, isError, errorMessage, pageUrl, startPublishing, reInitialize } = useStartPublishing();

  return currentStatus === 'READY' ? ( //
    <ReadyPage onClickPublish={startPublishing} />
  ) : ['BUILDING', 'GENERATING', 'UPLOADING', 'BUILDING'].includes(currentStatus) ? (
    <IntermediatePage status={currentStatus} />
  ) : (
    <>
      <ReadyPage />
      <a href={pageUrl || ''} rel='noopener noreferrer' target='_blank'>
        {pageUrl}
      </a>
    </>
  );
}
