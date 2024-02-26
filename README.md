
# Sistema de Abertura de Chamados para Suporte Técnico

## Descrição

Este projeto é um aplicativo React Native completo para abertura de chamados de suporte técnico. Ele utiliza o Firebase como banco de dados e autenticação de usuários, tornando-o ideal para equipes de TI que desejam administrar seus chamados de forma eficiente e centralizada.

## Funcionalidades

Abertura de chamados: Os usuários da empresa podem abrir chamados de forma rápida e fácil, fornecendo informações detalhadas sobre o problema.

Acompanhamento de chamados: As equipes de suporte podem acompanhar o status dos chamados em tempo real, atribuindo técnicos, priorizando demandas e comunicando-se com os usuários.

Gerenciamento de chamados: As equipes podem visualizar históricos de chamados, filtrar por diversos critérios e gerar relatórios para análise de desempenho.

Autenticação de usuários: O Firebase garante a segurança do sistema com autenticação de usuários e controle de acesso.

Notificações em tempo real: Os usuários e técnicos são notificados sobre atualizações nos chamados, como novas mensagens, alterações de status e resoluções.

## Tecnologias

React Native: Framework para desenvolvimento de aplicativos móveis multiplataforma.

Firebase: Banco de dados em nuvem e plataforma de autenticação de usuários.

React Native CLI: Ferramenta para criação e gerenciamento de projetos React Native.

## Benefícios

Agilidade: A abertura e o acompanhamento de chamados são realizados de forma rápida e eficiente.

Organização: Centraliza o gerenciamento de chamados, facilitando o trabalho das equipes de TI.

Comunicação: Melhora a comunicação entre usuários e técnicos, agilizando a resolução de problemas.

Produtividade: Aumenta a produtividade das equipes de TI, permitindo que se concentrem em tarefas mais estratégicas.

Satisfação: Melhora a satisfação dos usuários com o suporte técnico, oferecendo um atendimento mais ágil e eficiente.

## Público-alvo

Equipes de suporte de TI: Que desejam uma ferramenta eficiente para gerenciar seus chamados.

Empresas: Que desejam oferecer um suporte técnico de qualidade para seus colaboradores.

Usuários: Que precisam abrir chamados de suporte técnico de forma rápida e fácil.

## Como usar

1. Clonar o repositório do GitHub:

```markdown
git clone https://github.com/SEU_NOME_DE_USUARIO/NOME_DO_REPOSITÓRIO.git
```
2. Instalar as dependências do projeto:

```markdown
cd NOME_DA_PASTA_DO_PROJETO
npm install
```

3. Criar o arquivo de configuração do Firebase:

Acesse o console do Firebase (https://console.firebase.google.com/).

Crie um novo projeto ou selecione um projeto existente.

Clique em "Configurações" no menu lateral.

Na guia "Geral", clique em "Adicionar aplicativo".

Selecione "Web" como plataforma.

Insira um nome para o seu aplicativo e clique em "Registrar aplicativo".

Baixe o arquivo google-services.json e salve-o na pasta src do seu projeto.

4. Iniciar o aplicativo no emulador:

```markdown
npm run android
ou

npm run ios
