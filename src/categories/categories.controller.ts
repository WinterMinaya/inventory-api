import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Categorías')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva categoría' })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las categorías (paginado)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  async findAll(@Query() paginationDto: PaginationDto) {
    return await this.categoriesService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una categoría por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.categoriesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una categoría' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una categoría' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.categoriesService.remove(id);
  }
}

