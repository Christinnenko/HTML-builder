const fs = require('fs/promises');
const path = require('path');

async function readFilesInFolder(folderPath) {
  try {
    const files = await fs.readdir(folderPath, { withFileTypes: true });

    for (const file of files) {
      const filePath = path.join(folderPath, file.name);
      const stats = await fs.stat(filePath);

      if (stats.isFile()) {
        const fileSize = stats.size;
        const fileExtension = path.extname(file.name);

        console.log(`${file.name} - ${fileExtension} - ${fileSize} bytes`);
      } else if (stats.isDirectory()) {
        await readFilesInFolder(filePath);
      }
    }
  } catch (error) {
    console.error(`Error reading files: ${error.message}`);
  }
}

const folderPath = path.join(__dirname, 'secret-folder');
readFilesInFolder(folderPath);
