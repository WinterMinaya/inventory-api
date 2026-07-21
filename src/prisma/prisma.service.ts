import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const connectionString = process.env.DATABASE_URL || '';

    // Configurar adapter para Supabase (certificado auto-firmado)
    const adapter = new PrismaPg({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Conectado a la base de datos exitosamente');
    } catch (error) {
      this.logger.error('Error al conectar a la base de datos:', error.message);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Desconectado de la base de datos');
  }
}
