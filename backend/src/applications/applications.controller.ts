import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UsePipes,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service.js';
import { createApplicationSchema } from './dto/create-application.dto.js';
import type { CreateApplicationDto } from './dto/create-application.dto.js';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe.js';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createApplicationSchema))
  async create(@Body() createApplicationDto: CreateApplicationDto) {
    const data = await this.applicationsService.create(createApplicationDto);
    return { data };
  }

  @Get()
  async findAll() {
    const data = await this.applicationsService.findAll();
    return { data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.applicationsService.findOne(id);
    return { data };
  }

  @Patch(':id/approve')
  async approve(@Param('id') id: string) {
    const data = await this.applicationsService.approve(id);
    return { data };
  }

  @Patch(':id/reject')
  async reject(@Param('id') id: string) {
    const data = await this.applicationsService.reject(id);
    return { data };
  }
}
