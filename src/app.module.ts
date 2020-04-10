import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { IntentModule } from './intent/intent.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { User } from "@core/entities/user.entity";
import { Intent } from "@core/entities/intent.entity";
import { KnowledgeModule } from './knowledge/knowledge.module';
import { Knowledge } from "@core/entities/knowledge.entity";
import { ResponseModule } from './response/response.module';
import { Response } from "@core/entities/response.entity";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { LoggerInterceptor } from "@core/interceptors/logger.interceptor";
import { FileModule } from './file/file.module';
import { MediaModule } from './media/media.module';
import { Media } from "@core/entities/media.entity";
import { Events } from "@core/entities/events.entity";
import { InboxModule } from './inbox/inbox.module';
import { ScheduleModule } from "@nestjs/schedule";
import { Inbox } from "@core/entities/inbox.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABSE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [
        User,
        Intent,
        Knowledge,
        Response,
        Media,
        Events,
        Inbox
      ],
      synchronize: true
    }),
    AuthModule,
    UserModule,
    IntentModule,
    KnowledgeModule,
    ResponseModule,
    FileModule,
    MediaModule,
    InboxModule,
    ScheduleModule.forRoot()
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    }
  ],
})
export class AppModule {
}
