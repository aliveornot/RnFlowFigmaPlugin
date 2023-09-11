import { VElement, VElementKind } from '../types/types';

export default function vDomToCode(vDom: VElement): string {
  if (vDom.kind === VElementKind.BLANK) {
    return '';
  }

  _makeNamesUniqueRecursive(vDom); //mutation
  const modulesToImport = _getModulesToImportsRecursive(vDom);

  //capitalize first letter for functionName
  const functionName = vDom.name.charAt(0).toUpperCase() + vDom.name.slice(1);

  const jsxCodePieces = writeJsxCodeFromVDom(vDom);

  const styles = _generateStylesRecusrive(vDom, {} as Record<string, Record<string, any>>);

  const fullCode = `import React from 'react';
import { ${[...Array.from(modulesToImport.reactComponents), 'StyleSheet'].join(', ')} } from 'react-native';

export default function ${functionName}() {
  return (
${jsxCodePieces.join('\n')}
  )
}

const styles = {
\t${Object.entries(styles)
    .map(([name, style]) => `${name}: ${customStringify(style, 2, 0, true)}`)
    .join(',\n\t')}
}`;

  return fullCode;

  //
  // helper functions
  //
  function _getModulesToImportsRecursive(
    vDom: VElement,
    modulesToImport: { reactComponents: Set<string>; nonReactComponents: Set<string>; reactNativeSvgComponents: Set<string> } = {
      reactComponents: new Set<string>(),
      nonReactComponents: new Set<string>(),
      reactNativeSvgComponents: new Set<string>(),
    }
  ) {
    if (vDom.kind === VElementKind.BLANK) return modulesToImport; // do nothing

    if (
      vDom.kind === VElementKind.VECTOR ||
      vDom.kind === VElementKind.ELLIPSE ||
      vDom.kind === VElementKind.LINE ||
      vDom.kind === VElementKind.POLYGON ||
      vDom.kind === VElementKind.STAR ||
      vDom.kind === VElementKind.BOOLEAN_OPERATION
    ) {
      // do nothing
    } else {
      const importName = _getTagNameFromVDom(vDom);
      modulesToImport.reactComponents.add(importName);
    }
    vDom.children.forEach((child) => _getModulesToImportsRecursive(child, modulesToImport));

    return modulesToImport;
  }

  /**
   * vDom is manipulated, and the result is vDom items with unique names.
   */
  function _makeNamesUniqueRecursive(vDom: VElement, names: Set<string> = new Set<string>()): Set<string> {
    if (vDom.kind === VElementKind.BLANK) return names; // do nothing

    let uniqueName = vDom.name;
    while (true) {
      if (names.has(vDom.name)) {
        vDom.name = '_' + vDom.name;
        uniqueName = vDom.name;
      } else {
        break;
      }
    }

    names.add(uniqueName);
    vDom.children.forEach((child) => {
      names = _makeNamesUniqueRecursive(child, names);
    });
    return names;
  }

  function _generateStylesRecusrive(vDom: VElement, styles: Record<string, Record<string, any>>) {
    if (vDom.kind === VElementKind.BLANK) return styles; // do nothing

    styles[vDom.name] = vDom.style;
    vDom.children.forEach((child) => _generateStylesRecusrive(child, styles));
    return styles;
  }
}

