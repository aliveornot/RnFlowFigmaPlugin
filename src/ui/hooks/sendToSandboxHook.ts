import { PayloadFromUiToSandbox } from '../../types/PayloadType';

export default function useSendToSandbox() {
  function sendToSandbox(payload: PayloadFromUiToSandbox[keyof PayloadFromUiToSandbox]) {
    parent.postMessage({ pluginMessage: payload }, '*');
  }

  return sendToSandbox;
}
