import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    private saltRounds = 10;

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {}

    async getUsers(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async getUserByUsername(username: string): Promise<User> {
        return this.userRepository.findOne({
            where: { username },
        });
    }

    async getUserById(id: string): Promise<User> {
        return (await this.userRepository.find({ id }))[0];
    }

    async getUserByEmail(username: string): Promise<User> {
        return await this.userRepository.findOne({ username });
    }

    async createUser(userName: string): Promise<User> {
        const newUser = new User();
        newUser.username = userName;
        newUser.userType = 'player';
        return this.userRepository.save(newUser);
    }

    async getHash(password: string|undefined): Promise<string> {
        return bcrypt.hash(password, this.saltRounds);
    }

    async compareHash(password: string|undefined, hash: string|undefined): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}