const { exec, execSync } = require('child_process');
const { appendFileSync, copyFileSync, readFile, readFileSync } = require('fs');

exec('yarn rspack -c ./rspack.ui.config.js', () => {
  copyFileSync('./src/ui/ui.html', './dist/ui.html');
  const uiCode = readFileSync('./temp/uiAppEntry.js').toString();
  appendFileSync('./dist/ui.html', '<script>\n' + uiCode + '\n</script>');
});
execSync('yarn rspack -c ./rspack.index.config.js');
