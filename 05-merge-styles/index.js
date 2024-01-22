const fs = require('fs');
const path = require('path');

const stylesFolderPath = path.join(__dirname, 'styles');
const outputFolderPath = path.join(__dirname, 'project-dist');
const outputFilePath = path.join(outputFolderPath, 'bundle.css');

// Ensure the output folder exists
if (!fs.existsSync(outputFolderPath)) {
  fs.mkdirSync(outputFolderPath);
}

// Read all files in the styles folder
fs.readdir(stylesFolderPath, (err, files) => {
  if (err) {
    throw err;
  }

  // Filter out non-CSS files
  const cssFiles = files.filter(
    (file) => path.extname(file).toLowerCase() === '.css',
  );

  // Concatenate styles from all CSS files
  const bundleContent = cssFiles
    .map((file) => {
      const filePath = path.join(stylesFolderPath, file);
      return fs.readFileSync(filePath, 'utf8');
    })
    .join('\n');

  // Write the concatenated content to the bundle.css file
  fs.writeFileSync(outputFilePath, bundleContent, 'utf8');

  console.log('Bundle created successfully.');
});
