import * as fs from 'fs';
import * as readline from 'readline';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LanguageCodeService {
  async showLanguage(filepath: string) {
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
  }
}
