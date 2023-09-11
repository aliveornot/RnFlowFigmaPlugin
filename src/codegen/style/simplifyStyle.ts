export default function simplifyStyle(style: { [key: string]: any }) {
  const newStyle = Object.assign({}, style);

  // margin
  if (haveSameValues(newStyle, 'marginTop', 'marginBottom')) {
    newStyle.marginVertical = newStyle.marginTop;
    delete newStyle.marginTop;
    delete newStyle.marginBottom;
  }
  if (haveSameValues(newStyle, 'marginLeft', 'marginRight')) {
    newStyle.marginHorizontal = newStyle.marginLeft;
    delete newStyle.marginLeft;
    delete newStyle.marginRight;
  }
  if (haveSameValues(newStyle, 'marginVertical', 'marginHorizontal')) {
    newStyle.margin = newStyle.marginVertical;
    delete newStyle.marginVertical;
    delete newStyle.marginHorizontal;
  }
  if (newStyle.margin === 0) {
    delete newStyle.margin;
  }

  // padding
  if (haveSameValues(newStyle, 'paddingTop', 'paddingBottom')) {
    newStyle.paddingVertical = newStyle.paddingTop;
    delete newStyle.paddingTop;
    delete newStyle.paddingBottom;
  }
  if (haveSameValues(newStyle, 'paddingLeft', 'paddingRight')) {
    newStyle.paddingHorizontal = newStyle.paddingLeft;
    delete newStyle.paddingLeft;
    delete newStyle.paddingRight;
  }
  if (haveSameValues(newStyle, 'paddingVertical', 'paddingHorizontal')) {
    newStyle.padding = newStyle.paddingVertical;
    delete newStyle.paddingVertical;
    delete newStyle.paddingHorizontal;
  }
  if (newStyle.padding === 0) {
    delete newStyle.padding;
  }

  // borderWidth
  if (haveSameValues(newStyle, 'borderTopWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderRightWidth')) {
    newStyle.borderWidth = newStyle.borderTopWidth;
    delete newStyle.borderTopWidth;
    delete newStyle.borderBottomWidth;
    delete newStyle.borderLeftWidth;
    delete newStyle.borderRightWidth;
  }
  if (newStyle.borderWidth === 0) {
    delete newStyle.borderWidth;
  }

  // borderStyle
  if (haveSameValues(newStyle, 'borderTopStyle', 'borderBottomStyle')) {
    newStyle.borderVerticalStyle = newStyle.borderTopStyle;
    delete newStyle.borderTopStyle;
    delete newStyle.borderBottomStyle;
  }
  if (haveSameValues(newStyle, 'borderLeftStyle', 'borderRightStyle')) {
    newStyle.borderHorizontalStyle = newStyle.borderLeftStyle;
    delete newStyle.borderLeftStyle;
    delete newStyle.borderRightStyle;
  }
  if (haveSameValues(newStyle, 'borderVerticalStyle', 'borderHorizontalStyle')) {
    newStyle.borderStyle = newStyle.borderVerticalStyle;
    delete newStyle.borderVerticalStyle;
    delete newStyle.borderHorizontalStyle;
  }
  if (newStyle.borderStyle === 'solid') {
    delete newStyle.borderStyle;
  }

  // borderColor
  if (haveSameValues(newStyle, 'borderTopColor', 'borderBottomColor')) {
    newStyle.borderVerticalColor = newStyle.borderTopColor;
    delete newStyle.borderTopColor;
    delete newStyle.borderBottomColor;
  }
  if (haveSameValues(newStyle, 'borderLeftColor', 'borderRightColor')) {
    newStyle.borderHorizontalColor = newStyle.borderLeftColor;
    delete newStyle.borderLeftColor;
    delete newStyle.borderRightColor;
  }
  if (haveSameValues(newStyle, 'borderVerticalColor', 'borderHorizontalColor')) {
    newStyle.borderColor = newStyle.borderVerticalColor;
    delete newStyle.borderVerticalColor;
    delete newStyle.borderHorizontalColor;
  }
  if (newStyle.borderColor === 'transparent') {
    delete newStyle.borderColor;
  }

  //borderRadius
  if (haveSameValues(newStyle, 'borderTopLeftRadius', 'borderBottomLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius')) {
    newStyle.borderRadius = newStyle.borderTopLeftRadius;
    delete newStyle.borderTopLeftRadius;
    delete newStyle.borderBottomLeftRadius;
    delete newStyle.borderTopRightRadius;
    delete newStyle.borderBottomRightRadius;
  }

  if (newStyle.borderRadius === 0) {
    delete newStyle.borderRadius;
  }

  if (newStyle.display === 'flex') {
    delete newStyle.display;
  }
  if (newStyle.position === 'relative') {
    delete newStyle.position;
  }

  if (newStyle.flexGrow === 0) {
    delete newStyle.flexGrow;
  }
  // if (newStyle.flexShrink === 0) {
  //   delete newStyle.flexShrink;
  // }
  if (newStyle.flexBasis === 'auto') {
    delete newStyle.flexBasis;
  }
  if (newStyle.flexWrap === 'nowrap') {
    delete newStyle.flexWrap;
  }

  if (newStyle.flexDirection === 'column') {
    // rn-specific
    delete newStyle.flexDirection;
  }

  if (newStyle.background === 'transparent') {
    delete newStyle.background;
  }

  if (newStyle.alignSelf === 'auto') {
    delete newStyle.alignSelf;
  }

  if (newStyle.alignItems === 'flex-start') {
    delete newStyle.alignItems;
  }
  if (newStyle.justifyContent === 'flex-start') {
    delete newStyle.justifyContent;
  }

  if (newStyle.top === 0) {
    if (newStyle.bottom === undefined) {
      delete newStyle.top;
    }
  }
  if (newStyle.left === 0) {
    if (newStyle.right === undefined) {
      delete newStyle.left;
    }
  }

  return newStyle;
}

function haveSameValues(style: { [key: string]: any }, ...keys: string[]) {
  const values = keys.map((key) => style[key]);
  return values.every((value) => value === values[0]);
}
