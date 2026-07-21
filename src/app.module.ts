import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { InventoryModule } from './inventory/inventory.module';
import { AuthModule } from './auth/auth.module';
import { MantenimientoModule } from './mantenimiento/mantenimiento.module';

@Module({
  imports: [
    PrismaModule,
    ProductsModule,
    CategoriesModule,
    InventoryModule,
    AuthModule,
    MantenimientoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
