import mathUtils from '../../utils/mathUtils';
import UnitConversions from '../../utils/unitConversions';
import simplifyStyleMut from './simplifyStyle';
import mediaStore from '../store/imageVideoStore/mediaStore';
import fontStore from '../store/fontStore/fontStore';
import { isGoogleFont } from '../store/fontStore/isGoogleFont';

export async function generateStyleOfSceneNodeAsync(sceneNode: SceneNode) {
  const nodeType = sceneNode.type;
  let detailStyle: { [key: string]: any };

  switch (nodeType) {
    case 'FRAME':
    case 'COMPONENT':
    case 'INSTANCE': {
      // wrt parent
      const position = _getPosition(sceneNode);
      const alignSelf = _getAlignSelf(sceneNode);
      const { flexGrow, flexShrink, flexBasis } = _getFlexValues(sceneNode);

      //position,size
      const { top, right, bottom, left, width, height } = _getRealPositionSize(sceneNode);
      // getTransformation
      const { transform } = _getTransform(sceneNode);

      //padding, margin ( there is no margin in figma )
      const { paddingTop, paddingBottom, paddingLeft, paddingRight } = _getPadding(sceneNode);
      // borderWidth
      const {
        borderTopWidth, //
        borderRightWidth,
        borderBottomWidth,
        borderLeftWidth,
      } = _getBorderWidth(sceneNode);
      //borderStyle
      const borderStyle = _getBorderStyle(sceneNode);
      // borderRadius
      const {
        borderTopLeftRadius,
        borderTopRightRadius,
        borderBottomRightRadius,
        borderBottomLeftRadius, //
      } = _getBorderRadius(sceneNode);
      //borderColor
      const { borderTopColor, borderRightColor, borderBottomColor, borderLeftColor } = _getBorderColor(sceneNode);
      //background
      const background = await _getBackgroundAsync(sceneNode);
      // shadow
      const boxShadow = _getShadows(sceneNode);

      //
      //wrt the children
      //
      const display = 'flex';
      const flexDirection = _getFlexDirection(sceneNode);
      const flexWrap = _getFlexWrap(sceneNode);
      const alignItems = _getAlignItems(sceneNode);
      const justifyContent = _getJustifyContent(sceneNode);
      const { rowGap, columnGap } = _getGap(sceneNode);

      detailStyle = {
        // wrt parent
        position,
        alignSelf,
        flexGrow, //
        flexShrink,
        flexBasis,
        // wrt self
        top, //
        bottom,
        height,
        left,
        right,
        width,
        transform,

        paddingTop, //
        paddingBottom,
        paddingLeft,
        paddingRight,
        borderTopWidth, //
        borderRightWidth,
        borderBottomWidth,
        borderLeftWidth,
        borderTopLeftRadius, //
        borderTopRightRadius,
        borderBottomRightRadius,
        borderBottomLeftRadius,
        borderStyle,
        borderTopColor, //
        borderRightColor,
        borderBottomColor,
        borderLeftColor,
        background,

        boxShadow,

        display,
        flexDirection,
        flexWrap,
        alignItems,
        justifyContent,
        rowGap,
        columnGap,
      };
      break;
    }

    case 'GROUP': {
      // wrt parent
      const position = _getPosition(sceneNode);
      const alignSelf = _getAlignSelf(sceneNode);
      const { flexGrow, flexShrink, flexBasis } = _getFlexValues(sceneNode);

      //position,size
      const { top, right, bottom, left, width, height } = _getRealPositionSize(sceneNode);
      // getTransformation
      const { transform } = _getTransform(sceneNode);

      detailStyle = {
        // wrt parent
        position,
        alignSelf,
        flexGrow, //
        flexShrink,
        flexBasis,
        // wrt self
        top, //
        bottom,
        height,
        left,
        right,
        width,
        transform,
      };
      break;
    }

    case 'RECTANGLE': {
      // wrt parent
      const position = _getPosition(sceneNode);
      const alignSelf = _getAlignSelf(sceneNode);
      const { flexGrow, flexShrink, flexBasis } = _getFlexValues(sceneNode);

      //position,size
      const { top, right, bottom, left, width, height } = _getRealPositionSize(sceneNode);

      // border
      const {
        borderTopWidth, //
        borderRightWidth,
        borderBottomWidth,
        borderLeftWidth,
      } = _getBorderWidth(sceneNode);
      const borderStyle = _getBorderStyle(sceneNode);
      const {
        borderTopLeftRadius,
        borderTopRightRadius,
        borderBottomRightRadius,
        borderBottomLeftRadius, //
      } = _getBorderRadius(sceneNode);
      const { borderTopColor, borderRightColor, borderBottomColor, borderLeftColor } = _getBorderColor(sceneNode);

      //background
      const background = _getBackgroundAsync(sceneNode);
      //shadow
      const boxShadow = _getShadows(sceneNode);

      //transform
      const { transform } = _getTransform(sceneNode);

      detailStyle = {
        // wrt parent
        position,
        alignSelf,
        flexGrow, //
        flexShrink,
        flexBasis,
        // positionSize
        top, //
        right,
        bottom,
        left,
        width,
        height,
        transform,
        // border
        borderTopWidth, //
        borderRightWidth,
        borderBottomWidth,
        borderLeftWidth,
        borderTopLeftRadius, //
        borderTopRightRadius,
        borderBottomRightRadius,
        borderBottomLeftRadius,
        borderStyle,
        borderTopColor, //
        borderRightColor,
        borderBottomColor,
        borderLeftColor,
        // background
        background,

        //shadow
        boxShadow,
      };
      break;
    }

    case 'TEXT': {
      // wrt parent
      const position = _getPosition(sceneNode);
      const alignSelf = _getAlignSelf(sceneNode);
      const { flexGrow, flexShrink, flexBasis } = _getFlexValues(sceneNode);
      //position,size
      const { top, right, bottom, left, width, height } = _getRealPositionSize(sceneNode);
      const { transform } = _getTransform(sceneNode);
      const {
        fontFamily, //
        fontSize,
        fontWeight,
        letterSpacing,
        lineHeight,
        textDecorationLine,
        textAlign,
        color,
      } = await getTextStylesAsync(sceneNode);
      const {
        textShadowColor, //
        textShadowOffset,
        textShadowRadius,
      } = _getTextShadow(sceneNode);

      //drop-shadow in figma is not box-shadow but text-shadow

      detailStyle = {
        // wrt parent
        position,
        alignSelf,
        flexGrow, //
        flexShrink,
        flexBasis,
        // wrt self
        top, //
        right,
        bottom,
        left,
        width,
        height,
        transform,
        // Text-related
        textAlign,
        color,
        fontFamily,
        fontSize,
        fontWeight,
        letterSpacing,
        lineHeight,
        textDecorationLine,
        //textShadow
        textShadowColor,
        textShadowOffset,
        textShadowRadius,
      };
      break;
    }

    case 'BOOLEAN_OPERATION':
    case 'ELLIPSE':
    case 'LINE':
    case 'POLYGON':
    case 'STAR':
    case 'VECTOR': {
      // wrt parent
      const position = _getPosition(sceneNode);
      const alignSelf = _getAlignSelf(sceneNode);
      const { flexGrow, flexShrink, flexBasis } = _getFlexValues(sceneNode);

      //position,size
      const { top, right, bottom, left, width, height } = _getRealPositionSize(sceneNode);

      // vector는 transform이 SVG내에서 처리된다. (ExportAsync에서)
      // const { transform } = _getTransform(sceneNode);

      //drop-shadow in figma is not box-shadow. it casts shadow only on the shape itself.

      detailStyle = {
        // wrt parent
        position,
        alignSelf,
        flexGrow, //
        flexShrink,
        flexBasis,
        // wrt self
        top, //
        right,
        bottom,
        left,
        width: width === 0 ? undefined : width,
        height: height === 0 ? undefined : height,
        minWidth: width === 0 ? 0.001 : undefined,
        minHeight: height === 0 ? 0.001 : undefined,

        // vector는 transform이 SVG내에서 처리된다.
        // transform,

        // vector는 overflow가 visible이어야 한다. figma  셋팅상 그러함.
        overflow: 'visible',
      };
      break;
    }

    default:
      assertNever(nodeType);
      throw new Error('Unexpected node type: ' + nodeType.toString());
      function assertNever(shouldBeNever: never) {}
  }

  const shorthandStyle = simplifyStyleMut(detailStyle);
  return shorthandStyle;
}

