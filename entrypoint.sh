#!/bin/sh
# entrypoint.sh - Script de entrada para producción
# Ejecuta migraciones de Prisma y luego inicia la aplicación

set -e

echo "🚀 Inventory API - Entrypoint"
echo "================================"

# Mostrar versión de Node
echo "📦 Node version: $(node --version)"
echo "📦 NPM version: $(npm --version)"

# Esperar a que PostgreSQL esté listo (útil para Render)
if [ -n "$DATABASE_URL" ]; then
  echo "🔍 Verificando conexión a la base de datos..."
  
  # Extraer host y puerto de DATABASE_URL
  DB_HOST=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^:]*\).*/\1/p')
  DB_PORT=$(echo "$DATABASE_URL" | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
  
  if [ -z "$DB_PORT" ]; then
    DB_PORT="5432"
  fi
  
  echo "   Host: $DB_HOST"
  echo "   Port: $DB_PORT"
  
  # Esperar hasta que la base de datos esté disponible (máx 60s)
  TIMEOUT=60
  ELAPSED=0
  while ! nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null; do
    if [ $ELAPSED -ge $TIMEOUT ]; then
      echo "❌ Timeout: No se pudo conectar a la base de datos después de ${TIMEOUT}s"
      exit 1
    fi
    echo "   ⏳ Esperando base de datos... (${ELAPSED}s)"
    sleep 2
    ELAPSED=$((ELAPSED + 2))
  done
  echo "✅ Base de datos disponible!"
fi

# Ejecutar migraciones de Prisma
echo "🔄 Ejecutando migraciones de Prisma..."
npx prisma migrate deploy
echo "✅ Migraciones aplicadas correctamente"

# Iniciar la aplicación
echo "🌐 Iniciando servidor en puerto ${PORT:-3000}..."
exec node dist/main

