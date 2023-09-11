/**
 * Remove reading slashes, numbers and spaces, and capitalize the first letter of each word.
 *
 */
export default function getCodeFriendlyVariableName(str: string): string {
  // Remove leading slashes, numbers and spaces
  let name = str.replace(/^\/+/, '').replace(/^\d+/, '').replace(/\s+/g, '');

  // Capitalize the first letters after slashes
  let parts = name.split('/');
  for (let i = 0; i < parts.length; i++) {
    parts[i] = parts[i].charAt(0).toUpperCase() + parts[i].slice(1);
  }
  name = parts.join('');

  // Remove any invalid characters
  // name = name.replace(/[^a-zA-Z0-9_$]/g, '');
  name = name.replace(/[^\p{L}\p{N}_$]/gu, ''); // 유니코드

  // If the first character is a number, prefix it with an underscore
  if (/^\d/.test(name)) {
    name = '_' + name;
  }

  // If the name is empty, use a default name
  if (name === '') {
    name = 'MyVar';
  }

  // lowercase the first letter
  name = name.charAt(0).toLowerCase() + name.slice(1);

  return name;
}
