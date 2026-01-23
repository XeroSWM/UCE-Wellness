# apps/wellness-frontend/Dockerfile

# Etapa 1: Construcción
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json nx.json tsconfig.base.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npx nx build wellness-frontend

# Etapa 2: Servidor Web (Nginx)
FROM nginx:alpine
# Copiamos los archivos compilados al servidor
COPY --from=builder /app/dist/apps/wellness-frontend /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]