function _getGap(node: ComponentNode | ComponentSetNode | FrameNode | InstanceNode) {
  const gap = node.itemSpacing;
  const flexDirection = _getFlexDirection(node);
  if (flexDirection === 'row') {
    return {
      rowGap: undefined,
      columnGap: gap,
    };
  } else {
    return {
      rowGap: gap,
      columnGap: undefined,
    };
  }
}

function _getAlignItems(
  node: ComponentNode | ComponentSetNode | FrameNode | InferredAutoLayoutResult | InstanceNode
): 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline' {
  const counterAxisAlignItems = node.counterAxisAlignItems;
  switch (counterAxisAlignItems) {
    case 'MIN': {
      return 'flex-start';
    }
    case 'MAX': {
      return 'flex-end';
    }
    case 'CENTER': {
      return 'center';
    }
    case 'BASELINE': {
      return 'baseline';
    }
    // there's no 'stretch' in figma
    default: {
      assertNever(counterAxisAlignItems);
      throw new Error('layoutAlign is not one of the expected values.');
    }
  }
  function assertNever(shouldBeNever: never) {}
}
function _getJustifyContent(
  node: ComponentNode | ComponentSetNode | FrameNode | InferredAutoLayoutResult | InstanceNode
): 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' {
  const primaryAxisAlignItems = node.primaryAxisAlignItems;
  switch (primaryAxisAlignItems) {
    case 'MIN': {
      return 'flex-start';
    }
    case 'MAX': {
      return 'flex-end';
    }
    case 'CENTER': {
      return 'center';
    }
    case 'SPACE_BETWEEN': {
      return 'space-between';
    }
    // there's no 'space-around', 'space-evenly' in figma
    default: {
      assertNever(primaryAxisAlignItems);
      throw new Error('layoutAlign is not one of the expected values.');
    }
  }
  function assertNever(shouldBeNever: never) {}
}

function _getFlexDirection(node: ComponentNode | ComponentSetNode | FrameNode | InstanceNode): 'row' | 'column' {
  const layoutMode = node.layoutMode;
  switch (layoutMode) {
    case 'HORIZONTAL':
      return 'row';
    case 'NONE':
    case 'VERTICAL':
      return 'column';
    default:
      assertNever(layoutMode);
      throw new Error('layoutMode is not one of the expected values.');
  }
  function assertNever(shouldBeNever: never) {}
}

function _getFlexWrap(node: ComponentNode | ComponentSetNode | FrameNode | InstanceNode): 'wrap' | 'nowrap' | 'wrap-reverse' {
  const layoutWrap = node.layoutWrap;
  switch (layoutWrap) {
    case 'WRAP':
      return 'wrap';
    case 'NO_WRAP':
      return 'nowrap';
    default:
      assertNever(layoutWrap);
      throw new Error('layoutWrap is not one of the expected values.');
  }
  function assertNever(shouldBeNever: never) {}
}

async function _getBackgroundAsync( //
  node:
    | BooleanOperationNode
    | ComponentNode
    | ComponentSetNode
    | EllipseNode
    | FrameNode
    | HighlightNode
    | InstanceNode
    | PolygonNode
    | RectangleNode
    | StarNode
    | VectorNode
) {
  const fill = await _getFillColorAsync(node);

  return fill;
}

