import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs';
import * as readline from 'readline';
export class LoadLanguageIntoDatabase1727003138013
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
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
      const arr = line.split('","').map((s) => s.replace(/"/g, ''));
      const language = {
        alpha3b: arr[0],
        alpha3t: arr[1],
        alpha2: arr[2],
        name: arr[3],
      };

      const result = await queryRunner.query(
        `INSERT INTO "language-codes" (name,alpha3b) VALUES ($1,$2) RETURNING id`,
        [language.name, language.alpha3b],
      );
      const languageId = result[0].id;

      const addAlpha2 = async () => {
        if (language.alpha2 !== '') {
          queryRunner.query(
            'INSERT INTO "language-attributes" (name,value,"language-code_id") VALUES ($1,$2,$3)',
            ['alpha2', language.alpha2, languageId],
          );
        }
      };
      const addAlpha3t = async () => {
        if (language.alpha3t !== '') {
          queryRunner.query(
            'INSERT INTO "language-attributes" (name,value,"language-code_id") VALUES ($1,$2,$3)',
            ['alpha3t', language.alpha3t, languageId],
          );
        }
      };

      await Promise.all([addAlpha2(), addAlpha3t()]);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('TRUNCATE TABLE "language-codes"');
    await queryRunner.query('TRUNCATE TABLE "language-attributes"');
  }
}
