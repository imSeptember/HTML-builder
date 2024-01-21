const fs = require('fs');
const readline = require('readline');

let filePath = 'output.txt';

// Create a readline interface for reading user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function writeFile(filePath, userInput) {
  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Append the new text to the existing file
    fs.appendFile(filePath, userInput, 'utf8', (err) => {
      if (err) {
        console.error('Error appending to the file:', err);
      } else {
        console.log(`Text successfully appended to ${filePath}`);
      }
      // Ask the next question
      askQuestion();
    });
  } else {
    // Create the file if it doesn't exist
    fs.writeFile(filePath, userInput, 'utf8', (err) => {
      if (err) {
        console.error('Error creating the file:', err);
      } else {
        console.log('File created successfully.');
        // Ask the next question
        askQuestion();
      }
    });
  }
}

function askQuestion() {
  // Prompt the user for text input
  rl.question('Enter text to write to the file: ', (userInput) => {
    // Write or append the user input to the text file
    if (userInput === 'exit') {
      rl.close(); // Close the readline interface
    } else {
      writeFile(filePath, userInput);
    }
  });
}

// Call askQuestion after the file is created or checked
process.nextTick(() => askQuestion());

// Handle the close event of the readline interface
rl.on('close', () => {
  console.log('Prompt closed. Exiting...');
  process.exit(0); // Terminate the process when the readline interface is closed
});
