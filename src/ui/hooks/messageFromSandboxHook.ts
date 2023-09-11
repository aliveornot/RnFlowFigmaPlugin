import { useState, useEffect } from 'react';
import { PaylodFromSandboxToUi } from '../../types/PayloadType';

export default function useSelectedNodes() {
  const [selectedNodesInfo, setSelectedNodesInfo] = useState<PaylodFromSandboxToUi['selectionChanged']['data']['selectedNodesInfo']>([]);

  useEffect(() => {
    window.addEventListener('message', handleSelectionChangedMessage);

    function handleSelectionChangedMessage(event: MessageEvent<{ pluginMessage: PaylodFromSandboxToUi['selectionChanged'] }>) {
      const payloadFromSandbox = event.data.pluginMessage;
      if (!!payloadFromSandbox && payloadFromSandbox.command && payloadFromSandbox.command === 'selectionChanged') {
        setSelectedNodesInfo(payloadFromSandbox.data.selectedNodesInfo);
      }
    }

    return () => {
      window.removeEventListener('message', handleSelectionChangedMessage);
    };
  }, []);

  return selectedNodesInfo;
}
