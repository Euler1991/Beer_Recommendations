# Etapa 1: Build
FROM node:18 AS builder
WORKDIR /app

# Copia archivos y instala dependencias
COPY package*.json ./
RUN npm install

# Copia el resto del código
COPY . .

# Compila el build de producción
RUN npm run build


# Etapa 2: Servir contenido
FROM node:18 AS runner
WORKDIR /app

# Instalar un servidor estático (serve)
RUN npm install -g serve

# Copiar solo el resultado final del build
COPY --from=builder /app/dist ./dist

# Puerto que usará la app
EXPOSE 3000

# Servir la app
CMD ["serve", "-s", "dist", "-l", "3000"]
