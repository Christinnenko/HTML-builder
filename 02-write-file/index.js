const fs = require('fs');
const readline = require('readline');

const filePath = './02-write-file/output.txt';

const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Hello! Enter text (type "exit" to output):');

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    console.log('\nGooooodBye! Exiting the program...');
    rl.close();
    process.exit();
  } else {
    writeStream.write(`${input}\n`);
  }
});

rl.on('SIGINT', () => {
  console.log('\nGooooodBye! Exiting the program...');
  rl.close();
  process.exit();
});
