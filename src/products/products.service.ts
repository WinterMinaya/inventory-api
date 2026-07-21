import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearEquipoDto } from './dto/crear-equipo.dto';
import { ActualizarEquipoDto } from './dto/actualizar-equipo.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { paginate, getPaginationParams } from '../common/helpers/pagination.helper';

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
        category: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { skip, take } = getPaginationParams(paginationDto);

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take,
        orderBy: { name: 'asc' },
        include: {
          category: {
            select: { id: true, name: true },
          },
          _count: {
            select: { movements: true, maintenances: true },
          },
        },
      }),
      this.prisma.product.count(),
    ]);

    return paginate(data, total, paginationDto);
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true },
        },
        movements: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            id: true,
            type: true,
            quantity: true,
            reason: true,
            createdAt: true,
            user: {
              select: { id: true, name: true },
            },
          },
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
        category: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    const movementsCount = await this.prisma.inventoryMovement.count({
      where: { productId: id },
    });

    const maintenancesCount = await this.prisma.maintenance.count({
      where: { productId: id },
    });

    if (movementsCount > 0 || maintenancesCount > 0) {
      throw new ConflictException(
        `No se puede eliminar el equipo porque tiene ${movementsCount} movimiento(s) y ${maintenancesCount} mantenimiento(s) asociado(s)`,
      );
    }

    return await this.prisma.product.delete({
      where: { id },
    });
  }

  async checkLowStock(paginationDto: PaginationDto) {
    // Obtener todos los productos con stock bajo (stock <= minStock)
    const allProducts = await this.prisma.product.findMany({
      orderBy: { stock: 'asc' },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    });

    const lowStockProducts = allProducts.filter(
      (product) => product.stock <= product.minStock,
    );

    const { skip, take } = getPaginationParams(paginationDto);
    const total = lowStockProducts.length;
    const paginatedData = lowStockProducts.slice(skip, skip + take);

    return paginate(paginatedData, total, paginationDto);
  }
}

