import PrivateFile from 'src/files/entities/privateFile.entity';
import { LocalFile } from 'src/local-files/entities/local-file.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column()
  name: string;

  @JoinColumn()
  @OneToOne(() => PrivateFile, {
    eager: true,
    nullable: true,
  })
  avatar?: PrivateFile;

  @OneToMany(() => PrivateFile, (privateFile: PrivateFile) => privateFile.owner)
  files: PrivateFile[];

  // @JoinColumn({ name: 'localFileId' })
  // @OneToOne(() => LocalFile, {
  //   nullable: true,
  // })
  // localFile?: LocalFile;

  @Column({ nullable: true })
  localFileId?: number;
}
export default User;
