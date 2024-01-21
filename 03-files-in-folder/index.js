const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error('Error reading folder:', err);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    fs.stat(filePath, (statErr, stats) => {
      if (statErr) {
        console.error(`Error getting file stats for ${file}:`, statErr);
        return;
      }

      const fileSizeInBytes = stats.size;
      const fileSizeInKB = fileSizeInBytes / 1024;

      // Extract file information
      const fileName = path.parse(file).name;
      const fileExtension = path.extname(file).slice(1); // Remove the leading dot

      // Display information in the required format
      console.log(
        `${fileName} - ${fileExtension} - ${fileSizeInKB.toFixed(3)}kb`,
      );
    });
  });
});
