import { googleFontFullList } from './googleFontFullList';

export function isGoogleFont(fontFamily: string) {
  const items = googleFontFullList.items;
  return items.some((item) => {
    return item.family === fontFamily;
  });
}
