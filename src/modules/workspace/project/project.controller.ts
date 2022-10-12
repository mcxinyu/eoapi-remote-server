import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { QueryDto } from './dto/query.dto';
import { ImportDto } from './dto/import.dto';
import { WORKSPACE_ID_PREFIX } from '@/common/contants/prefix.contants';

@ApiTags('Project')
@Controller(`${WORKSPACE_ID_PREFIX}/project`)
export class ProjectController {
  constructor(private readonly service: ProjectService) {}

  @Post()
  async create(
    @Param('workspaceID', ParseIntPipe) workspaceID,
    @Body() createDto: CreateDto,
  ) {
    const data = await this.service.create(createDto);
    return this.findOne(workspaceID, `${data.uuid}`);
  }

  @Post('batch')
  async batchCreate(@Body() createDto: Array<CreateDto>) {
    return this.service.batchCreate(createDto);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
    @Param('workspaceID', ParseIntPipe) workspaceID,
  ) {
    return this.service.findAll(query, workspaceID);
  }

  @Get(':uuid')
  async findOne(
    @Param('uuid', ParseIntPipe) uuid,
    @Param('workspaceID', ParseIntPipe) workspaceID,
  ) {
    return this.service.findOne(workspaceID, uuid);
  }

  @Put(':uuid')
  async update(
    @Param('uuid') uuid: string,
    @Param('workspaceID', ParseIntPipe) workspaceID,
    @Body() updateDto: UpdateDto,
  ) {
    const data = await this.service.update(+uuid, updateDto);
    if (data) {
      return await this.findOne(workspaceID, uuid);
    }

    return new NotFoundException('更新失败！项目不存在');
  }

  @Delete(':uuid')
  async remove(@Param('uuid') uuid: string) {
    const data = await this.service.remove(+uuid);
    if (data && data.affected > 0) {
      return data;
    }

    return new NotFoundException('删除失败！项目不存在');
  }

  @Put(':uuid/import')
  async import(
    @Param('uuid') uuid: string,
    @Param('workspaceID', ParseIntPipe) workspaceID,
    @Body() importDto: ImportDto,
  ) {
    // console.log('uuid', uuid, importDto);
    const data = await this.service.import(
      workspaceID,
      Number(uuid),
      importDto,
    );
    return {
      errors: data,
    };
  }

  @Get(':uuid/export')
  async export(
    @Param('uuid') uuid: string,
    @Param('workspaceID', ParseIntPipe) workspaceID,
  ) {
    // console.log('uuid', uuid, importDto);
    return this.service.export(workspaceID, Number(uuid));
  }
}