function _getBorderColor(
  node:
    | BooleanOperationNode
    | ComponentNode
    | ComponentSetNode
    | EllipseNode
    | FrameNode
    | HighlightNode
    | InstanceNode
    | PolygonNode
    | RectangleNode
    | StarNode
    | VectorNode
) {
  const strokeColor = _getStrokeColor(node);

  return {
    borderRightColor: strokeColor,
    borderTopColor: strokeColor,
    borderBottomColor: strokeColor,
    borderLeftColor: strokeColor,
  };
}

/**
 * Only SOLID is supported
 */
function _getBorderStyle(
  node:
    | BooleanOperationNode
    | ComponentNode
    | ComponentSetNode
    | EllipseNode
    | FrameNode
    | HighlightNode
    | InstanceNode
    | PolygonNode
    | RectangleNode
    | StarNode
    | VectorNode
): 'solid' | 'dotted' | 'dashed' | undefined {
  const lastStroke = node.strokes[node.strokes.length - 1];
  if (lastStroke === undefined) {
    return undefined;
  } else {
    // figma에서는 strokeGeometry를 통해 제어한다.
    // 해석하기가 너무 힘들어서 그냥 solid로 처리한다.
    // (나중에 알아서 바꾸든가..)
    return 'solid';
  }
}

function _getBorderWidth(
  node:
    | BooleanOperationNode
    | ComponentNode
    | ComponentSetNode
    | EllipseNode
    | FrameNode
    | HighlightNode
    | InstanceNode
    | PolygonNode
    | RectangleNode
    | StarNode
    | VectorNode
): {
  borderTopWidth: number | undefined;
  borderRightWidth: number | undefined;
  borderBottomWidth: number | undefined;
  borderLeftWidth: number | undefined;
} {
  const lastStroke = node.strokes[node.strokes.length - 1];
  if (lastStroke === undefined) {
    return {
      borderTopWidth: undefined,
      borderRightWidth: undefined,
      borderBottomWidth: undefined,
      borderLeftWidth: undefined,
    };
  } else {
    if (typeof node.strokeWeight === 'number') {
      return {
        borderTopWidth: node.strokeWeight,
        borderRightWidth: node.strokeWeight,
        borderBottomWidth: node.strokeWeight,
        borderLeftWidth: node.strokeWeight,
      };
    } else {
      const _node = node as RectangleNode | FrameNode | InstanceNode | ComponentNode | ComponentSetNode;
      return {
        borderTopWidth: _node.strokeTopWeight,
        borderRightWidth: _node.strokeRightWeight,
        borderBottomWidth: _node.strokeBottomWeight,
        borderLeftWidth: _node.strokeLeftWeight,
      };
    }
  }
}

function _getBorderRadius(
  node:
    | BooleanOperationNode
    | ComponentNode
    | ComponentSetNode
    | EllipseNode
    | FrameNode
    | HighlightNode
    | InstanceNode
    | PolygonNode
    | RectangleNode
    | StarNode
    | VectorNode
): {
  borderTopLeftRadius: number | undefined;
  borderTopRightRadius: number | undefined;
  borderBottomLeftRadius: number | undefined;
  borderBottomRightRadius: number | undefined;
} {
  if (typeof node.cornerRadius === 'number') {
    return {
      borderTopLeftRadius: node.cornerRadius, //
      borderTopRightRadius: node.cornerRadius,
      borderBottomLeftRadius: node.cornerRadius,
      borderBottomRightRadius: node.cornerRadius,
    };
  } else {
    if ('topLeftRadius' in node && 'topRightRadius' in node && 'bottomLeftRadius' in node && 'bottomRightRadius' in node) {
      return {
        borderTopLeftRadius: node.topLeftRadius,
        borderTopRightRadius: node.topRightRadius,
        borderBottomLeftRadius: node.bottomLeftRadius,
        borderBottomRightRadius: node.bottomRightRadius,
      };
    } else {
      throw new Error('cornerRadius is present but topLeftRadius, topRightRadius, bottomLeftRadius, bottomRightRadius are not present');
    }
  }
}

function _getPadding(sceneNode: ComponentNode | ComponentSetNode | FrameNode | InferredAutoLayoutResult | InstanceNode): {
  paddingTop: number | undefined;
  paddingBottom: number | undefined;
  paddingLeft: number | undefined;
  paddingRight: number | undefined;
} {
  const paddingTop = sceneNode.paddingTop;
  const paddingBottom = sceneNode.paddingBottom;
  const paddingLeft = sceneNode.paddingLeft;
  const paddingRight = sceneNode.paddingRight;
  return { paddingTop, paddingBottom, paddingLeft, paddingRight };
}

function _getAlignSelf(
  sceneNode:
    | BooleanOperationNode
    | ComponentNode
    | ComponentSetNode
    | EllipseNode
    | FrameNode
    | GroupNode
    | HighlightNode
    | InstanceNode
    | LineNode
    | PolygonNode
    | RectangleNode
    | SliceNode
    | StampNode
    | StarNode
    | TextNode
    | VectorNode
    | WashiTapeNode
): 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline' {
  const isChildOfAutoLayout = _isParentAutoLayout(sceneNode);
  if (!isChildOfAutoLayout) return 'auto';

  const layoutAlign = sceneNode.layoutAlign as AutoLayoutChildrenMixin['layoutAlign'];
  switch (layoutAlign) {
    case 'MIN':
      return 'flex-start';
    case 'CENTER':
      return 'center';
    case 'MAX':
      return 'flex-end';
    case 'STRETCH':
      return 'stretch';
    case 'INHERIT':
      return 'auto';
    default:
      assertNever(layoutAlign);
      throw new Error('Unexpected layoutAlign');
      function assertNever(shouldBeNever: never) {}
  }
}

