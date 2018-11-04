import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';
import {Team} from '../team/team.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 50, unique: true })
    username: string;

    @Column({ length: 100, nullable: true })
    password: string|undefined;

    @Column({
        type: 'enum',
        enum: [
            'host',
            'player',
        ],
    })
    userType: 'host' | 'player';

    @ManyToOne(type => Team, team => team.users)
    team: Team;
}