# 1. Imagem base do Node.js
FROM node:20-alpine

# 2. Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# 3. Copia os arquivos de dependência
COPY package.json ./
COPY package-lock.json ./
# (Se você usar yarn, copie o 'yarn.lock' em vez do 'package-lock.json')

# 4. Instala as dependências
RUN npm install

# 5. Copia o resto do código-fonte
# (No docker-compose, usaremos um 'volume' para isso ser mais rápido)
COPY . .

# 6. Expõe a porta que a aplicação usa (vista no seu .env)
EXPOSE 8000

# 7. Comando padrão para rodar a app em modo dev
CMD ["npm", "run", "dev"]