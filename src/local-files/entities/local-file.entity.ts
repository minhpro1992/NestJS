import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class LocalFile {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  filename: string;

  @Column()
  path: string;

  @Column()
  minetype: string;
}
