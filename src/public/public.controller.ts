import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ChatbotConfigService } from "../chatbot-config/chatbot-config.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ChatbotConfig } from "@core/entities/chatbot-config.entity";
import { plainToClass } from "class-transformer";
import camelcaseKeys = require("camelcase-keys");
import { PublicConfigDto } from "@core/dto/public-config.dto";
import { IntentDto } from "@core/dto/intent.dto";
import { IntentService } from "../intent/intent.service";
import { Intent } from "@core/entities/intent.entity";
import { FeedbackDto } from "@core/dto/feedback.dto";
import { FeedbackService } from "../feedback/feedback.service";
import snakecaseKeys = require("snakecase-keys/index");
import { Feedback } from "@core/entities/feedback.entity";

@ApiTags('public')
@Controller('public')
export class PublicController {
  constructor(private readonly _configService: ChatbotConfigService,
              private readonly _intentService: IntentService,
              private readonly _feedbackService: FeedbackService) {
  }

  @Get('')
  @ApiOperation({summary: 'Return the chatbot chatbot-config'})
  async getChabotConfig(): Promise<PublicConfigDto> {
    const config: ChatbotConfig = await this._configService.getChatbotConfig(
      {select: ['name', 'icon', 'function', 'primary_color', 'secondary_color', 'problematic', 'audience',
        'embedded_icon', 'description', 'help']}
      );
    return config ? plainToClass(PublicConfigDto, camelcaseKeys(config, {deep: true})) : null;
  }

  @Get('/intents')
  @ApiOperation({summary: 'Return the 10 firsts matching intents'})
  async getIntents(@Query('query') query: string): Promise<IntentDto[]> {
    const intents: Intent[] = await this._intentService.findIntentsMatching(decodeURIComponent(query), 10);
    return plainToClass(IntentDto, camelcaseKeys(intents, {deep: true}));
  }

  @Post('/feedback')
  @ApiOperation({summary: 'Set a feedback from a chatbot response'})
  async createFeedback(@Body() feedbackDto: FeedbackDto): Promise<FeedbackDto> {
    const feedback = await this._feedbackService.createSafe(plainToClass(Feedback, snakecaseKeys(feedbackDto)));
    return plainToClass(FeedbackDto, camelcaseKeys(feedback, {deep: true}));
  }
}
