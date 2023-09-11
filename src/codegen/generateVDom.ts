import { VElement, VElementKinds } from '../types/types';
import { generateStyleOfSceneNodeAsync, getTextStylesAsync } from './style/generateStyle';
import getCodeFriendlyVariableName from './getCodeFriendlyVariableName';
const VECTOR_LIKE_NODE_TYPES = ['BOOLEAN_OPERATION', 'ELLIPSE', 'LINE', 'POLYGON', 'STAR', 'VECTOR'];

export default async function generateVDomRecusriveAsync(node: SceneNode): Promise<VElement> {
  if (!VElementKinds.includes(node.type as any)) {
    if (node.type === 'COMPONENT_SET') {
      throw new Error(`COMPONENT_SET_IN_THE_NODE:: CANNOT calculate VDOM for a ${node.type} is not a valid node type`);
    } else {
      throw new Error(`INVALID_NODE_TYPE:: CANNOT calculate VDOM for a ${node.type} is not a valid node type`);
    }
  }

  const { name } = node;
  const styleObj = await generateStyleOfSceneNodeAsync(node);

  switch (node.type) {
    case 'COMPONENT': {
      const componentNode = node as ComponentNode;
      const componentName = getProperNameOfComponentNode(componentNode);
      // const backgroundImage = _getBackgroundImage(componentNode);
      const backgroundImage = null;
      let children: VElement[] = [];
      for (const child of node.children.filter((child) => child.visible)) {
        children.push(await generateVDomRecusriveAsync(child));
      }

      return {
        name: componentName,
        kind: 'COMPONENT',
        style: styleObj,
        backgroundImage,
        children,
        props: getCodeFriendlyVariantProperties(componentNode),
      };
    }

    case 'INSTANCE': {
      const instanceNode = node as InstanceNode;
      const mainComponent = instanceNode.mainComponent;
      let mainComponentName = '';
      let props: Record<string, any> = {};

      if (mainComponent) {
        mainComponentName = getProperNameOfComponentNode(mainComponent);
        props = getCodeFriendlyVariantProperties(mainComponent);
      }

      // const backgroundImage = _getBackgroundImage(instanceNode);
      const backgroundImage = null;

      let children: VElement[] = [];
      for (const child of node.children.filter((child) => child.visible)) {
        children.push(await generateVDomRecusriveAsync(child));
      }

      return {
        name: getCodeFriendlyVariableName(name),
        kind: 'INSTANCE',
        style: styleObj,
        children,
        mainComponentName,
        backgroundImage,
        props,
      };
    }

    case 'FRAME': {
      const frameNode = node as FrameNode;
      // const backgroundImage = _getBackgroundImage(frameNode);
      const backgroundImage = null;

      let children: VElement[] = [];
      for (const child of node.children.filter((child) => child.visible)) {
        children.push(await generateVDomRecusriveAsync(child));
      }

      return {
        name: getCodeFriendlyVariableName(name),
        kind: frameNode.type as 'FRAME' | 'GROUP',
        style: styleObj,
        children,
        backgroundImage,
      };
    }

    case 'RECTANGLE': {
      const RectangleNode = node as RectangleNode;
      // const backgroundImage = _getBackgroundImage(RectangleNode);
      const backgroundImage = null;

      return {
        name: getCodeFriendlyVariableName(name),
        kind: 'RECTANGLE',

        style: styleObj,
        children: [],
        backgroundImage,
      };
    }
    case 'GROUP': {
      if (node.children.every((child) => _areAllChildrenVectorOrVectorOnlyGroup(child))) {
        //treat as a single vector node
        let svgString = '';
        try {
          svgString = await node.exportAsync({ format: 'SVG_STRING' });
          delete styleObj.transform; // exportAsync -> transform이 처리되어서 나옴
          return {
            name: getCodeFriendlyVariableName(name),
            kind: 'VECTOR',
            style: styleObj,
            children: [],
            svgString,
          };
        } catch (error) {
          return {
            name: getCodeFriendlyVariableName(name),
            kind: 'BLANK',
            style: {},
            children: [],
          };
        }
      } else {
        let children: VElement[] = [];
        for (const child of node.children.filter((child) => child.visible)) {
          children.push(await generateVDomRecusriveAsync(child));
        }

        return {
          name: getCodeFriendlyVariableName(name),
          kind: 'GROUP',
          style: styleObj,
          children,
        };
      }
    }

    case 'BOOLEAN_OPERATION':
    case 'ELLIPSE':
    case 'LINE':
    case 'POLYGON':
    case 'STAR':
    case 'VECTOR': {
      const vectorNode = node as VectorNode;

      let svgString = '';
      try {
        svgString = await vectorNode.exportAsync({ format: 'SVG_STRING' });
        delete styleObj.transform; // exportAsync -> transform이 처리되어서 나옴

        return {
          name: getCodeFriendlyVariableName(name),
          kind: 'VECTOR',
          style: styleObj,
          children: [],
          svgString,
        };
      } catch (error) {
        return {
          name: getCodeFriendlyVariableName(name),
          kind: 'BLANK',
          style: {},
          children: [],
        };
      }
    }

    case 'TEXT': {
      const textNode = node as TextNode;
      const { maxLines } = textNode;
      const innerHtml = await getInnerHtmlOfTextNodeAsync(textNode);

      return {
        name: getCodeFriendlyVariableName(name), //
        kind: 'TEXT',
        style: styleObj,
        children: [],
        textInfo: { innerHtml, maxLines },
      };
    }

    default: {
      return {
        name: getCodeFriendlyVariableName(name),
        kind: node.type as any,
        style: styleObj,
        children: [],
      };
    }
  }
}

