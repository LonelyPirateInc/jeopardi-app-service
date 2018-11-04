import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, PrimaryColumn} from 'typeorm';

@Entity()
export class AuthToken {
  @PrimaryColumn()
  id: number;

  @Column({ unique: true })
  token: string;
}