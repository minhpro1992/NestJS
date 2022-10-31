import { PartialType } from '@nestjs/mapped-types';
import { CreateLocalFileDto } from './create-local-file.dto';

export class UpdateLocalFileDto extends PartialType(CreateLocalFileDto) {}
