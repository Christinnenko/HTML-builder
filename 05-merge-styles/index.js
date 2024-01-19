const fs = require('fs/promises');
const path = require('path');

async function buildCSSBundle() {
  try {
    const stylesFolderPath = path.join(__dirname, 'styles');
    const projectDistFolderPath = path.join(__dirname, 'project-dist');
    const bundleFilePath = path.join(projectDistFolderPath, 'bundle.css');

    await fs.mkdir(projectDistFolderPath, { recursive: true });

    const files = await fs.readdir(stylesFolderPath, { withFileTypes: true });

    const cssFiles = files.filter(
      (file) => file.isFile() && path.extname(file.name) === '.css',
    );

    const cssBundle = await Promise.all(
      cssFiles.map(async (file) => {
        const filePath = path.join(stylesFolderPath, file.name);
        const cssContent = await fs.readFile(filePath, 'utf-8');
        return `/* ${file.name} */\n${cssContent}\n`;
      }),
    );

    await fs.writeFile(bundleFilePath, cssBundle.join('\n'));

    console.log(`CSS bundle created at: ${bundleFilePath}`);
  } catch (error) {
    console.error(`Error building CSS bundle: ${error.message}`);
  }
}

buildCSSBundle();
