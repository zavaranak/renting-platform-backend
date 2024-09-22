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
      const arr = line.split('","').map((s) => s.replace(/"/g, ''));
      const language = {
        alpha3b: arr[0],
        alpha3t: arr[1],
        alpha2: arr[2],
        name: arr[3],
      };
      console.log(language);
    }
  }
}
