import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { validate } from 'class-validator';
import { LoggerService } from 'src/logger/logger.service';
import { UsersService } from 'src/users/users.service';
import { pbkdf2Sync } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { LoginDTO, RegisterDTO } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  private readonly salt: string;
  public balance: number;

  constructor(
    private readonly logger: LoggerService = new Logger(AuthService.name),
    private jwtService: JwtService,
    private userService: UsersService,
    private readonly configService: ConfigService,
  ) {
    this.salt = this.configService.get<string>('JWT_SALT');
  }

  public async login(user: any): Promise<Record<string, any>> {
    // Validation Flag
    let isOk = false;

    // Transform body into DTO
    const userDTO = new LoginDTO();
    userDTO.email = user.email;
    userDTO.password = user.password;

    // TODO: Refactor this section with try catch block and return error message in the catch block
    // Validate DTO against validate function from class-validator
    await validate(userDTO).then((errors) => {
      if (errors.length > 0) {
        this.logger.debug('login', `${errors}`);
      } else {
        isOk = true;
      }
    });

    if (isOk) {
      // Get user information
      const userDetails = await this.userService.findOne({ email: user.email });
      this.balance = userDetails.balance;
      // Check if user exists
      if (userDetails == null) {
        return { status: 404, msg: { msg: 'Account not found' } };
      }

      const hash = pbkdf2Sync(user.password, this.salt, 1000, 64, 'sha512').toString('hex');
      // Check if the given password match with saved password
      const isValid = hash === userDetails.password;
      if (isValid) {
        // Generate JWT token
        return {
          status: 200,
          msg: {
            access_token: this.jwtService.sign({ email: user.email }),
            data: {
              balance: userDetails.balance,
              business_name: userDetails.business_name,
            },
          },
        };
      } else {
        // Password or email does not match
        return { status: 401, msg: { msg: 'Invalid credentials' } };
      }
    } else {
      return { status: 400, msg: { msg: 'Invalid fields.' } };
    }
  }

  public async register(body: any): Promise<Record<string, any>> {
    // Validation Flag
    let isOk = false;
    let hash = '';

    // Transform body into DTO
    const userDTO = new RegisterDTO();
    userDTO.email = body.email;
    userDTO.firstname = body.firstname;
    userDTO.lastname = body.lastname;
    userDTO.business_name = body.business_name;
    userDTO.currency = body.currency;
    userDTO.country = body.country;
    userDTO.mobile = body.mobile;

    // Creating a unique salt for a particular user

    // Hashing user's salt and password with 1000 iterations,
    //  64 length and sha512 digest
    hash = pbkdf2Sync(body.password, this.salt, 1000, 64, 'sha512').toString('hex');
    userDTO.password = hash;

    // Validate DTO against validate function from class-validator
    await validate(userDTO).then((errors) => {
      if (errors.length > 0) {
        this.logger.debug(`${errors}`);
      } else {
        isOk = true;
      }
    });
    if (isOk) {
      const createdUser = await this.userService.create(userDTO).catch((error) => {
        this.logger.debug(error.message);
        isOk = false;
      });
      if (isOk) {
        return { status: 201, content: { ...createdUser, password: undefined } };
      } else {
        return { status: 400, content: { msg: 'User already exists' } };
      }
    } else {
      return { status: 400, content: { msg: 'Invalid content' } };
    }
  }
}
