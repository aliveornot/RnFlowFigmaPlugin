import { FontInfoType } from '../codegen/store/fontStore/fontStore';
import { MediaInfoType } from '../codegen/store/imageVideoStore/mediaStore';

export type PayloadFromUiToSandbox = {
  getSourceCode: { command: 'retrieveSourceCode' };
  get: { command: 'get' };
};

export interface PaylodFromSandboxToUi {
  selectionChanged: {
    command: 'selectionChanged';
    data: {
      selectedNodesInfo: {
        id: SceneNode['id'];
        name: string;
        isTopLevelNode: boolean;
        type: SceneNode['type'];
      }[];
    };
  };
  sourceCode: {
    command: 'sourceCode';
    data: {
      code: string;
      mediaInfo: MediaInfoType[];
      fontInfo: FontInfoType[];
    };
  };
}
