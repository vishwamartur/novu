import { ChannelTypeEnum } from '@novu/shared';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EnvironmentWithUserCommand } from '../../../shared/commands/project.command';

export class GetAiMessageCommand extends EnvironmentWithUserCommand {
  @IsString()
  prompt: string;

  @IsEnum(ChannelTypeEnum)
  channel: ChannelTypeEnum;

  @IsString()
  workflowName: string;

  @IsString()
  templateName: string;

  @IsString()
  @IsOptional()
  emailSubject: string;
}
