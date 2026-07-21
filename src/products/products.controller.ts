import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CrearEquipoDto } from './dto/crear-equipo.dto';
import { ActualizarEquipoDto } from './dto/actualizar-equipo.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Inventario de Equipos')
@Controller('inventario')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo equipo/producto' })
  async create(@Body() crearEquipoDto: CrearEquipoDto) {
    return await this.productsService.create(crearEquipoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los equipos (paginado)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  async findAll(@Query() paginationDto: PaginationDto) {
    return await this.productsService.findAll(paginationDto);
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Obtener equipos con stock bajo' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  async findLowStock(@Query() paginationDto: PaginationDto) {
    return await this.productsService.checkLowStock(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un equipo por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un equipo' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() actualizarEquipoDto: ActualizarEquipoDto,
  ) {
    return await this.productsService.update(id, actualizarEquipoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un equipo' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.remove(id);
  }
}

