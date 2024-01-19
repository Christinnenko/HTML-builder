const fs = require('fs/promises');
const path = require('path');

async function copyDir(srcDir, destDir) {
  try {
    await fs.mkdir(destDir, { recursive: true });

    const files = await fs.readdir(srcDir, { withFileTypes: true });

    for (const file of files) {
      const srcPath = path.join(srcDir, file.name);
      const destPath = path.join(destDir, file.name);

      if (file.isDirectory()) {
        await copyDir(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }

    const destFiles = await fs.readdir(destDir);
    for (const destFile of destFiles) {
      const destFilePath = path.join(destDir, destFile);

      if (!files.some((file) => file.name === destFile)) {
        await fs.unlink(destFilePath);
        console.log(`File ${destFile} deleted from ${destDir}`);
      }
    }

    console.log(`Directory copied from ${srcDir} to ${destDir}`);
  } catch (error) {
    console.error(`Error copying directory: ${error.message}`);
  }
}

const srcDirPath = path.join(__dirname, 'files');
const destDirPath = path.join(__dirname, 'files-copy');

copyDir(srcDirPath, destDirPath);