function _getShadows(
  sceneNode:
    | BooleanOperationNode
    | ComponentNode
    | ComponentSetNode
    | EllipseNode
    | FrameNode
    | GroupNode
    | HighlightNode
    | InstanceNode
    | LineNode
    | PolygonNode
    | RectangleNode
    | StampNode
    | StarNode
    | VectorNode
    | WashiTapeNode
): string {
  const effects = sceneNode.effects;
  const shadows = effects.filter((effect): effect is Effect & { type: 'DROP_SHADOW' | 'INNER_SHADOW' } =>
    ['DROP_SHADOW', 'INNER_SHADOW'].includes(effect.type)
  );
  const visibleShadows = shadows.filter((shadow) => shadow.visible);
  if (visibleShadows.length === 0) return '';

  const shadowStrings = visibleShadows.reverse().map(_getShadowString).join(', ');
  return shadowStrings;

  //helper function
  function _getShadowString(shadowEffect: Effect & { type: 'DROP_SHADOW' | 'INNER_SHADOW' }) {
    const rgbaCss = UnitConversions.figmaRgbaToCssRgbaString(shadowEffect.color);
    const insetString = shadowEffect.type === 'INNER_SHADOW' ? ' inset' : '';
    const offset = shadowEffect.offset;
    const radius = shadowEffect.radius;
    const spread = shadowEffect.spread;
    const shadowString = `${offset.x}px ${offset.y}px ${radius}px ${spread}px ${rgbaCss}${insetString}`;

    return shadowString;
  }
}

/**
 * getDropShadow와 거의 같은 함수지만 text의 경우에는 textShadow를 가져온다.
 */
function _getTextShadow(sceneNode: TextNode): {
  textShadowColor: string | undefined;
  textShadowOffset: { width: number; height: number } | undefined;
  textShadowRadius: number | undefined;
} {
  const effects = sceneNode.effects;
  const dropShadow = effects.filter((effect) => effect.type === 'DROP_SHADOW');
  if (dropShadow.length === 0) return { textShadowColor: undefined, textShadowOffset: undefined, textShadowRadius: undefined };

  const lastDropShadow = dropShadow[dropShadow.length - 1] as Effect & { type: 'DROP_SHADOW' };
  const rgbFigma = { r: lastDropShadow.color.r, g: lastDropShadow.color.g, b: lastDropShadow.color.b, a: lastDropShadow.color.a || 1 };
  const rgbaCss = UnitConversions.rgbaScaleFromFigmaToCss(rgbFigma);

  const textShadowColor = `rgba(${rgbaCss.r}, ${rgbaCss.g}, ${rgbaCss.b}, ${rgbaCss.a})`;
  const textShadowOffset =
    lastDropShadow.offset.x === 0 && lastDropShadow.offset.y === 0
      ? undefined
      : {
          width: lastDropShadow.offset.x,
          height: lastDropShadow.offset.y,
        };
  const textShadowRadius = lastDropShadow.radius;

  return { textShadowColor, textShadowOffset, textShadowRadius };
}

function _getPosition(
  sceneNode:
    | BooleanOperationNode
    | ComponentNode
    | ComponentSetNode
    | EllipseNode
    | FrameNode
    | GroupNode
    | HighlightNode
    | InstanceNode
    | LineNode
    | PolygonNode
    | RectangleNode
    | SliceNode
    | StampNode
    | StarNode
    | TextNode
    | VectorNode
    | WashiTapeNode
): 'absolute' | 'relative' {
  const isTopLevelNode = isSelected(sceneNode);
  if (isTopLevelNode) return 'relative';

  const isChildOfAutoLayout = _isParentAutoLayout(sceneNode);
  if (!isChildOfAutoLayout) return 'absolute';

  const layoutPositioning = sceneNode.layoutPositioning as AutoLayoutChildrenMixin['layoutPositioning'];
  switch (layoutPositioning) {
    case 'AUTO':
      return 'relative';
    case 'ABSOLUTE':
      return 'absolute';
    default:
      assertNever(layoutPositioning);
      throw new Error('Unexpected layoutPositioning');
      function assertNever(shouldBeNever: never) {}
  }
}

function _getFlexValues(
  sceneNode:
    | BooleanOperationNode
    | ComponentNode
    | ComponentSetNode
    | EllipseNode
    | FrameNode
    | GroupNode
    | HighlightNode
    | InstanceNode
    | LineNode
    | PolygonNode
    | RectangleNode
    | SliceNode
    | StampNode
    | StarNode
    | TextNode
    | VectorNode
    | WashiTapeNode
): { flexGrow: number; flexShrink: number; flexBasis: number | string } {
  const isChildOfAutoLayout = _isParentAutoLayout(sceneNode);
  if (!isChildOfAutoLayout) return { flexGrow: 0, flexShrink: 0, flexBasis: 'auto' };

  const layoutGrow = sceneNode.layoutGrow as AutoLayoutChildrenMixin['layoutGrow'];
  const flexGrow = layoutGrow;
  const flexShrink = !!layoutGrow ? 1 : 0;
  const flexBasis = !!layoutGrow ? 0 : 'auto';
  return { flexGrow, flexShrink, flexBasis }; // "1 1 0" or "0 0 auto"
}

function _getRealPositionSize(
  sceneNode:
    | ComponentNode
    | ComponentSetNode
    | EllipseNode
    | FrameNode
    | HighlightNode
    | InstanceNode
    | LineNode
    | PolygonNode
    | RectangleNode
    | StampNode
    | StarNode
    | TextNode
    | VectorNode
    | GroupNode
    | BooleanOperationNode
): {
  top: number | undefined;
  bottom: number | undefined;
  height: number | undefined;
  left: number | undefined;
  right: number | undefined;
  width: number | undefined;
} {
  if (
    sceneNode.type === 'GROUP' || //
    sceneNode.type === 'BOOLEAN_OPERATION' ||
    (sceneNode.parent as SceneNode).type === 'GROUP'
    // parent가 group이면 항상 veritcalConstaraint, horizontalConstraint가 'MIN'으로 작동한다.
    // 피그마에서 유저가 'left and right'등으로 설정을 하더라도 이렇게 된다.'
    // 그래서 그렇게 처리하는 GroupLikeNode처럼 처리
  ) {
    //TODO better typing.
    //@ts-ignore
    return _getRealPositionSizeForGrouplikeNode(sceneNode);
  } else {
    return _getRealPositionSizeForUsualNodes(sceneNode);
  }
}

