import { NestFactory, Reflector } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";
import { ValidationPipe } from "./pipes/validate.pipe";
import { ClassSerializerInterceptor } from "@nestjs/common";
import { logger } from "./middleware/logger/logger.middleware";

// 全局路由前缀
const routingPrefix = "";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get("port");
  app.setGlobalPrefix(routingPrefix);
  app.use(logger);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(port);
}
bootstrap();
