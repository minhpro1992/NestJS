import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class PublicFile {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  url: string;

  @Column()
  key: string;
}

export default PublicFile;
