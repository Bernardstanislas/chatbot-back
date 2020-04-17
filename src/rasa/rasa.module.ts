import { Module } from '@nestjs/common';
import { RasaController } from './rasa.controller';
import { RasaService } from './rasa.service';
import { IntentModule } from "../intent/intent.module";
import { FileModule } from "../file/file.module";

@Module({
  controllers: [RasaController],
  providers: [RasaService],
  imports: [
    IntentModule,
    FileModule
  ]
})
export class RasaModule {}
