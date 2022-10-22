import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Duck } from './duck.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'sqlite',
    database: './ducks.db',
    entities: [Duck]
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
