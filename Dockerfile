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

# Construir la aplicación
RUN npx nest build

# Debug: listar estructura de dist para confirmar ruta
RUN find dist/ -name "*.js" -type f | sort

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["node", "dist/src/main.js"]
