import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { LanguageCode } from '../language-code.entity';

@Entity('language-attributes')
export class LanguageAttribute {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  value: string;

  @ManyToOne(() => LanguageCode, (languageCode) => languageCode.attributes)
  languageCode: LanguageCode;
}
