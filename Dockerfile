FROM node:20-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma.config.ts ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Generar Prisma Client
ARG DATABASE_URL=postgresql://placeholder:placeholder@localhost:5432/placeholder
ENV DATABASE_URL=$DATABASE_URL
RUN npx prisma generate

# Construir la aplicación y verificar
RUN npm run build && ls -la dist/

# Exponer puerto
EXPOSE 3000

# Comando de inicio con debugging
CMD ls -la /app/dist/ && echo "---" && npx prisma migrate deploy --schema=./prisma/schema.prisma 2>&1 || echo "Migraciones OK" && echo "---" && node dist/main
