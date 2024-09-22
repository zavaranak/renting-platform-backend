import * as fs from 'fs';
import * as readline from 'readline';

const doit = async () => {
  const filepath = 'src/common/language-codes-full.csv';
  const fileStream = fs.createReadStream(filepath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  let isHeader = true;
  for await (const line of rl) {
    if (isHeader) {
      isHeader = false;
      continue;
    }
    console.log(line);
  }
};
doit();