function writeJsxCodeFromVDom(vDom: VElement): string[] {
  const jsxCodePieces: string[] = [];
  _generateJsxCodeRecursive(vDom, 0, jsxCodePieces);
  return jsxCodePieces;

  function _generateJsxCodeRecursive(vDom: VElement, depth: number, jsxCodePieces: string[]) {
    const indentationString = '\t'.repeat(depth + 2);

    if (vDom.kind === VElementKind.BLANK) {
      return; // do nothing
    } else if (vDom.kind === VElementKind.VECTOR) {
      _handleVectorCase(vDom, depth, indentationString, jsxCodePieces);
    } else if (vDom.kind === VElementKind.TEXT) {
      _handleTextCase(vDom, depth, indentationString, jsxCodePieces);
    } else if (vDom.kind == VElementKind.GROUP) {
      _handleGroupCase(vDom, depth, indentationString, jsxCodePieces);
    } else {
      _handleFrameLikeCase(vDom, depth, indentationString, jsxCodePieces);
    }
  }

  function _handleGroupCase(vDom: VElement, depth: number, indentationString: string, jsxCodePieces: string[]) {
    if (vDom.kind !== VElementKind.GROUP) {
      throw new Error(`_handleGroupCase:: ${vDom.kind} is not a valid kind`);
    }

    let tagName = _getTagNameFromVDom(vDom); // 'View' or 'ImageBackground'

    if (vDom.children.length) {
      // opening element
      jsxCodePieces.push(`${indentationString}<${tagName} style={styles.${vDom.name}}>`);
      // children
      vDom.children.forEach((child) => {
        _generateJsxCodeRecursive(child, depth + 1, jsxCodePieces);
      });

      // closing element
      jsxCodePieces.push(`${indentationString}</${tagName}>`);
    } else {
      jsxCodePieces.push(`${indentationString}<${tagName} style={styles.${vDom.name}}/>`);
    }
  }

  function _handleFrameLikeCase(vDom: VElement, depth: number, indentationString: string, jsxCodePieces: string[]) {
    if (
      vDom.kind !== VElementKind.FRAME &&
      vDom.kind !== VElementKind.RECTANGLE &&
      vDom.kind !== VElementKind.COMPONENT &&
      vDom.kind !== VElementKind.INSTANCE
    ) {
      throw new Error(`_handleFrameLikeCase:: ${vDom.kind} is not a valid kind`);
    }

    let tagName = _getTagNameFromVDom(vDom); // 'View' or 'ImageBackground'

    if (depth !== 0) {
      if (vDom.kind === VElementKind.COMPONENT || vDom.kind === VElementKind.INSTANCE) {
        if (vDom.kind === VElementKind.COMPONENT) jsxCodePieces.push(`${indentationString}{/* component ${vDom.name} */}`);
        if (vDom.kind === VElementKind.INSTANCE)
          jsxCodePieces.push(
            `${indentationString}{/* RN-Flow:: can be replaced with <${vDom.name.charAt(0).toUpperCase() + vDom.name.slice(1)} ${Object.entries(
              vDom.props
            )
              .map(([key, value]) => `${key}={"${value}"}`)
              .join(' ')} /> */}`
          );
      }
    }
    if (vDom.children.length) {
      // opening element
      if (vDom.backgroundImage)
        jsxCodePieces.push(
          `${indentationString}<${tagName} style={styles.${vDom.name}} source={{uri: /* dummy image */ '${vDom.backgroundImage.source.uri}'}}>`
        );
      else jsxCodePieces.push(`${indentationString}<${tagName} style={styles.${vDom.name}}>`);
      // children
      vDom.children.forEach((child) => {
        _generateJsxCodeRecursive(child, depth + 1, jsxCodePieces);
      });

      // closing element
      jsxCodePieces.push(`${indentationString}</${tagName}>`);
    } else {
      if (vDom.backgroundImage)
        jsxCodePieces.push(
          `${indentationString}<${tagName} style={styles.${vDom.name}} source={{uri: /* dummy image */ '${vDom.backgroundImage.source.uri}'}}/>`
        );
      else jsxCodePieces.push(`${indentationString}<${tagName} style={styles.${vDom.name}}/>`);
    }
  }

  function _handleTextCase(vDom: VElement, depth: number, indentationString: string, jsxCodePieces: string[]) {
    if (vDom.kind !== VElementKind.TEXT) throw new Error(`_handleVectorCase:: ${vDom.kind} is not a valid kind`);

    const tagName = _getTagNameFromVDom(vDom); // 'Text'
    // opening element
    jsxCodePieces.push(`${indentationString}<${tagName} style={styles.${vDom.name}}>`);
    // innerText
    jsxCodePieces.push(`${indentationString}\t${vDom.textInfo.innerHtml}`);
    // closing element
    jsxCodePieces.push(`${indentationString}</${tagName}>`);
  }

  function _handleVectorCase(vDom: VElement, depth: number, indentationString: string, jsxCodePieces: string[]) {
    if (vDom.kind !== VElementKind.VECTOR) throw new Error(`_handleVectorCase:: ${vDom.kind} is not a valid kind`);

    const jsxReactString = vDom.svgString.replace(/<svg /g, `<svg style={styles.${vDom.name}} `);
    jsxCodePieces.push(jsxReactString);
    return;
  }
}

function _getTagNameFromVDom(vDom: VElement): string {
  const kind = vDom.kind;
  switch (kind) {
    case 'COMPONENT':
    case 'INSTANCE':
    case 'FRAME':
    case 'RECTANGLE':
      if (vDom.backgroundImage) return 'ImageBackground';
      else return 'View';
    case 'GROUP':
      return 'View';
    case 'TEXT':
      return 'Text';
    case 'VECTOR':
      return 'svg';
    default:
      assertNever(kind);
      throw new Error(`_kind2TagName:: ${kind} is not a valid kind`);
      function assertNever(shouldBeNever: never) {}
  }
}

/**
 * stringify without double quotes for keys
 * @param obj The object to stringify
 * @param space The number of spaces for indentation
 * @param currentIndent The current indentation level (used for recursion)
 * @param excludeUndefined If true, properties with undefined values will be excluded
 */
function customStringify(obj: AnyObject, space: number = 0, currentIndent: number = 0, excludeUndefined: boolean = false): string {
  let indent = ' '.repeat(space);
  let currentIndentStr = ' '.repeat(currentIndent);

  if (Array.isArray(obj)) {
    let elements = obj.map((value) => {
      if (typeof value === 'object' && value !== null) {
        return `${customStringify(value, space, currentIndent + space, excludeUndefined)}`;
      } else if (typeof value === 'string') {
        return `"${value}"`;
      } else {
        return `${value}`;
      }
    });
    return space
      ? `[\n${currentIndentStr}${indent}${elements.join(`,\n${currentIndentStr}${indent}`)}\n${currentIndentStr}]`
      : `[${elements.join(', ')}]`;
  }

  let entries = Object.entries(obj)
    .filter(([, value]) => !excludeUndefined || value !== undefined) // Filter out undefined values if option is true
    .map(([key, value]) => {
      let quotedKey = _quoteKeyIfNeeded(key);
      if (typeof value === 'object' && value !== null) {
        return `${currentIndentStr}${indent}${quotedKey}: ${customStringify(value, space, currentIndent + space, excludeUndefined)}`;
      } else if (typeof value === 'string') {
        return `${currentIndentStr}${indent}${quotedKey}: "${value}"`;
      } else {
        return `${currentIndentStr}${indent}${quotedKey}: ${value}`;
      }
    });

  return space ? `{\n${entries.join(',\n')}\n${currentIndentStr}}` : `{ ${entries.join(', ')} }`;

  // Utility function to quote the key if it does not start with an alphabet
  function _quoteKeyIfNeeded(key: string) {
    return /^[a-zA-Z]/.test(key) ? key : `"${key}"`;
  }
}

type AnyObject = { [key: string]: any };
