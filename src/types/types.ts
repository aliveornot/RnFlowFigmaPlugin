export const VElementKind = {
  COMPONENT: 'COMPONENT',
  INSTANCE: 'INSTANCE',
  FRAME: 'FRAME',

  RECTANGLE: 'RECTANGLE',

  GROUP: 'GROUP',

  TEXT: 'TEXT',

  ELLIPSE: 'ELLIPSE',
  LINE: 'LINE',
  POLYGON: 'POLYGON',
  STAR: 'STAR',
  VECTOR: 'VECTOR',
  BOOLEAN_OPERATION: 'BOOLEAN_OPERATION',

  BLANK: 'BLANK', // error occurred in svg. will not be rendered.
} as const;

export const VElementKinds = Object.values(VElementKind);

export type CommonVElement = {
  name: string;
  style: Record<string, any>;
  children: VElement[];
};

type BackgroundImageType = {
  source: {
    uri: string;
  };
};

export type VElement =
  | (CommonVElement & {
      kind: typeof VElementKind.INSTANCE;
      mainComponentName: string;
      props: Record<string, string>;
      backgroundImage: null | BackgroundImageType;
    })
  | (CommonVElement & {
      kind: typeof VElementKind.COMPONENT;
      props: Record<string, string>;
      backgroundImage: null | BackgroundImageType;
    })
  | (CommonVElement & {
      kind: typeof VElementKind.FRAME | typeof VElementKind.RECTANGLE;
      backgroundImage: null | BackgroundImageType;
    })
  | (CommonVElement & {
      kind: typeof VElementKind.GROUP;
    })
  | (CommonVElement & {
      kind: typeof VElementKind.TEXT;
      textInfo: {
        innerHtml: string;
        maxLines: number | null;
      };
    })
  | (CommonVElement & {
      kind:
        | typeof VElementKind.VECTOR
        | typeof VElementKind.ELLIPSE
        | typeof VElementKind.LINE
        | typeof VElementKind.POLYGON
        | typeof VElementKind.STAR
        | typeof VElementKind.BOOLEAN_OPERATION;
      svgString: string;
    })
  | (CommonVElement & {
      kind: typeof VElementKind.BLANK;
    });
