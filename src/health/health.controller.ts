import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({
    summary: 'Verificar estado del servidor',
    description: 'Endpoint de health check que verifica la conexión a la base de datos',
  })
  async check() {
    const startTime = Date.now();

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      const dbStatus = 'healthy';
      const responseTime = Date.now() - startTime;

      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: dbStatus,
        responseTime: `${responseTime}ms`,
        memoryUsage: {
          heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
          rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
        },
        environment: process.env.NODE_ENV || 'development',
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: 'unhealthy',
        error: error.message,
      };
    }
  }
}

