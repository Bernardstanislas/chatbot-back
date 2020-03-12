import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { IntentService } from "./intent.service";
import { IntentDto } from "@core/dto/intent.dto";

@ApiTags('intent')
@Controller('intent')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class IntentController {
  constructor(private readonly _intentService: IntentService) {}

  @Get('')
  @ApiOperation({ summary: 'Return all intents' })
  async getIntents(): Promise<IntentDto[]> {
    return this._intentService.findAll();
  }

  @Post('')
  @ApiOperation({ summary: 'Create an intent' })
  async createIntent(@Body() intent: IntentDto): Promise<IntentDto> {
    return this._intentService.create(intent);
  }
}
