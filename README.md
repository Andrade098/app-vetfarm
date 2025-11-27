# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. instale as dependências e configurações iniciais

   ```bash
   Vá na pasta raiz do projeto e digite:
   npm install

   Posteriormenta vá na pasta backend
   cd backend
   npm install

   Crie um arquivo .env na raiz da pasta backend e coloque os dados de acordo com suas credenciais do SGBD
   
   JWT_SECRET= sua chave secreta
   DB_HOST=localhost
   DB_USER=root
   DB_PASS='sua senha'
   DB_NAME=vetfarm


   Posteriormente vá em src e em config e edite o arquivo db.js com seus dados

    const db = new Sequelize("vetfarm",     "root", "mesma_senha_do_arquivo_.env", {
     host: "localhost",
     dialect: "mysql",
     logging: false,
     });

      digite cd backend/src/scripts no terminal,após isso digite node gerarHash.js para gerar um hash de uma senha, a senha que ele irá gerar o hash é 123456,então quando o programa estiver rodando coloque essa senha e não o hash, o hash é só para ficar criptografada no SGBD



     Crie um schema diretamento no SGBD com o nome vetfarm

     
   posteriormente insere o comando a seguir:

   INSERT INTO farmacia (
    nome, 
    email, 
    senha, 
    telefone, 
    endereco, 
    cidade, 
    estado, 
    bairro, 
    cep, 
    descricao, 
    tipo, 
    createdAt, 
    updatedAt
   ) VALUES (
    'Farmácia VetFarm Matriz', 
    'matriz@vetfarm.com', 
    '', <- COLOQUE O HASH CRIADO PELO SCRIPT GERARHASH.JS AQUI.
    '(11) 99999-9999', 
    'Rua Principal, 123', 
    'São Paulo', 
    'SP', 
    'Centro', 
    '01234-567', 
    'Farmácia veterinária matriz - especializada em medicamentos para animais', 
    'matriz', 
    NOW(), 
    NOW()
   );

   ```



2. Start the app

   ```bash
   cd backend
   node server.js
   abra um novo terminal e digite: npx expo start


   Faça login em farmacia com o email e senha criados no comando do passo anterior.

    Se não mudou nada em nenhum arquivo será 
     Email:matriz@vetfarm.com
     Senha:123456

   

   
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
