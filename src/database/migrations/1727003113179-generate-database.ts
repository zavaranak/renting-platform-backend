import { MigrationInterface, QueryRunner } from 'typeorm';

export class GenerateDatabase1727003113179 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(`
            CREATE TABLE "language-codes" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "name" varchar(255) NOT NULL,
                "alpha3b" varchar(255) NOT NULL
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "language-attributes" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "name" varchar(255) NOT NULL,
                "value" varchar(255) NOT NULL,
                "language-code_id" uuid NOT NULL
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "countries" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "name" varchar(255) NOT NULL,
                "language" varchar(50) NOT NULL,
                "alpha3b" char(3) NOT NULL
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "currencies" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "symbol" varchar(10) NOT NULL,
                "bank_id" uuid NOT NULL
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "banks" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "name" varchar(255) NOT NULL,
                "country_id" uuid NOT NULL
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "bank_attributes" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "name" varchar(255) NOT NULL,
                "value" text NOT NULL,
                "bank_id" uuid NOT NULL
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "currency_attributes" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "name" varchar(255) NOT NULL,
                "value" text NOT NULL,
                "currency_id" uuid NOT NULL
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "country_attributes" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "name" varchar(255) NOT NULL,
                "value" text NOT NULL,
                "country_id" uuid NOT NULL
            )
        `);

    await queryRunner.query(`
            ALTER TABLE "language-attributes" ADD CONSTRAINT "FK_language-attributes_language-code_id" FOREIGN KEY ("language-code_id") REFERENCES "language-codes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "banks" ADD CONSTRAINT "FK_banks_country_id" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

    await queryRunner.query(`
            ALTER TABLE "currencies" ADD CONSTRAINT "FK_currencies_bank_id" FOREIGN KEY ("bank_id") REFERENCES "banks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

    await queryRunner.query(`
            ALTER TABLE "bank_attributes" ADD CONSTRAINT "FK_bank_attributes_bank_id" FOREIGN KEY ("bank_id") REFERENCES "banks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

    await queryRunner.query(`
            ALTER TABLE "currency_attributes" ADD CONSTRAINT "FK_currency_attributes_currency_id" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

    await queryRunner.query(`
            ALTER TABLE "country_attributes" ADD CONSTRAINT "FK_country_attributes_country_id" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp"`);
    await queryRunner.query(
      `ALTER TABLE "country_attributes" DROP CONSTRAINT "FK_country_attributes_country_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "currency_attributes" DROP CONSTRAINT "FK_currency_attributes_currency_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bank_attributes" DROP CONSTRAINT "FK_bank_attributes_bank_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "currencies" DROP CONSTRAINT "FK_currencies_bank_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "banks" DROP CONSTRAINT "FK_banks_country_id"`,
    );
    await queryRunner.query(`DROP TABLE "country_attributes"`);
    await queryRunner.query(`DROP TABLE "currency_attributes"`);
    await queryRunner.query(`DROP TABLE "bank_attributes"`);
    await queryRunner.query(`DROP TABLE "banks"`);
    await queryRunner.query(`DROP TABLE "currencies"`);
    await queryRunner.query(`DROP TABLE "countries"`);
  }
}
