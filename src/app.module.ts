import { Module, Logger } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer/';
import { KnexModule } from 'nest-knexjs';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['local.env', '.env'],
      isGlobal: true,
      load: [config],
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        pinoHttp: {
          level: 'debug',
          transport:
            configService.get('secret.env') === 'production'
              ? undefined
              : {
                  target: 'pino-pretty',
                  options: {
                    singleLine: true,
                    sync: true,
                  },
                },
        },
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('secret.jwtSecret'),
        signOptions: { expiresIn: 90 * 24 * 60 * 60 },
      }),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('mail.smtpHost'),
          port: configService.get<number>('mail.smtpPort'),
          secure: configService.get<boolean>('mail.enableTLS'),
          auth: {
            user: configService.get<string>('mail.user'),
            pass: configService.get<string>('mail.password'),
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
      }),
    }),
    KnexModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          client: 'mysql',
          useNullAsDefault: true,
          pool: {
            min: 0,
            max: configService.get('db.maxConnection'),
          },
          connection: {
            host: configService.get('db.host'),
            user: configService.get('db.username'),
            port: configService.get('db.port'),
            password: configService.get('db.password'),
            database: configService.get('db.database'),
            bigNumberStrings: true,
            supportBigNumbers: true,
          },
          log: new Logger('Knex'),
        },
      }),
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
