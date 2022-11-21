import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { encryptPassword } from "src/utils/cryptogram";
import { UserService } from "../user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);

    if (user) {
      const encryptedPassword = encryptPassword(password, user.salt);
      if (encryptedPassword !== user.password) {
        return {
          code: 400,
          message: "账号或密码错误",
        };
      }

      return { code: 200, data: user };
    }

    return {
      code: 400,
      message: "账号或密码错误",
    };
  }

  async login(user: any) {
    const payload = { username: user.username, roleId: user.roleId };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userInfo } = user;

    return {
      ...userInfo,
      token: this.jwtService.sign(payload),
    };
  }
}
