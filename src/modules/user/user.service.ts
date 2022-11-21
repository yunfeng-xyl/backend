import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/entities/user.entity";
import { encryptPassword, makeSalt } from "src/utils/cryptogram";
import { Repository } from "typeorm";
import { LoginDto, UserDto } from "./dto/user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  findOneByUsername(username: string): Promise<UserEntity> {
    return this.usersRepository.findOne({ where: { username } });
  }

  insert(
    username: string,
    password: string,
    salt: string,
    phone?: string,
    email?: string,
  ): Promise<UserEntity> {
    const user = new UserEntity();

    user.username = username;
    user.password = password;
    user.salt = salt;
    user.phone = phone;
    user.email = email;

    return this.usersRepository.save(user);
  }

  async register({ username, password, phone, email }: UserDto): Promise<any> {
    try {
      const user = await this.findOneByUsername(username);
      if (user) {
        return { code: 400, message: "该用户已存在" };
      }

      const salt = makeSalt();
      const encryptedPassword = encryptPassword(password, salt);

      await this.insert(username, encryptedPassword, salt, phone, email);

      return {
        code: 200,
        message: "Success",
      };
    } catch (err) {
      return { code: 400, message: "注册失败", err };
    }
  }

  async login({ username, password }: LoginDto): Promise<any> {
    try {
      const user = await this.findOneByUsername(username);

      const encryptedPassword = encryptPassword(password, user.salt);

      if (!user || encryptedPassword !== user.password) {
        return {
          code: 400,
          message: "账号或密码错误",
        };
      }

      return {
        code: 200,
        message: "Success",
        data: user,
      };
    } catch (err) {
      return { code: 400, message: "Error", err };
    }
  }
}
