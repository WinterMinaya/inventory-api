import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { CreateMovementDto } from './dto/create-movement.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Movimientos de Inventario')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Registrar un movimiento de inventario',
    description:
      'Registra una entrada (IN) o salida (OUT) y actualiza el stock automáticamente',
  })
  async create(
    @Body() createMovementDto: CreateMovementDto,
    @CurrentUser('id') userId: number,
  ) {
    return await this.inventoryService.createMovement(
      createMovementDto,
      userId,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los movimientos (paginado)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  async findAll(@Query() paginationDto: PaginationDto) {
    return await this.inventoryService.findAll(paginationDto);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Obtener movimientos por producto (paginado)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  async findByProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Query() paginationDto: PaginationDto,
  ) {
    return await this.inventoryService.findByProduct(productId, paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un movimiento por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.inventoryService.findOne(id);
  }
}