/**
 * BooleanOperation and Group nodes do not have vertical/horizontal constraints.
 * Effectively they are always 'MIN' and 'MIN' respectively.
 */
function _getRealPositionSizeForGrouplikeNode(groupNode: GroupNode | BooleanOperationNode): {
  top: number | undefined;
  bottom: number | undefined;
  height: number | undefined;
  left: number | undefined;
  right: number | undefined;
  width: number | undefined;
} {
  const isTopLevelNode = isSelected(groupNode);

  const { width: _width, height: _height } = groupNode;
  const { halfWidth, halfHeight } = { halfWidth: _width / 2, halfHeight: _height / 2 };
  const rotatedX = groupNode.x;
  const rotatedY = groupNode.y;

  const sinTheta = mathUtils.sin(mathUtils.degreeToRadian(groupNode.rotation));
  const cosTheta = mathUtils.cos(mathUtils.degreeToRadian(groupNode.rotation));
  const center = { x: rotatedX + halfWidth * cosTheta + halfHeight * sinTheta, y: rotatedY - halfWidth * sinTheta + halfHeight * cosTheta };

  const angle = groupNode.rotation;

  const unrotatedX =
    (rotatedX - center.x) * mathUtils.cos(mathUtils.degreeToRadian(angle)) -
    (rotatedY - center.y) * mathUtils.sin(mathUtils.degreeToRadian(angle)) +
    center.x;
  const unrotatedY =
    (rotatedX - center.x) * mathUtils.sin(mathUtils.degreeToRadian(angle)) +
    (rotatedY - center.y) * mathUtils.cos(mathUtils.degreeToRadian(angle)) +
    center.y;

  const _top = unrotatedY;
  const _left = unrotatedX;

  const heightOfParent = (groupNode.parent as SceneNode & { height: number }).height || 0;
  const _bottom = heightOfParent - (_top + _height);

  const widthOfParent = (groupNode.parent as SceneNode & { width: number }).width || 0;
  const _right = widthOfParent - (_left + _width);

  const top = mathUtils.round(_top, 0);
  const bottom = mathUtils.round(_bottom, 0);
  const left = mathUtils.round(_left, 0);
  const right = mathUtils.round(_right, 0);
  let height: number | undefined = mathUtils.round(_height, 0);
  let width: number | undefined = mathUtils.round(_width, 0);

  const result: {
    top: number | undefined;
    bottom: number | undefined;
    height: number | undefined;
    left: number | undefined;
    right: number | undefined;
    width: number | undefined;
  } = { top: undefined, bottom: undefined, height: undefined, left: undefined, right: undefined, width: undefined };

  //
  // 예외처리들
  //

  // ❗ 'hug contents'나 'fill container'일 경우에는 width, height를 undefined로 설정한다.
  if (groupNode.layoutSizingHorizontal !== 'FIXED' /* "HUG" or "FILL" 즉, parent의 auto-layout에 의해 결정될 경우 */) {
    width = undefined;
  }
  if (groupNode.layoutSizingVertical !== 'FIXED' /* "HUG" or "FILL" 즉, parent의 auto-layout에 의해 결정될 경우 */) {
    height = undefined;
  }

  // 선택된 최상위개체이면 top, left를 0으로 설정한다. 캔버스 안에서 어느 위치에 있는게 중요한 게 아니잖아?
  if (isTopLevelNode) {
    return { top: 0, bottom: undefined, height: height, left: 0, right: undefined, width: width };
  }

  // relative일 경우에는 top, left를 0으로 설정한다. figma에는 relative + top, left 설정하는 방법이 없다. relative면 무조건 0에 해당.
  if (_getPosition(groupNode) === 'relative') {
    Object.assign(result, { top: 0, bottom: undefined, height, left: 0, right: undefined, width });
    return result;
  }

  // Frame이라면 vertical/horizonatl constraint 가 'MIN'인것과 똑같이 처리
  // 이건 약간 버그인 것 같은데 GroupNode의 경우 Figma app안에서는 size기준을 left, right, left-and-right중에 선택할 수 있으나
  // 그게 GroupNode안에 저장이 안되는 것 같다.
  // 그래서 left, top으로 항상 처리함.
  Object.assign(result, { top: top, bottom: undefined, height });
  Object.assign(result, { left: left, right: undefined, width });

  let parent = groupNode.parent;
  if (parent && parent.type === 'GROUP') {
    (['top', 'bottom', 'left', 'right'] as const)
      .filter((key) => result[key] !== undefined)
      .forEach((key) => {
        const parentAsGroup = parent as GroupNode;
        // const parentalTRBL = _getRealPositionSizeForGrouplikeNode(parentAsGroup); // 그냥 parentAsGroup.x, y 쓰는게 맞는듯
        switch (key) {
          case 'top': {
            result[key] = (result[key] as number) - (parentAsGroup.y || 0);
            break;
          }
          case 'bottom': {
            const grandParent = parentAsGroup.parent as SceneNode & { height: number };
            result[key] = (result[key] as number) - (grandParent.height - ((parentAsGroup.y || 0) + (parentAsGroup.height || 0)));
            break;
          }
          case 'left': {
            result[key] = (result[key] as number) - (parentAsGroup.x || 0);
            break;
          }
          case 'right': {
            const grandParent = parentAsGroup.parent as SceneNode & { width: number };
            result[key] = (result[key] as number) - (grandParent.width - ((parentAsGroup.x || 0) + (parentAsGroup.width || 0)));
            break;
          }
          default: {
            return;
          }
        }
      });
  }
  return result;
}
function _getRealPositionSizeForUsualNodes(
  sceneNode:
    | ComponentNode
    | ComponentSetNode
    | EllipseNode
    | FrameNode
    | HighlightNode
    | InstanceNode
    | LineNode
    | PolygonNode
    | RectangleNode
    | StampNode
    | StarNode
    | TextNode
    | VectorNode
): {
  top: number | undefined;
  bottom: number | undefined;
  height: number | undefined;
  left: number | undefined;
  right: number | undefined;
  width: number | undefined;
} {
  const isTopLevelNode = isSelected(sceneNode);

  const { width: _width, height: _height } = sceneNode;
  const { halfWidth, halfHeight } = { halfWidth: _width / 2, halfHeight: _height / 2 };
  const rotatedX = sceneNode.x;
  const rotatedY = sceneNode.y;

  const sinTheta = mathUtils.sin(mathUtils.degreeToRadian(sceneNode.rotation));
  const cosTheta = mathUtils.cos(mathUtils.degreeToRadian(sceneNode.rotation));
  const center = { x: rotatedX + halfWidth * cosTheta + halfHeight * sinTheta, y: rotatedY - halfWidth * sinTheta + halfHeight * cosTheta };

  const angle = sceneNode.rotation;

  const unrotatedX =
    (rotatedX - center.x) * mathUtils.cos(mathUtils.degreeToRadian(angle)) -
    (rotatedY - center.y) * mathUtils.sin(mathUtils.degreeToRadian(angle)) +
    center.x;
  const unrotatedY =
    (rotatedX - center.x) * mathUtils.sin(mathUtils.degreeToRadian(angle)) +
    (rotatedY - center.y) * mathUtils.cos(mathUtils.degreeToRadian(angle)) +
    center.y;

  const { vertical: verticalConstraint } = sceneNode.constraints;
  const { horizontal: horizontalConstraint } = sceneNode.constraints;

  const _top = unrotatedY;
  const _left = unrotatedX;

  const heightOfParent = (sceneNode.parent as SceneNode & { height: number }).height || 0;
  const _bottom = heightOfParent - (_top + _height);

  const widthOfParent = (sceneNode.parent as SceneNode & { width: number }).width || 0;
  const _right = widthOfParent - (_left + _width);

  const top = mathUtils.round(_top, 0);
  const bottom = mathUtils.round(_bottom, 0);
  const left = mathUtils.round(_left, 0);
  const right = mathUtils.round(_right, 0);
  let height: number | undefined = mathUtils.round(_height, 0);
  let width: number | undefined = mathUtils.round(_width, 0);

  const result: {
    top: number | undefined;
    bottom: number | undefined;
    height: number | undefined;
    left: number | undefined;
    right: number | undefined;
    width: number | undefined;
  } = { top: undefined, bottom: undefined, height: undefined, left: undefined, right: undefined, width: undefined };

  //
  // 예외처리들
  //

  // ❗ 'hug contents'나 'fill container'일 경우에는 width, height를 undefined로 설정한다.
  if (sceneNode.layoutSizingHorizontal !== 'FIXED' /* "HUG" or "FILL" 즉, parent의 auto-layout에 의해 결정될 경우 */) {
    width = undefined;
  }
  if (sceneNode.layoutSizingVertical !== 'FIXED' /* "HUG" or "FILL" 즉, parent의 auto-layout에 의해 결정될 경우 */) {
    height = undefined;
  }

  // 선택된 최상위개체이면 top, left를 0으로 설정하고, width와 height를 리턴한다. 캔버스 안에서 어느 위치에 있는게 중요한 게 아니잖아?
  if (isTopLevelNode) {
    return { top: 0, bottom: undefined, height: height, left: 0, right: undefined, width: width }; // 바로 리턴
  }

  // relative일 경우에는 top, left를 0으로 설정한다. figma에는 relative + top, left 설정하는 방법이 없다. relative면 무조건 0에 해당.
  if (_getPosition(sceneNode) === 'relative') {
    Object.assign(result, { top: 0, bottom: undefined, height, left: 0, right: undefined, width });
    return result;
  }

  switch (verticalConstraint) {
    case 'MIN': {
      Object.assign(result, { top: top, bottom: undefined, height });
      break;
    }
    case 'MAX': {
      Object.assign(result, { top: undefined, bottom, height });
      break;
    }
    case 'STRETCH': {
      Object.assign(result, { top: top, bottom, height: undefined });
      break;
    }
    case 'CENTER': {
      //TODO this is not supported
      console.warn('constraint = "CENTER" is not supported');
      Object.assign(result, { top: top, bottom, height: undefined });
      break;
    }
    case 'SCALE': {
      //TODO this is not supported
      console.warn('constraint = "SCALE" is not supported');
      Object.assign(result, { top: top, bottom, height: undefined });
      break;
    }
    default: {
      assertNever(verticalConstraint);
      throw new Error('Unexpected verticalConstraint');
      function assertNever(shouldBeNever: never) {}
    }
  }

  switch (horizontalConstraint) {
    case 'MIN': {
      Object.assign(result, { left: left, right: undefined, width });
      break;
    }
    case 'MAX': {
      Object.assign(result, { left: undefined, right, width });
      break;
    }
    case 'STRETCH': {
      Object.assign(result, { left: left, right, width: undefined });
      break;
    }
    case 'CENTER': {
      //TODO this is not supported
      console.warn('constraint = "CENTER" is not supported');
      Object.assign(result, { left: left, right, width: undefined });
      break;
    }
    case 'SCALE': {
      //TODO this is not supported
      console.warn('constraint = "SCALE" is not supported');
      Object.assign(result, { left: left, right, width: undefined });
      break;
    }
    default: {
      assertNever(horizontalConstraint);
      throw new Error('Unexpected horizontalConstraint');
      function assertNever(shouldBeNever: never) {}
    }
  }

  let parent = sceneNode.parent;
  if (parent && parent.type === 'GROUP') {
    (['top', 'bottom', 'left', 'right'] as const)
      .filter((key) => result[key] !== undefined)
      .forEach((styleKey) => {
        const parentAsGroup = parent as GroupNode;
        switch (styleKey) {
          case 'top': {
            result[styleKey] = (result[styleKey] as number) - parentAsGroup.y;
            break;
          }
          case 'bottom': {
            const grandParent = parentAsGroup.parent as SceneNode & { height: number };
            result[styleKey] = (result[styleKey] as number) - (grandParent.height - (parentAsGroup.y + parentAsGroup.height));
            break;
          }
          case 'left': {
            result[styleKey] = (result[styleKey] as number) - parentAsGroup.x;
            break;
          }
          case 'right': {
            const grandParent = parentAsGroup.parent as SceneNode & { width: number };
            result[styleKey] = (result[styleKey] as number) - (grandParent.width - (parentAsGroup.x + parentAsGroup.width));
            break;
          }
          default: {
            return;
          }
        }
      });
  }
  return result;
}

