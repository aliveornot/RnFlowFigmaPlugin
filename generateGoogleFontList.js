(async () => {
  const fs = await import('fs/promises');
  const fetch = (await import('node-fetch')).default;
  (await import('dotenv')).config();

  const API_KEY = process.env.GOOGLE_WEB_FONTS_API_KEY;
  const ENDPOINT = `https://www.googleapis.com/webfonts/v1/webfonts?key=${API_KEY}`;
  const OUTPUT_FILE = 'src/codegen/store/fontStore/googleFontFullList.ts';

  try {
    const response = await fetch(ENDPOINT);
    const data = await response.json();

    await fs.writeFile(OUTPUT_FILE, 'export const googleFontFullList = ' + JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Saved fonts list to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error('There was an error retrieving the fonts:', error);
  }
})();
