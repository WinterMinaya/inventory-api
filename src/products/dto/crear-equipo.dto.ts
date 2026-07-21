import {
  IsString,
  IsNumber,
  IsOptional,
  MinLength,
  MaxLength,
  Min,
  IsInt,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CrearEquipoDto {
  @ApiProperty({
    description: 'Nombre del equipo/producto',
    example: 'Laptop Lenovo ThinkPad X1',
    minLength: 3,
    maxLength: 200,
  })
  @IsString({ message: 'El nombre debe ser un texto' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(200, { message: 'El nombre no puede exceder 200 caracteres' })
  name: string;

  @ApiPropertyOptional({
    description: 'Descripción del equipo',
    example: 'Laptop empresarial con procesador i7 y 16GB RAM',
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto' })
  @MaxLength(500, { message: 'La descripción no puede exceder 500 caracteres' })
  description?: string;

  @ApiProperty({
    description: 'Precio del equipo',
    example: 2500.99,
    minimum: 0,
  })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El precio debe ser un número válido con hasta 2 decimales' },
  )
  @Min(0, { message: 'El precio no puede ser negativo' })
  price: number;

  @ApiProperty({
    description: 'Stock inicial del equipo',
    example: 10,
    minimum: 0,
  })
  @IsInt({ message: 'El stock debe ser un número entero' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock: number;

  @ApiPropertyOptional({
    description: 'Stock mínimo para alertas',
    example: 5,
    minimum: 0,
    default: 5,
  })
  @IsOptional()
  @IsInt({ message: 'El stock mínimo debe ser un número entero' })
  @Min(0, { message: 'El stock mínimo no puede ser negativo' })
  minStock?: number;

  @ApiProperty({
    description: 'ID de la categoría del equipo',
    example: 1,
  })
  @IsInt({ message: 'El ID de categoría debe ser un número entero' })
  categoryId: number;
}

