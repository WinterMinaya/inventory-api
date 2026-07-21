import {
  IsString,
  IsNumber,
  IsOptional,
  MinLength,
  MaxLength,
  Min,
  IsEnum,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum MaintenanceStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class ActualizarMantenimientoDto {
  @ApiPropertyOptional({
    description: 'Descripción del mantenimiento realizado',
    example: 'Limpieza interna, cambio de pasta térmica y actualización de BIOS',
    minLength: 5,
    maxLength: 500,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto' })
  @MinLength(5, {
    message: 'La descripción debe tener al menos 5 caracteres',
  })
  @MaxLength(500, {
    message: 'La descripción no puede exceder 500 caracteres',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Tipo de mantenimiento (preventivo/correctivo)',
    example: 'Correctivo',
  })
  @IsOptional()
  @IsString({ message: 'El tipo de mantenimiento debe ser un texto' })
  type?: string;

  @ApiPropertyOptional({
    description: 'Estado del mantenimiento',
    enum: MaintenanceStatus,
    example: MaintenanceStatus.COMPLETED,
  })
  @IsOptional()
  @IsEnum(MaintenanceStatus, {
    message:
      'El estado debe ser: PENDING, IN_PROGRESS, COMPLETED o CANCELLED',
  })
  status?: MaintenanceStatus;

  @ApiPropertyOptional({
    description: 'Costo del mantenimiento',
    example: 200.00,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El costo debe ser un número válido con hasta 2 decimales' },
  )
  @Min(0, { message: 'El costo no puede ser negativo' })
  cost?: number;

  @ApiPropertyOptional({
    description: 'Nombre del técnico responsable',
    example: 'María López',
    minLength: 3,
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'El nombre del técnico debe ser un texto' })
  @MinLength(3, {
    message: 'El nombre del técnico debe tener al menos 3 caracteres',
  })
  @MaxLength(100, {
    message: 'El nombre del técnico no puede exceder 100 caracteres',
  })
  technician?: string;
}


