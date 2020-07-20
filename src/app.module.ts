import { Module, HttpModule } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { AppService } from './app.service';

@Module({
  imports: [
    HttpModule
  ],
  controllers: [],
  providers: [
    AppGateway,
    AppService
  ],
})
export class AppModule {}
