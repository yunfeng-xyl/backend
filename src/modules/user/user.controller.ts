import { Body, Controller, HttpCode, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { LoginDto, UserDto } from "./dto/user.dto";
import { UserService } from "./user.service";
import { AuthGuard } from "@nestjs/passport";

@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post("register")
  @HttpCode(200)
  @UseGuards(AuthGuard("jwt"))
  async register(@Body() userInfo: UserDto) {
    return await this.userService.register(userInfo);
  }

  @Post("login")
  @HttpCode(200)
  async login(@Body() { username, password }: LoginDto) {
    const authResult = await this.authService.validateUser(username, password);

    if (authResult.code === 200) {
      return await this.authService.login(authResult.data);
    }

    return authResult;
  }
}
