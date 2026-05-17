# --- Etapa 1: Compilación ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Compila TypeScript a JavaScript (Normalmente guarda el resultado en /dist)
RUN npm run build

# --- Etapa 2: Producción ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
# Instala solo las dependencias necesarias para ejecutar la app (sin devDependencies)
RUN npm ci

# Copiamos los archivos compilados y configuraciones
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /app/src/drizzle ./src/drizzle

EXPOSE 8000

# Ejecutamos la migración usando el binario local instalado, seguido de la app
CMD ["sh", "-c", "./node_modules/.bin/drizzle-kit push && node dist/Index.js"]