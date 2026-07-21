import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CrearEquipoDto } from './dto/crear-equipo.dto';
import { ActualizarEquipoDto } from './dto/actualizar-equipo.dto';

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
  @ApiOperation({ summary: 'Obtener todos los equipos' })
  async findAll() {
    return await this.productsService.findAll();
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Obtener equipos con stock bajo' })
  async findLowStock() {
    return await this.productsService.checkLowStock();
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

