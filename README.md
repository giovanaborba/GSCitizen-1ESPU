- Repositório Github: https://github.com/giovanaborba/GSCitizen-1ESPU
- Deploy Vercel: https://gscitizentech.vercel.app

## Sobre o projeto

A **Pulse** é uma solução de CitizenTech voltada à acessibilidade e à mobilidade urbana, desenvolvida com o propósito de promover mais autonomia, segurança e independência nos deslocamentos de pessoas com deficiência visual. A proposta consiste em uma pulseira inteligente de navegação que utiliza sinais sonoros e táteis para orientar o usuário durante seus trajetos.

O projeto conta com três demonstrações principais:

- **Simulador:** demonstra o funcionamento da pulseira em situações do dia a dia, permitindo simular deslocamentos por meio de rotas salvas ou da indicação de um destino específico. Também apresenta os recursos de orientação e auxílio durante o uso do transporte público.
- **Vitrine:** apresenta os comandos e as respostas da pulseira em seus diferentes modos de funcionamento, explicando como cada sinal sonoro ou tátil orienta o usuário.
- **Diário de Deslocamentos:** permite registrar e acompanhar os trajetos realizados, reunindo indicadores que ajudam a visualizar o uso da solução e seu impacto na autonomia e segurança dos deslocamentos.
  
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
1. git clone https://github.com/giovanaborba/GSCitizen-1ESPU
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
