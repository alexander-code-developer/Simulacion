FROM node:20-bookworm-slim

# Instalar Python 3, pip y las librerías científicas precompiladas del sistema
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-numpy \
    python3-pandas \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Instalar dependencias de Node.js
COPY package*.json ./
RUN npm ci --omit=dev

# Copiar el código del servidor y el motor Python
COPY . .

EXPOSE 5000

CMD ["node", "server.js"]