export async function getTextStylesAsync(textNode: TextNode, range = { start: 0, end: 1 }) {
  if (textNode.characters.length === 0)
    // 이해가 안되지만 글자가 없는데 figma TextNode가 생성되는 경우가 있다??
    return {
      fontFamily: undefined,
      fontSize: undefined,
      textAlign: undefined,
      letterSpacing: undefined,
      lineHeight: undefined,
      textDecorationLine: undefined,
      color: undefined,
    };

  const { textAlignHorizontal, textAlignVertical, textStyleId } = textNode;

  const fontName = textNode.getRangeFontName(range.start, range.end);

  if (fontName === figma.mixed) throw new Error('mixed font name. This is not supposed to happen');
  fontStore.store({ kind: isGoogleFont(fontName.family) ? 'GoogleFont' : 'LocalFont', fontFamily: fontName.family, fontStyle: fontName.style });

  const fontSize = textNode.getRangeFontSize(range.start, range.end);
  const letterSpacing = textNode.getRangeLetterSpacing(range.start, range.end);
  let letterSpacingInPixel: number;
  //@ts-ignore
  if (letterSpacing.unit === 'PERCENT') {
    //@ts-ignore
    letterSpacingInPixel = (fontSize * letterSpacing.value) / 100;
  } else {
    //@ts-ignore
    letterSpacingInPixel = letterSpacing.value;
  }

  const lineHeight = textNode.getRangeLineHeight(range.start, range.end);

  let lineHeightInPixel: number;
  //@ts-ignore
  if (lineHeight.unit === 'PERCENT') {
    //@ts-ignore
    lineHeightInPixel = (fontSize * lineHeight.value) / 100;
    //@ts-ignore
  } else if (lineHeight.unit === 'PIXELS') {
    //@ts-ignore
    lineHeightInPixel = lineHeight.value;
    //@ts-ignore
  } else {
    //lineheight.unit === "AUTO"
    //@ts-ignore
    lineHeightInPixel = undefined;
  }

  // const textCase = textNode.getRangeTextCase(0, 1);
  const textDecoration = textNode.getRangeTextDecoration(range.start, range.end) as TextDecoration;
  // enum('none', 'underline', 'line-through', 'underline line-through')
  const textDecorationLine = textDecoration === 'UNDERLINE' ? 'underline' : textDecoration === 'STRIKETHROUGH' ? 'line-through' : undefined;

  const textAlign: 'left' | 'right' | 'center' | 'justify' = _textAlignHorizontalToTextAlign(textAlignHorizontal);
  const fillColor = await _getFillColorAsync(textNode, { start: range.start, end: range.end });

  let fontWeight = textNode.getRangeFontWeight(range.start, range.end).toString();

  return {
    //@ts-ignore
    fontFamily: fontName.family,
    fontSize,
    fontWeight,
    textAlign,
    letterSpacing: letterSpacingInPixel,
    lineHeight: lineHeightInPixel,
    textDecorationLine,
    color: fillColor,
  };

  // helper functions
  function _textAlignHorizontalToTextAlign(textAlignHorizontal: TextNode['textAlignHorizontal']) {
    switch (textAlignHorizontal) {
      case 'LEFT': {
        return 'left';
      }
      case 'RIGHT': {
        return 'right';
      }
      case 'CENTER': {
        return 'center';
      }
      case 'JUSTIFIED': {
        return 'justify';
      }
    }
  }
}

