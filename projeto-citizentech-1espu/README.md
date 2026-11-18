## Repositório Github: https://github.com/othiandrade/GSCitizenTech
## Deploy Vercel: https://gs-citizen-tech-1espu.vercel.app/

# Pré-requisitos

- Node.js 20.9 ou mais novo (o npm já vem junto): https://nodejs.org
- Git, só pra clonar.
- Para conferir as versões: node -v e npm -v.

# Instalação e execução

## 1. Obter o projeto

Opção ZIP:

1. Extraia o arquivo GSCitizenTech-main.zip.
2. Abra o terminal na pasta que contém projeto-citizentech-1espu:

``cd GSCitizenTech-main/projeto-citizentech-1espu``

Opção clone github:
```
1. git clone https://github.com/othiandrade/GSCitizenTech.git
2. cd GSCitizenTech/projeto-citizentech-1espu
```

## 2. Instalar as dependências
- ``npm ci``

Esse comando instala exatamente as versões do package-lock.json. Se der erro, use **``npm install``**.

## 3. Ligar a API do Diário

Crie o arquivo .env.local dentro de projeto-citizentech-1espu com:
``NEXT_PUBLIC_API_URL=https://6af795c99bdd097c326e26be.mockapi.io/api/v1``

### Observação:

Ao salvar escolha "todos os arquivos” ou crie o arquivo pelo VS Code.

Sem esse arquivo, o site funciona normalmente, e só o Diário mostra a mensagem de erro de conexão.

Se o Diário mostra erro de conexão > Confira o .env.local, pare o servidor com Ctrl + C e rode npm run dev de novo”

##  4. Rodar o projeto

`npm run dev`

Abra http://localhost:3000 no navegador. Para parar, use Ctrl + C.

Para rodar a versão de produção, que é mais rápida:

```
- npm run build
- npm start
```
