import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearEquipoDto } from './dto/crear-equipo.dto';
import { ActualizarEquipoDto } from './dto/actualizar-equipo.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(crearEquipoDto: CrearEquipoDto) {
    const category = await this.prisma.category.findUnique({
      where: { id: crearEquipoDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException(
        `Categoría con ID ${crearEquipoDto.categoryId} no encontrada`,
      );
    }

    return await this.prisma.product.create({
      data: {
        name: crearEquipoDto.name,
        description: crearEquipoDto.description,
        price: crearEquipoDto.price,
        stock: crearEquipoDto.stock,
        minStock: crearEquipoDto.minStock ?? 5,
        categoryId: crearEquipoDto.categoryId,
      },
      include: {
        category: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.product.findMany({
      orderBy: { name: 'asc' },
      include: {
        category: true,
        _count: {
          select: { movements: true },
        },
      },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        movements: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Equipo con ID ${id} no encontrado`);
    }

    return product;
  }

  async update(id: number, actualizarEquipoDto: ActualizarEquipoDto) {
    await this.findOne(id);

    if (actualizarEquipoDto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: actualizarEquipoDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException(
          `Categoría con ID ${actualizarEquipoDto.categoryId} no encontrada`,
        );
      }
    }

    return await this.prisma.product.update({
      where: { id },
      data: actualizarEquipoDto,
      include: {
        category: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    const movementsCount = await this.prisma.inventoryMovement.count({
      where: { productId: id },
    });

    if (movementsCount > 0) {
      throw new ConflictException(
        `No se puede eliminar el equipo porque tiene ${movementsCount} movimiento(s) de inventario asociado(s)`,
      );
    }

    return await this.prisma.product.delete({
      where: { id },
    });
  }

  async checkLowStock() {
    const products = await this.prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: { stock: 'asc' },
    });

    return products.filter((product) => product.stock <= product.minStock);
  }
}

