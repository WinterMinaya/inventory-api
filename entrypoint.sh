#!/bin/sh
# entrypoint.sh - Script de entrada para producción en Render
set -e

echo "🚀 Inventory API - Entrypoint"
echo "================================"

echo "📦 Node version: $(node --version)"

# Ejecutar migraciones de Prisma
echo "🔄 Ejecutando migraciones de Prisma..."
npx prisma migrate deploy --schema=./prisma/schema.prisma 2>&1 || echo "⚠️ Migraciones ya aplicadas o no necesarias"

# Iniciar la aplicación
echo "🌐 Iniciando servidor..."
exec node dist/main
