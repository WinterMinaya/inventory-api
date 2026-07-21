import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMovementDto } from './dto/create-movement.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { paginate, getPaginationParams } from '../common/helpers/pagination.helper';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async createMovement(createMovementDto: CreateMovementDto, userId: number) {
    const { type, quantity, productId, reason } = createMovementDto;

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true, stock: true },
    });

    if (!product) {
      throw new NotFoundException(
        `Producto con ID ${productId} no encontrado`,
      );
    }

    if (type === 'OUT' && product.stock < quantity) {
      throw new BadRequestException(
        `Stock insuficiente. Stock actual: ${product.stock}, cantidad solicitada: ${quantity}`,
      );
    }

    const movement = await this.prisma.$transaction(async (tx) => {
      const newMovement = await tx.inventoryMovement.create({
        data: { type, quantity, reason: reason || null, productId, userId },
        include: {
          product: { select: { id: true, name: true, stock: true } },
          user: { select: { id: true, name: true, email: true } },
        },
      });

      const stockChange = type === 'IN' ? quantity : -quantity;
      await tx.product.update({
        where: { id: productId },
        data: { stock: { increment: stockChange } },
      });

      return newMovement;
    });

    return movement;
  }

  async findAll(paginationDto: PaginationDto) {
    const { skip, take } = getPaginationParams(paginationDto);

    const [data, total] = await Promise.all([
      this.prisma.inventoryMovement.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          product: { select: { id: true, name: true, stock: true } },
          user: { select: { id: true, name: true, email: true } },
        },
      }),
      this.prisma.inventoryMovement.count(),
    ]);

    return paginate(data, total, paginationDto);
  }

  async findOne(id: number) {
    const movement = await this.prisma.inventoryMovement.findUnique({
      where: { id },
      include: {
        product: {
          select: { id: true, name: true, stock: true, category: true },
        },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!movement) {
      throw new NotFoundException(
        `Movimiento de inventario con ID ${id} no encontrado`,
      );
    }

    return movement;
  }

  async findByProduct(productId: number, paginationDto?: PaginationDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true },
    });

    if (!product) {
      throw new NotFoundException(
        `Producto con ID ${productId} no encontrado`,
      );
    }

    if (paginationDto) {
      const { skip, take } = getPaginationParams(paginationDto);
      const [data, total] = await Promise.all([
        this.prisma.inventoryMovement.findMany({
          skip,
          take,
          where: { productId },
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        }),
        this.prisma.inventoryMovement.count({ where: { productId } }),
      ]);
      return paginate(data, total, paginationDto);
    }

    return await this.prisma.inventoryMovement.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }
}

