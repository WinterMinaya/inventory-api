import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearMantenimientoDto } from './dto/crear-mantenimiento.dto';
import { ActualizarMantenimientoDto, MaintenanceStatus } from './dto/actualizar-mantenimiento.dto';

@Injectable()
export class MantenimientoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(crearMantenimientoDto: CrearMantenimientoDto, userId: number) {
    const { productId, description, type, cost, technician } =
      crearMantenimientoDto;

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(
        `Producto con ID ${productId} no encontrado`,
      );
    }

    return await this.prisma.maintenance.create({
      data: {
        description,
        type,
        cost: cost ?? 0,
        technician,
        status: 'PENDING',
        productId,
        userId,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll() {
    return await this.prisma.maintenance.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            stock: true,
            category: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const maintenance = await this.prisma.maintenance.findUnique({
      where: { id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!maintenance) {
      throw new NotFoundException(
        `Mantenimiento con ID ${id} no encontrado`,
      );
    }

    return maintenance;
  }

  async findByProduct(productId: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(
        `Producto con ID ${productId} no encontrado`,
      );
    }

    return await this.prisma.maintenance.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findByStatus(status: string) {
    const validStatuses = Object.values(MaintenanceStatus);
    if (!validStatuses.includes(status as MaintenanceStatus)) {
      throw new BadRequestException(
        `Estado inválido. Valores permitidos: ${validStatuses.join(', ')}`,
      );
    }

    return await this.prisma.maintenance.findMany({
      where: { status: status as MaintenanceStatus },
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async update(
    id: number,
    actualizarMantenimientoDto: ActualizarMantenimientoDto,
  ) {
    await this.findOne(id);

    return await this.prisma.maintenance.update({
      where: { id },
      data: actualizarMantenimientoDto,
      include: {
        product: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return await this.prisma.maintenance.delete({
      where: { id },
    });
  }
}

