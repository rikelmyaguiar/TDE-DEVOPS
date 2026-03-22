# Imagem base
FROM node:20-alpine

# Diretório de trabalho
WORKDIR /app

# Copiar package.json e instalar dependências
COPY package.json package-lock.json* ./
RUN npm install

# Copiar código da API
COPY . .

# Porta que a API vai expor
EXPOSE 3000

# Comando para rodar
CMD ["npm", "start"]