function _getTransform(
  sceneNode:
    | BooleanOperationNode
    | ComponentNode
    | ComponentSetNode
    | EllipseNode
    | FrameNode
    | GroupNode
    | HighlightNode
    | InstanceNode
    | LineNode
    | PolygonNode
    | RectangleNode
    | SliceNode
    | StampNode
    | StarNode
    | TextNode
    | VectorNode
    | WashiTapeNode
) {
  const { rotation } = sceneNode;
  const negativeRotation = -rotation;

  if (rotation === 0) {
    return { transform: undefined };
  } else {
    return { transform: [{ rotateZ: `${negativeRotation.toFixed(2)}deg` }] };
  }
}

function _isParentAutoLayout(sceneNode: SceneNode): sceneNode is SceneNode & AutoLayoutChildrenMixin {
  if (!sceneNode.parent) return false;
  if (!('layoutMode' in sceneNode.parent)) return false;

  const layoutModeOfParent = sceneNode.parent.layoutMode;
  switch (layoutModeOfParent) {
    case 'NONE': {
      return false;
    }
    case 'HORIZONTAL': {
      return true;
    }
    case 'VERTICAL': {
      return true;
    }
    default: {
      assertNever(layoutModeOfParent);
      throw new Error('Unexpected layoutMode');
      function assertNever(shouldBeNever: never) {
        throw new Error('Unexpected layoutMode');
      }
    }
  }
}

function isSelected(node: SceneNode): boolean {
  return figma.currentPage.selection.includes(node);
}

