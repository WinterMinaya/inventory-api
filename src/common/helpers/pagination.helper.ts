import { PaginationDto, PaginatedResult } from '../dto/pagination.dto';

export function paginate<T>(
  data: T[],
  total: number,
  paginationDto: PaginationDto,
): PaginatedResult<T> {
  const page = paginationDto.page ?? 1;
  const limit = paginationDto.limit ?? 10;
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

export function getPaginationParams(paginationDto: PaginationDto): {
  skip: number;
  take: number;
} {
  const page = paginationDto.page ?? 1;
  const limit = paginationDto.limit ?? 10;
  return {
    skip: (page - 1) * limit,
    take: limit,
  };
}

