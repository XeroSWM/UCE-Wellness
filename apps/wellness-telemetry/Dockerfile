# apps/[NOMBRE-DEL-SERVICIO]/Dockerfile

FROM node:18-alpine

WORKDIR /app

# Copiamos archivos de configuración del monorepo raíz
COPY package*.json nx.json tsconfig.base.json ./

# Instalamos dependencias
RUN npm install --legacy-peer-deps

# Copiamos todo el código fuente
COPY . .

# --- CAMBIO 1: Pon el nombre exacto del servicio (como sale en la carpeta) ---
RUN npx nx build wellness-telemetry




# Exponemos el puerto (informativo)
# --- CAMBIO 2: Pon el puerto que corresponde a este servicio ---
EXPOSE 3004

# Arrancamos desde la carpeta dist
CMD ["node", "dist/apps/wellness-telemetry/main.js"]