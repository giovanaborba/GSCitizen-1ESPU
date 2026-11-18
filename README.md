- Repositório Github: https://github.com/giovanaborba/GSCitizen-1ESPU
- Deploy Vercel: https://gscitizentech.vercel.app

## Sobre o projeto

A **Pulse** é uma solução de CitizenTech voltada à acessibilidade e à mobilidade urbana, desenvolvida com o propósito de promover mais autonomia, segurança e independência nos deslocamentos de pessoas com deficiência visual. A proposta consiste em uma pulseira inteligente de navegação que utiliza sinais sonoros e táteis para orientar o usuário durante seus trajetos.

O projeto conta com três demonstrações principais:

- **Simulador:** demonstra o funcionamento da pulseira em situações do dia a dia, permitindo simular deslocamentos por meio de rotas salvas ou da indicação de um destino específico. Também apresenta os recursos de orientação e auxílio durante o uso do transporte público.
- **Vitrine:** apresenta os comandos e as respostas da pulseira em seus diferentes modos de funcionamento, explicando como cada sinal sonoro ou tátil orienta o usuário.
- **Diário de Deslocamentos:** permite registrar e acompanhar os trajetos realizados, reunindo indicadores que ajudam a visualizar o uso da solução e seu impacto na autonomia e segurança dos deslocamentos.
  
# Pré-requisitos

- VSCode
- Node.js 20.9 ou mais novo (o npm já vem junto): https://nodejs.org
- Git, só pra clonar.

**Para conferir as versões: node -v e npm -v no terminal.**

# Instalação e execução

## 1. Obter o projeto

**Opção ZIP:**

- Extraia o arquivo GSCitizen-1ESPU-main.zip no local desejado.
- Abra o VSCODE
- Terminal > Novo Terminal (ou CTRL+J)
- Escolha a opção do terminal >bash<
- Se ainda não estiver, entre na pasta que contém o projeto "GSCitizen-1ESPU" com o comando no terminal: ``cd GSCitizen-1ESPU``

**Opção Clone Github:**

- Copie "https://github.com/giovanaborba/GSCitizen-1ESPU.git", no Repositório Github apertando "<> CODE" na cor verde.
- Abra o VS Code
- Terminal > Novo Terminal (ou CTRL+J)
- Escolha a opção do terminal >bash<
- Git clone + endereço copiado do Github
- digite: ``cd GSCitizen-1ESPU``


## 2. Instalar as dependências
- digite no terminal ``npm ci``
- digite: ``code .`` (Abre o projeto no VS Code)

``"npm ci"`` instala exatamente as versões do package-lock.json. Se der erro, use **``npm install``**.

## 3. Ligar a API do Diário

Crie o arquivo .env.local dentro de "GSCitizen-1ESPU" e coloque dentro dela:
``NEXT_PUBLIC_API_URL=https://6af795c99bdd097c326e26be.mockapi.io/api/v1``

### Observação:

Se criar o arquivo fora do VSCODE, ao salvar, escolha: "todos os arquivos".

Sem esse arquivo, o site funciona normalmente, e só o Diário mostra a mensagem de erro de conexão.

Se o Diário mostra erro de conexão > Confira o .env.local, pare o servidor com Ctrl + C no terminal no VSCode que o servidor foi iniciado, e rode ``npm run dev`` de novo”

##  4. Rodar o projeto

`npm run dev`

Abra http://localhost:3000 no navegador. Para parar, ``use Ctrl + C`` no terminal no VSCode que o servidor foi iniciado.