import { IsString, IsDefined, IsEnum, IsOptional } from 'class-validator';
import { AuthenticatedCommand } from 'libs/application-generic/build/main';
import { JobTitleEnum, ProductUseCases } from '@novu/shared';

export class SyncExternalOrganizationCommand extends AuthenticatedCommand {
  @IsDefined()
  @IsString()
  externalOrganizationId: string;

  @IsOptional()
  @IsEnum(JobTitleEnum)
  jobTitle?: JobTitleEnum;

  @IsString()
  @IsOptional()
  domain?: string;

  @IsOptional()
  productUseCases?: ProductUseCases;
}
