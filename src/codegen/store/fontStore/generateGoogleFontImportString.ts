export default function figmaFontToGoogleImport({ fontFamily, fontStyle }: { fontFamily: string; fontStyle: string }) {
  // Encode font name to be URL safe (replaces spaces with +)
  let encodedFontName = encodeURIComponent(fontFamily).replace(/%20/g, '+');

  // Convert the fontStyle to Google Fonts naming convention
  let italic = fontStyle.toLowerCase().includes('italic') ? 'ital,' : '';
  let weight = 400; // default weight

  if (fontStyle.toLowerCase().includes('thin')) {
    weight = 100;
  } else if (fontStyle.toLowerCase().includes('extralight')) {
    weight = 200;
  } else if (fontStyle.toLowerCase().includes('light')) {
    weight = 300;
  } else if (fontStyle.toLowerCase().includes('medium')) {
    weight = 500;
  } else if (fontStyle.toLowerCase().includes('semibold')) {
    weight = 600;
  } else if (fontStyle.toLowerCase().includes('bold')) {
    weight = 700;
  } else if (fontStyle.toLowerCase().includes('extrabold')) {
    weight = 800;
  } else if (fontStyle.toLowerCase().includes('black')) {
    weight = 900;
  }

  // Construct the import URL
  let url = `https://fonts.googleapis.com/css2?family=${encodedFontName}:wght@${weight}${italic}&display=swap`;

  return `@import url('${url}');`;
}
