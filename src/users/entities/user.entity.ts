import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { PinoLogger } from 'nestjs-pino';
import { InjectConnection } from 'nest-knexjs';

@Injectable()
export class UserEntity {
  constructor(
    @InjectConnection() private readonly knex: Knex,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(UserEntity.name);
  }
}