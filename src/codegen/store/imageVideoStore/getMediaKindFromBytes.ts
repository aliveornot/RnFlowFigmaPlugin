import { MediaKindType } from './mediaStore';

export function getMediaKindFromBytes(bytes: Uint8Array): MediaKindType | undefined {
  // PNG check
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return 'png';
  }

  // JPEG check
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'jpg';
  }

  // WebP check
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return 'webp';
  }

  // GIF check
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) {
    return 'gif';
  }

  // WebM check (EBML header)
  if (bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3) {
    return 'webm';
  }

  // MP4 check (basic)
  if (
    bytes[0] === 0x00 &&
    bytes[1] === 0x00 &&
    bytes[2] === 0x00 &&
    bytes[3] === 0x18 &&
    bytes[4] === 0x66 &&
    bytes[5] === 0x74 &&
    bytes[6] === 0x79 &&
    bytes[7] === 0x70
  ) {
    return 'mp4';
  }

  // AVI check
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x41 &&
    bytes[9] === 0x56 &&
    bytes[10] === 0x49 &&
    bytes[11] === 0x20
  ) {
    return 'avi';
  }

  // MOV check
  if (
    bytes[0] === 0x00 &&
    bytes[1] === 0x00 &&
    bytes[2] === 0x00 &&
    bytes[3] === 0x14 &&
    bytes[4] === 0x66 &&
    bytes[5] === 0x74 &&
    bytes[6] === 0x79 &&
    bytes[7] === 0x70
  ) {
    return 'mov';
  }

  // FLV check
  if (bytes[0] === 0x46 && bytes[1] === 0x4c && bytes[2] === 0x56 && bytes[3] === 0x01) {
    return 'flv';
  }

  // MKV check
  if (bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3) {
    return 'mkv';
  }

  return undefined;
}
