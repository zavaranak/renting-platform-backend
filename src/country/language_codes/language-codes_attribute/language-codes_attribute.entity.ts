import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
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
  @JoinColumn({ name: 'language-code_id' })
  languageCode: LanguageCode;
}
