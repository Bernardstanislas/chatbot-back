import { IsBoolean, IsHexColor, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { FileUploadDto } from "@core/dto/file-upload.dto";

export class ConfigDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiProperty({type: 'string', format: 'binary'})
  icon: FileUploadDto;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  function: string;

  @IsHexColor()
  @IsNotEmpty()
  @MaxLength(20)
  primaryColor: string;

  @IsHexColor()
  @IsNotEmpty()
  @MaxLength(20)
  secondaryColor: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  problematic: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  audience: string;

  @IsNumber()
  @IsOptional()
  mediaSize: number;

  @IsBoolean()
  @IsOptional()
  trainingRasa: boolean;

  @IsBoolean()
  @IsOptional()
  needTraining: boolean;

  @IsNumber()
  @IsOptional()
  lastTrainingAt: number;

  @ApiProperty({type: 'string', format: 'binary'})
  embeddedIcon: FileUploadDto;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  help: string;

  @IsBoolean()
  @IsOptional()
  storage: boolean;
}
