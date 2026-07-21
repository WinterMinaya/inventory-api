import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MantenimientoService } from './mantenimiento.service';
import { CrearMantenimientoDto } from './dto/crear-mantenimiento.dto';
import { ActualizarMantenimientoDto } from './dto/actualizar-mantenimiento.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Mantenimiento de Equipos')
@Controller('mantenimiento')
export class MantenimientoController {
  constructor(private readonly mantenimientoService: MantenimientoService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un nuevo registro de mantenimiento' })
  async create(
    @Body() crearMantenimientoDto: CrearMantenimientoDto,
    @CurrentUser('id') userId: number,
  ) {
    return await this.mantenimientoService.create(
      crearMantenimientoDto,
      userId,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los mantenimientos (paginado)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  async findAll(@Query() paginationDto: PaginationDto) {
    return await this.mantenimientoService.findAll(paginationDto);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Obtener mantenimientos por estado (paginado)' })
  @ApiQuery({ name: 'status', enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  async findByStatus(
    @Param('status') status: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return await this.mantenimientoService.findByStatus(status, paginationDto);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Obtener mantenimientos por producto (paginado)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  async findByProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Query() paginationDto: PaginationDto,
  ) {
    return await this.mantenimientoService.findByProduct(productId, paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un mantenimiento por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.mantenimientoService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un mantenimiento' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() actualizarMantenimientoDto: ActualizarMantenimientoDto,
  ) {
    return await this.mantenimientoService.update(
      id,
      actualizarMantenimientoDto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un mantenimiento' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.mantenimientoService.remove(id);
  }
}

