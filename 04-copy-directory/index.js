const fs = require('fs').promises;
const path = require('path');

const sourceFolderPath = path.join(__dirname, 'files');
const destinationFolderPath = path.join(__dirname, 'files-copy');

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

async function copyFiles(sourceDir, destinationDir) {
  try {
    await createDestinationFolder(); // Create the destination folder

    const sourceFiles = await fs.readdir(sourceDir);
    const destinationFiles = await fs.readdir(destinationDir);

    // Remove files from destination that are not in source
    const filesToRemove = destinationFiles.filter(
      (file) => !sourceFiles.includes(file),
    );
    for (const fileToRemove of filesToRemove) {
      const filePathToRemove = path.join(destinationDir, fileToRemove);
      await fs.unlink(filePathToRemove);
      console.log(`Removed file '${filePathToRemove}' from destination.`);
    }

    // Copy files from source to destination
    for (const file of sourceFiles) {
      const sourceFilePath = path.join(sourceDir, file);
      const destinationFilePath = path.join(destinationDir, file);

      await fs.copyFile(sourceFilePath, destinationFilePath);
      console.log(`Copied file '${file}' to '${destinationDir}'.`);
    }

    console.log(`All files copied from '${sourceDir}' to '${destinationDir}'`);
  } catch (err) {
    console.error(
      `Error copying files from '${sourceDir}' to '${destinationDir}':`,
      err,
    );
  }
}

copyFiles(sourceFolderPath, destinationFolderPath);
