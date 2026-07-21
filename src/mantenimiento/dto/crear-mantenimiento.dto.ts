import {
  IsString,
  IsInt,
  IsNumber,
  IsOptional,
  MinLength,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CrearMantenimientoDto {
  @ApiProperty({
    description: 'ID del equipo/producto a mantener',
    example: 1,
  })
  @IsInt({ message: 'El ID del producto debe ser un número entero' })
  productId: number;

  @ApiProperty({
    description: 'Descripción del mantenimiento realizado',
    example: 'Limpieza interna y cambio de pasta térmica',
    minLength: 5,
    maxLength: 500,
  })
  @IsString({ message: 'La descripción debe ser un texto' })
  @MinLength(5, {
    message: 'La descripción debe tener al menos 5 caracteres',
  })
  @MaxLength(500, {
    message: 'La descripción no puede exceder 500 caracteres',
  })
  description: string;

  @ApiProperty({
    description: 'Tipo de mantenimiento (preventivo/correctivo)',
    example: 'Preventivo',
  })
  @IsString({ message: 'El tipo de mantenimiento debe ser un texto' })
  type: string;

  @ApiPropertyOptional({
    description: 'Costo del mantenimiento',
    example: 150.50,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El costo debe ser un número válido con hasta 2 decimales' },
  )
  @Min(0, { message: 'El costo no puede ser negativo' })
  cost?: number;

  @ApiProperty({
    description: 'Nombre del técnico responsable',
    example: 'Carlos Rodríguez',
    minLength: 3,
    maxLength: 100,
  })
  @IsString({ message: 'El nombre del técnico debe ser un texto' })
  @MinLength(3, {
    message: 'El nombre del técnico debe tener al menos 3 caracteres',
  })
  @MaxLength(100, {
    message: 'El nombre del técnico no puede exceder 100 caracteres',
  })
  technician: string;
}

