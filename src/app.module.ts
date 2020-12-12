import { Module, HttpModule } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    HttpModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'overlays'),
    }),
  ],
  controllers: [],
  providers: [AppGateway, AppService],
})
export class AppModule {}
