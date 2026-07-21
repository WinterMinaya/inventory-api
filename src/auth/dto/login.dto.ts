import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan@example.com',
  })
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido' })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'Password123!',
  })
  @IsString({ message: 'La contraseña debe ser un texto' })
  password: string;
}

