import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { RegisterDTO } from './dto/create-user.dto';
import { User } from './entities/user.entity';

// This should be a real class/interface representing a user entity
// export type User = any;

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {}

  create(createUserDto: RegisterDTO): Promise<User> {
    const autoFundAccount = process.env.NODE_ENV === 'development' || 'staging';
    const user = new User();
    user.firstname = createUserDto.firstname;
    user.lastname = createUserDto.lastname;
    user.mobile = createUserDto.mobile;
    user.business_name = createUserDto.business_name;
    user.country = createUserDto.country;
    user.balance = autoFundAccount ? 5000 : 0;
    user.isActive = false;
    user.currency = createUserDto.currency;
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    return this.usersRepository.save(user);
  }

  async charge(id: string, estimatedFees: number) {
    const user = await this.findOne({ id });
    return this.usersRepository.update(
      { id },
      {
        balance: user.balance - estimatedFees,
      },
    );
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(filter: any): Promise<User> {
    const query = {
      where: filter,
    } as FindOneOptions<User>;
    return this.usersRepository.findOne(query);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
