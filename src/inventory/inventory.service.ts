import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMovementDto } from './dto/create-movement.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async createMovement(createMovementDto: CreateMovementDto, userId: number) {
    const { type, quantity, productId, reason } = createMovementDto;

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(
        `Producto con ID ${productId} no encontrado`,
      );
    }

    // Validar stock suficiente para salidas
    if (type === 'OUT' && product.stock < quantity) {
      throw new BadRequestException(
        `Stock insuficiente. Stock actual: ${product.stock}, cantidad solicitada: ${quantity}`,
      );
    }

    // Ejecutar transacción: crear movimiento + actualizar stock
    const movement = await this.prisma.$transaction(async (tx) => {
      const newMovement = await tx.inventoryMovement.create({
        data: {
          type,
          quantity,
          reason: reason || null,
          productId,
          userId,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              stock: true,
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

      // Actualizar stock del producto
      const stockChange = type === 'IN' ? quantity : -quantity;
      await tx.product.update({
        where: { id: productId },
        data: {
          stock: {
            increment: stockChange,
          },
        },
      });

      return newMovement;
    });

    return movement;
  }

  async findAll() {
    return await this.prisma.inventoryMovement.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            stock: true,
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
    const movement = await this.prisma.inventoryMovement.findUnique({
      where: { id },
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

    if (!movement) {
      throw new NotFoundException(
        `Movimiento de inventario con ID ${id} no encontrado`,
      );
    }

    return movement;
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

    return await this.prisma.inventoryMovement.findMany({
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
}

