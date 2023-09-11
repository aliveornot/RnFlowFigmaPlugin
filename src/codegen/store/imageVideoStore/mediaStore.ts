import { getMediaKindFromBytes } from './getMediaKindFromBytes';

export type MediaKindType = 'jpg' | 'png' | 'webp' | 'gif' | 'webm' | 'mp4' | 'avi' | 'mov' | 'flv' | 'mkv';

export interface MediaInfoType {
  kind: MediaKindType;
  filename: string;
  contentBytes: Uint8Array;
}

const mediaStore = {
  _mediaMap: new Map<string, MediaInfoType>(),

  store(figmaHash: string, bytes: Uint8Array): void {
    const assetKind = getMediaKindFromBytes(bytes);

    if (!assetKind) {
      throw new Error('Unknown image type');
    }
    const filename = `${figmaHash}.${assetKind}`;
    this._mediaMap.set(figmaHash, {
      kind: assetKind,
      filename,
      contentBytes: bytes,
    });
  },

  get(figmaHash: string): MediaInfoType | undefined {
    return this._mediaMap.get(figmaHash);
  },

  clear(): void {
    this._mediaMap.clear();
  },

  asArray(): MediaInfoType[] {
    return Array.from(this._mediaMap.values());
  },

  asObject(): Record<string, MediaInfoType> {
    return Object.fromEntries(this._mediaMap.entries());
  },
};

export default mediaStore;
