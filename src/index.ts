import generateVDomRecusriveAsync from './codegen/generateVDom';
import fontStore from './codegen/store/fontStore';
import mediaStore from './codegen/store/imageVideoStore';
import vDomToCode from './codegen/vDomToCode';
import { PayloadFromUiToSandbox, PaylodFromSandboxToUi } from './types/PayloadType';

// dev mode
if (figma.editorType === 'dev') {
  // change code setting
  figma.codegen.on('generate', async ({ language, node }) => {
    console.log('🚀 ~ file: index.ts:9 ~ figma.codegen.on ~ node:', node);
    switch (node.type) {
      case 'COMPONENT_SET': {
        return [
          {
            title: '🔥 React Native [RN-Flow] 🔥',
            language: 'PLAINTEXT',
            code: `\n ❌ You selected a Component Set.\n\n✅ To generate code, \n    click an ⭐individual component⭐ inside the set.\n`,
          },
        ];
      }
      case 'RECTANGLE':
      case 'FRAME':
      case 'GROUP':
      case 'COMPONENT':
      case 'INSTANCE': {
        try {
          const vDom = await generateVDomRecusriveAsync(node);
          const code = vDomToCode(vDom);
          return [
            {
              title: '🔥 React Native [RN-Flow] 🔥',
              language: 'TYPESCRIPT',
              code,
            },
          ];
        } catch (error: any) {
          const errorMessage = error.message;
          const errorKind = error.message.split('::')[0];
          if (errorKind === 'COMPONENT_SET_IN_THE_NODE') {
            return [
              {
                title: '🔥 React Native [RN-Flow] 🔥',
                language: 'PLAINTEXT',
                code: '\n ❌ You cannot generate code that contains a Component Set.\n\n✅ To generate code, \n    click an individual component/instance/frame.\n',
              },
            ];
          } else {
            return [
              {
                title: '🔥 React Native [RN-Flow] 🔥',
                language: 'PLAINTEXT',
                code: errorMessage,
              },
            ];
          }
        }
      }
      default:
        return [
          {
            title: '🔥 React Native [RN-Flow] 🔥',
            language: 'PLAINTEXT',
            code: `\n ❌ You selected a ${node.type}.\n\n✅ Click \n\t\ta FRAME,  \n\t\ta COMPONENT, \n\t\tor an INSTANCE \n\t to generate code.\n`,
          },
        ];
    }
  });
} else if (figma.editorType === 'figma') {
  figma.ui.onmessage = async (payload: PayloadFromUiToSandbox[keyof PayloadFromUiToSandbox]) => {
    if (payload.command === 'retrieveSourceCode') {
      //re-initialize the stores
      fontStore.clear();
      mediaStore.clear();

      const selectedNode = figma.currentPage.selection[0];
      const vDom = await generateVDomRecusriveAsync(selectedNode);
      const code = vDomToCode(vDom);
      sendToUi({ command: 'sourceCode', data: { code, mediaInfo: mediaStore.asArray(), fontInfo: fontStore.asArray() } });
    }
  };

  figma.on('run', () => {
    setTimeout(sendCurrentSelectionToUi, 100);
  });
  figma.on('selectionchange', sendCurrentSelectionToUi);
  figma.showUI(__html__, { width: 320, height: 160 });
}

function sendToUi(payload: PaylodFromSandboxToUi[keyof PaylodFromSandboxToUi]) {
  figma.ui.postMessage(payload);
}

function sendCurrentSelectionToUi() {
  const newSelectedNodes = figma.currentPage.selection;
  const selectedNodesInfo = newSelectedNodes.map((node: SceneNode) => {
    const id = node.id;
    const name = node.name;
    const type: SceneNode['type'] = node.type;
    const isTopLevelNode = !!node.parent && node.parent.type === 'PAGE';
    return { id, name, isTopLevelNode, type };
  });

  sendToUi({ command: 'selectionChanged', data: { selectedNodesInfo } });
}
