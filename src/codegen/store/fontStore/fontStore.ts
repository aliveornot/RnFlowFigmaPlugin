type FontKindType = 'GoogleFont' | 'LocalFont';

export interface FontInfoType {
  kind: FontKindType;
  fontFamily: string;
  fontStyle: string;
}

const fontStore = {
  _fontSet: new Set<FontInfoType>(),

  store({ kind, fontFamily, fontStyle }: { kind: FontKindType; fontFamily: string; fontStyle: string }): void {
    if (this._ifSameFontExists({ kind, fontFamily, fontStyle })) return;
    this._fontSet.add({ kind, fontFamily, fontStyle });
  },

  asArray(): FontInfoType[] {
    return Array.from(this._fontSet);
  },

  _ifSameFontExists({ kind, fontFamily, fontStyle }: { kind: FontKindType; fontFamily: string; fontStyle: string }): boolean {
    return Array.from(this._fontSet).some((fontInfo) => {
      return fontInfo.fontFamily === fontFamily && fontInfo.fontStyle === fontStyle;
    });
  },

  clear() {
    this._fontSet.clear();
  },
};

export default fontStore;
