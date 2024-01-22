const fs = require('fs').promises;
const path = require('path');
const fse = require('fs-extra');

const destinationFolderPath = path.join(__dirname, 'project-dist');
const sourceFolderPath = path.join(__dirname, 'assets');
console.log(sourceFolderPath);
const templatePath = path.join(__dirname, 'template.html');

const stylesFolderPath = path.join(__dirname, 'styles');
const outputFolderPath = path.join(__dirname, 'project-dist');
const outputFilePath = path.join(outputFolderPath, 'styles.css');

// Step 1: Create a folder
async function createDestinationFolder() {
  try {
    // Try to access the destination folder
    await fs.access(destinationFolderPath, fs.constants.F_OK);

    // If successful, the folder already exists
    console.log(`Folder '${destinationFolderPath}' already exists.`);
  } catch (err) {
    // If an error occurs, the folder does not exist
    try {
      // Create the destination folder
      await fs.mkdir(destinationFolderPath);
      console.log(`Folder '${destinationFolderPath}' successfully created.`);
    } catch (mkdirErr) {
      console.error(
        `Error creating folder '${destinationFolderPath}':`,
        mkdirErr,
      );
      throw mkdirErr; // Propagate the error upward
    }
  }
}

// Step 2: Read and save the template file
async function readTemplateFile() {
  try {
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    return templateContent;
  } catch (error) {
    console.error(`Error reading file '${templatePath}':`, error);
    throw error; // Propagate the error upward
  }
}

// Step 3: Find all tag names in the template file
function findAllTag(templateContentHtml) {
  const tagRegex = /{{(.*?)}}/g;
  const tags = templateContentHtml.match(tagRegex);
  return tags;
}

// Step 4: Replace tags with content from component files
async function replaceTags(templateContentHtml, tags) {
  if (tags) {
    for (const tag of tags) {
      const tagName = tag.replace(/[{}]/g, '');
      const componentPath = path.join(
        __dirname,
        'components',
        `${tagName}.html`,
      );

      try {
        await fs.access(componentPath, fs.constants.F_OK);
        const componentContent = await fs.readFile(componentPath, 'utf-8');
        templateContentHtml = templateContentHtml.replace(
          tag,
          componentContent,
        );
      } catch (error) {
        console.error(
          `Error accessing or reading file '${componentPath}':`,
          error,
        );
      }
    }
    return templateContentHtml;
  }
}

async function writeHtmlFile(templateContentHtml) {
  const indexPath = path.join(destinationFolderPath, 'index.html');
  await fs.writeFile(indexPath, templateContentHtml, 'utf-8');
}

async function mergeStyles() {
  try {
    // Ensure the output folder exists
    await fs.access(outputFolderPath, fs.constants.F_OK);

    // Read all files in the styles folder
    const files = await fs.readdir(stylesFolderPath);

    // Filter out non-CSS files
    const cssFiles = files.filter(
      (file) => path.extname(file).toLowerCase() === '.css',
    );

    // Concatenate styles from all CSS files
    const bundleContent = await Promise.all(
      cssFiles.map(async (file) => {
        const filePath = path.join(stylesFolderPath, file);
        return await fs.readFile(filePath, 'utf8');
      }),
    );

    // Write the concatenated content to the bundle.css file
    await fs.writeFile(outputFilePath, bundleContent.join('\n'), 'utf8');

    console.log('Styles created successfully.');
  } catch (err) {
    console.error('Error merging styles:', err);
  }
}

async function copyFiles(sourceDir, destinationDir) {
  try {
    // await createDestinationFolder(); // Create the destination folder

    // Use fs-extra to copy entire directories
    await fse.copy(sourceDir, destinationDir, {
      overwrite: true,
      errorOnExist: false,
    });

    console.log(`All files copied from '${sourceDir}' to '${destinationDir}'`);
  } catch (err) {
    console.error(
      `Error copying files from '${sourceDir}' to '${destinationDir}':`,
      err,
    );
  }
}

// Execute the steps sequentially
async function main() {
  await createDestinationFolder();
  const templateContentHtml = await readTemplateFile();
  const tags = findAllTag(templateContentHtml);
  const modifiedTemplate = await replaceTags(templateContentHtml, tags);
  await writeHtmlFile(modifiedTemplate);
  await mergeStyles();
  await copyFiles(sourceFolderPath, destinationFolderPath);
}

// Run the main function
main();