function _getStrokeColor(
  node:
    | TextNode
    | VectorNode
    | BooleanOperationNode
    | ComponentNode
    | ComponentSetNode
    | EllipseNode
    | FrameNode
    | HighlightNode
    | InstanceNode
    | PolygonNode
    | RectangleNode
    | StarNode
): string | undefined {
  const solidStrokes = node.strokes.filter((elem): elem is SolidPaint => {
    return elem.type === 'SOLID';
  });

  if (solidStrokes.length !== 0) {
    const lastSolidStroke = solidStrokes[solidStrokes.length - 1] as SolidPaint;
    const rgbFigma = { r: lastSolidStroke.color.r, g: lastSolidStroke.color.g, b: lastSolidStroke.color.b, a: lastSolidStroke.opacity || 1 };
    const rgbaCss = UnitConversions.rgbaScaleFromFigmaToCss(rgbFigma);
    const rgbaString = `rgba(${rgbaCss.r}, ${rgbaCss.g}, ${rgbaCss.b}, ${rgbaCss.a})`;
    return rgbaString;
  }

  return undefined;
}

async function _getFillColorAsync(
  node:
    | BooleanOperationNode
    | ComponentNode
    | ComponentSetNode
    | EllipseNode
    | FrameNode
    | HighlightNode
    | InstanceNode
    | LineNode
    | PolygonNode
    | RectangleNode
    | SectionNode
    | ShapeWithTextNode
    | StampNode
    | StarNode
    | StickyNode
    | TableCellNode
    | TableNode
    | TextNode
    | VectorNode
    | WashiTapeNode,
  rangeInText?: { start: number; end: number }
) {
  // Text 같은 경우, 한 노드 안에 여러가지 fill이 있을 수 있다. 이 때 fill값은 figma.mixed가 된다.
  // 그렇지 않은 경우 fills = Paint[] 이다.

  // 현재 TextNode에서 fill을 어떻게 가져오는지 파악해야 한다.

  let fills = node.fills;
  if (fills === figma.mixed) {
    if (node.type !== 'TEXT') {
      throw new Error(`I though fills value of FIGMA.MIXED can only happen in Text Node. But it happened in ${node.type}`);
    }
    if (!rangeInText) {
      throw new Error('To get fills of text node, you should provide range');
    }
    fills = node.getRangeFills(rangeInText.start, rangeInText.end);
    if (fills === figma.mixed) {
      throw new Error('Text  Range set is wrong so that the fills returned is figma.mixed');
    }
  }

  // at this point, fills is Paint[]
  const visibleFills = fills.filter((fill) => fill.visible);
  if (visibleFills.length === 0) return 'transparent';

  const result = await _figmaFillsToCssAsync(visibleFills);
  return result;

  //helper function
  async function _figmaFillsToCssAsync(fills: Paint[]): Promise<string> {
    if (!fills || !fills.length) return 'transparent';

    const backgrounds = await Promise.all(
      fills.reverse().map(async (fill: Paint) => {
        switch (fill.type) {
          case 'SOLID': {
            const colorString = UnitConversions.figmaRgbaToCssRgbaString(Object.assign({}, fill.color, { a: fill.opacity || 0 }));
            return fill.color ? `linear-gradient(${colorString}, ${colorString})` : ``;
          }
          case 'GRADIENT_LINEAR': {
            const stopsLinear = fill.gradientStops
              .map(
                (stop) =>
                  `rgba(${Math.round(stop.color.r * 255)}, ${Math.round(stop.color.g * 255)}, ${Math.round(stop.color.b * 255)}, ${
                    stop.color.a
                  }) ${Math.round(stop.position * 100)}%`
              )
              .join(', ');
            return `linear-gradient(${stopsLinear})`;
          }
          case 'GRADIENT_RADIAL': {
            const stopsRadial = fill.gradientStops
              .map(
                (stop) =>
                  `rgba(${Math.round(stop.color.r * 255)}, ${Math.round(stop.color.g * 255)}, ${Math.round(stop.color.b * 255)}, ${
                    stop.color.a
                  }) ${Math.round(stop.position * 100)}%`
              )
              .join(', ');
            return `radial-gradient(${stopsRadial})`;
          }
          case 'GRADIENT_ANGULAR': {
            // For simplicity, mapping to a conic-gradient in CSS
            const stopsAngular = fill.gradientStops
              .map(
                (stop) =>
                  `rgba(${Math.round(stop.color.r * 255)}, ${Math.round(stop.color.g * 255)}, ${Math.round(stop.color.b * 255)}, ${
                    stop.color.a
                  }) ${Math.round(stop.position * 100)}%`
              )
              .join(', ');
            return `conic-gradient(${stopsAngular})`;
          }
          case 'GRADIENT_DIAMOND': {
            // This doesn't have a direct CSS counterpart, but can be approximated with a radial gradient
            const stopsDiamond = fill.gradientStops
              .map(
                (stop) =>
                  `rgba(${Math.round(stop.color.r * 255)}, ${Math.round(stop.color.g * 255)}, ${Math.round(stop.color.b * 255)}, ${
                    stop.color.a || 1
                  }) ${Math.round(stop.position * 100)}%`
              )
              .join(', ');
            return `radial-gradient(circle farthest-side at center center, ${stopsDiamond})`;
          }
          case 'IMAGE': {
            const imageHash = fill.imageHash;
            if (!imageHash) return 'transpaent';

            const image = figma.getImageByHash(imageHash);
            if (!image) return 'transparent';
            const bytes = await image.getBytesAsync();

            if (!bytes) return 'transparent';
            mediaStore.store(imageHash, bytes);
            // @ts-ignore 바로 윗줄에서 방금 만들었으니까 당연히 존재함.
            const url = `${mediaStore.get(imageHash).filename}`;
            return `url('${url}')`;
          }
          default: {
            return 'transparent';
          }
        }
      })
    );

    return backgrounds.join(', ');
  }

  // Example usage:
  // Assuming you have a selected Figma node
  // const cssFill = figmaFillToCSS(figma.currentPage.selection[0]);
}
