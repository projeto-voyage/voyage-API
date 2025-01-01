import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { AppConfigService } from 'src/app-config/app-config.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private readonly appConfigService: AppConfigService, 
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    await this.validateEmail(createUserDto.email);
    const hashedPassword = await this.hashPassword(createUserDto.password);

    const user = this.repository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const newUser = await this.repository.save(user);
    delete newUser.password;

    return newUser;
  }

  async findAll(): Promise<User[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<User | null> {
    return this.repository.findOneBy({ id });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    if (updateUserDto.email && updateUserDto.email.trim() === '') {
      throw new BadRequestException('Email cannot be empty');
    }

    const user = await this.repository.findOneBy({ id });
    if (!user) {
      return null;
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    this.repository.merge(user, updateUserDto);
    return this.repository.save(user);
  }

  async remove(id: string): Promise<User | null> {
    const user = await this.repository.findOneBy({ id });
    if (!user) {
      return null;
    }
    return this.repository.remove(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  private async validateEmail(email: string): Promise<void> {
    const existingUser = await this.repository.findOne({ where: { email } });

    if (existingUser) {
      throw new BadRequestException('Email is already in use.');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = await this.getSaltRounds(); 
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
  }

  private async getSaltRounds(): Promise<number> {
    return this.appConfigService.getSaltRounds; 
  }
  
  
}
