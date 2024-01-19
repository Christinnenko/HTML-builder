const fs = require('fs').promises;
const path = require('path');

const projectDistFolderPath = path.join(__dirname, 'project-dist');
const componentsFolderPath = path.join(__dirname, 'components');
const stylesFolderPath = path.join(__dirname, 'styles');
const templateFilePath = path.join(__dirname, 'template.html');
const indexFilePath = path.join(projectDistFolderPath, 'index.html');
const styleFilePath = path.join(projectDistFolderPath, 'style.css');

async function copyDir(src, dest) {
  try {
    const srcDirPath = path.join(__dirname, src);
    const destDirPath = path.join(__dirname, dest);

    await copyDirInternal(srcDirPath, destDirPath);
    console.log(`Directory copied from ${srcDirPath} to ${destDirPath}`);
  } catch (error) {
    console.error(`Error copying directory: ${error.message}`);
  }
}

async function copyDirInternal(srcDir, destDir) {
  await fs.mkdir(destDir, { recursive: true });

  const files = await fs.readdir(srcDir, { withFileTypes: true });

  for (const file of files) {
    const srcPath = path.join(srcDir, file.name);
    const destPath = path.join(destDir, file.name);

    if (file.isDirectory()) {
      await copyDirInternal(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function buildHTMLPage() {
  try {
    const templateContent = await fs.readFile(templateFilePath, 'utf-8');
    const tagNames = templateContent.match(/{{([^{}]+)}}/g);

    let modifiedContent = templateContent;
    if (tagNames) {
      for (const tagName of tagNames) {
        const componentName = tagName.slice(2, -2);
        const componentFilePath = path.join(
          componentsFolderPath,
          `${componentName}.html`,
        );

        const componentContent = await fs.readFile(componentFilePath, 'utf-8');
        modifiedContent = modifiedContent.replace(
          new RegExp(tagName, 'g'),
          componentContent,
        );
      }
    }

    await fs.mkdir(projectDistFolderPath, { recursive: true });
    await fs.writeFile(indexFilePath, modifiedContent);

    await buildCSSBundle(stylesFolderPath, styleFilePath);
    // await copyDir('assets', 'assets-dist');

    console.log('HTML page successfully built in project-dist folder.');
  } catch (error) {
    console.error(`Error building HTML page: ${error.message}`);
  }
}

async function buildCSSBundle(stylesFolderPath) {
  try {
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

// Оборачиваем код в асинхронную функцию
async function main() {
  // Создаем директорию project-dist, если её нет
  await fs.mkdir(projectDistFolderPath, { recursive: true });

  // Копируем компоненты, стили и ассеты
  await Promise.all([copyDir('assets', 'project-dist/assets')]);

  // Строим HTML-страницу
  await buildHTMLPage();
}

// Вызываем асинхронную функцию
main();
