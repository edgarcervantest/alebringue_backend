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
RUN npm ci --only=production

# Copia los archivos compilados desde la etapa anterior
COPY --from=builder /app/dist ./dist

# Render pasará dinámicamente el PORT, pero dejamos una referencia orientativa
EXPOSE 8000

# Ejecuta el archivo JavaScript compilado
CMD ["sh", "-c", "npx drizzle-kit push && node dist/Index.js"]