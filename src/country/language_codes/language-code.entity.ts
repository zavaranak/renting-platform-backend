import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { LanguageAttribute } from './language-codes_attribute/language-codes_attribute.model';

@Entity('language-codes')
export class LanguageCode {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  alpha3b: string;

  @OneToMany(
    () => LanguageAttribute,
    (languageAttribute) => languageAttribute.languageCode,
  )
  attributes: LanguageAttribute[];
}
