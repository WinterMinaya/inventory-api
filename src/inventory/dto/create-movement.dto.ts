import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum MovementType {
  IN = 'IN',
  OUT = 'OUT',
}

export class CreateMovementDto {
  @ApiProperty({
    description: 'Tipo de movimiento: IN (entrada) o OUT (salida)',
    enum: MovementType,
    example: MovementType.IN,
  })
  @IsEnum(MovementType, {
    message: 'El tipo de movimiento debe ser IN (entrada) o OUT (salida)',
  })
  type: MovementType;

  @ApiProperty({
    description: 'Cantidad de unidades',
    example: 5,
    minimum: 1,
  })
  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  quantity: number;

  @ApiProperty({
    description: 'ID del producto',
    example: 1,
  })
  @IsInt({ message: 'El ID del producto debe ser un número entero' })
  productId: number;

  @ApiPropertyOptional({
    description: 'Razón o motivo del movimiento',
    example: 'Reabastecimiento de inventario',
  })
  @IsOptional()
  @IsString({ message: 'La razón debe ser un texto' })
  reason?: string;
}

