# Etapa 1: Construcción
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma.config.ts ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Generar Prisma Client y construir
RUN npx prisma generate
RUN npm run build

# Etapa 2: Producción
FROM node:20-alpine AS production

WORKDIR /app

# Copiar node_modules de la etapa builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma.config.ts ./

# Exponer puerto
EXPOSE 3000

# Comando de inicio: ejecutar migraciones y luego iniciar app
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]