/**
 * componenSet이 있을 경우 component의 name은 property로 얼룩져 아주 이상한 이름이 된다.
 * 따라서 componentSet의 이름을 쓰거나, 아예 componentSet이 없는 경우에는 component의 이름이 정상이므로 본 이름을 쓴다.
 */
function getProperNameOfComponentNode(mainComponent: ComponentNode) {
  if (mainComponent.parent && mainComponent.parent.type === 'COMPONENT_SET') {
    return getCodeFriendlyVariableName(mainComponent.parent.name);
  } else {
    return getCodeFriendlyVariableName(mainComponent.name);
  }
}

function getCodeFriendlyVariantProperties(component: ComponentNode): Record<string, any> {
  try {
    if (!component.variantProperties) return {};

    const props = Object.keys(component.variantProperties).reduce((acc, key) => {
      const codeFriendlyKey = getCodeFriendlyVariableName(key);
      // @ts-ignore
      acc[codeFriendlyKey] = getCodeFriendlyVariableName(component.variantProperties[key]);
      return acc;
    }, {} as Record<string, any>);
    return props;
  } catch (error) {
    return {
      props:
        'Error while retrieving the variants of your Figma component-set. Might be caused by special characters such as commas in the variant names.',
    };
    throw error;
  }
}

function _getBackgroundImage(
  sceneNode: ComponentNode | InstanceNode | FrameNode | RectangleNode
  // 아래 노드들은 fill을 가지지만 backgrroundImage로 사용하기에는 부적절할 가능성 높음(fill의 의미가 backgroundImage가 아닐 수 있음)
  // | BooleanOperationNode
  // | EllipseNode
  // | LineNode -
  // | ComponentSetNode
  // | HighlightNode
  // | PolygonNode
  // | SectionNode
  // | ShapeWithTextNode
  // | StampNode
  // | StarNode
  // | StickyNode
  // | TableCellNode
  // | TableNode
  // | WashiTapeNode
) {
  const fills = sceneNode.fills;
  if (fills instanceof Array === false) {
    throw new Error(
      `Property "fills" of a ${sceneNode.type} node is not an array. What? The author does not know when this happens. Could you please report? (admin@n3rds.io)`
    );
  }

  const imageFills = (fills as Paint[]).filter((elem): elem is SolidPaint => {
    return elem.type === 'IMAGE';
  });

  if (imageFills.length !== 0) {
    // const lastImageFill = imageFills[imageFills.length - 1] as SolidPaint;
    // const { scaleMode, scalingFactor, rotation, opacity, imageHash } = lastImageFill;
    const { width, height } = sceneNode;
    return {
      // return dummy sample image.
      source: { uri: `https://dummyimage.com/${width}x${height}/000/fff.jpg` },
    };
  } else {
    return null;
  }
}

async function getInnerHtmlOfTextNodeAsync(textNode: TextNode) {
  const motherStyle = getTextStylesAsync(textNode);

  const textSegments = textNode.getStyledTextSegments([
    'fillStyleId',
    'fills',
    'fontName',
    'fontSize',
    'fontWeight',
    'hyperlink',
    'indentation',
    'letterSpacing',
    'lineHeight',
    'listOptions',
    'textCase',
    'textStyleId',
    'textDecoration',
  ]);
  const innerHtml = await Promise.all(
    textSegments.map(async (segment, index) => {
      const { characters: _characters, start, end } = segment;
      const characters = _characters.replace(/\n/g, '\\n');

      if (index === 0) {
        return `{\`${characters}\`}`;
      } else {
        const segmentRnStyle = await getTextStylesAsync(textNode, { start, end });

        const filteredSegmentRnStyle = Object.entries(segmentRnStyle).reduce((accu, [key, value]) => {
          if (value !== motherStyle[key as keyof typeof motherStyle]) {
            Object.assign(accu, { [key]: value });
            return accu;
          } else {
            return accu;
          }
        }, {});

        if (Object.keys(filteredSegmentRnStyle).length === 0) {
          return `{\`${characters}\`}`;
        } else {
          const segmentStyleString = JSON.stringify(filteredSegmentRnStyle);
          return `<Text style={${segmentStyleString}}>{\`${characters}\`}</Text>`;
        }
      }
    })
  );

  return innerHtml.join('');
}

function _areAllChildrenVectorOrVectorOnlyGroup(node: SceneNode): boolean {
  if (VECTOR_LIKE_NODE_TYPES.includes(node.type) || (node.type === 'RECTANGLE' && _getBackgroundImage(node) === null)) {
    return true;
  }

  if (node.type === 'GROUP') {
    return (node as GroupNode).children.every(_areAllChildrenVectorOrVectorOnlyGroup);
  }

  return false;
}
