# NodeJS-G-8-Capstone-Wk-4

## Features

1. User can sign up
2. User can sign in
3. User can post a property advert
4. User can update the details of a property advert
5. User can mark his/her posted advert as sold
6. User can delete his/her property advert
7. User can view all property adverts
8. User can view all properties of a specific type - 2 bedrooms, 3 bedrooms, mini flat etc
9. User can view a specific property advert

## API endpoints

1. `POST /api/v1/auth/signup`: Creates a user account
2. `POST /api/v1/auth/signin`: Login a user
3. `POST /api/v1/property`: Create a property advert
4. `PATCH /property/<:property-id>`: Update property data
5. `PATCH /property/<:property-id>/sold`: Mark a property as sold
6. `DELETE /property/<:property-id>`: Delete a property advert
7. `GET /property/<:property-id>`: Get a specific property by ID
8. `GET /property`: Get all properties
9. `GET /property/search?type=propertyType`: Get all properties with a specific type

## Body Payload Specification

Signup expects

```js
{
    email: string,
    first_name: string,
    last_name: string,
    password: string
    phone: string,
    address: string,
    is_admin: boolean,
}
```

Signin expects

```js
{
    status: ENUM('available','sold'),
    price: float
    state: string
    city: string
    address: string
    type: ENUM('2 bedrooms','3 bedrooms','mini flat')
    image_url: string
}
```

Create property expects

```js
{
    email: string,
    password: string
}
```

## Tools

- NodeJS/Express: Server
- MySQL: Storage
- JWT: Token based authentication
- bcryptjs: Password security
- winston/morgan: Logs
- Joi: Validations

## Available scripts

- `start`: Starts the server with node
- `start:dev`: Starts the server in watch mode
- `db:up`: Creates the database
- `db:down`: Drops the database
- `tables:up`: Creates database tables
- `db:init`: Creates both the database and tables

## Getting started

You can either fork this repository or clone it by starting your terminal, then change the directory to where you would like to save it and run

```sh
git clone https://github.com/desirekaleba/node-mysql-jwt-auth.git
```

Change to the newly downloaded directory with

```sh
cd node-mysql-jwt-auth
```

Install the required dependencies with

```sh
npm install
```

Initialize the database with

```sh
npm run db:init
```

Start the app with

```sh
npm start
```

You can also start it in watch mode with

```sh
npm run start:dev
```

## Folder structure

```sh
.
├── index.js
├── README.md
├── package-lock.json
├── package.json
└── src
    ├── config
    │   ├── cloudinary.config.js
    │   ├── db.config.init.js
    │   └── db.config.js
    ├── constants
    │   └── statusCode.js
    ├── controllers
    │   ├── auth.controller.js
    │   ├── property.controller.js
    │   └── user.controller.js
    ├── database
    │   ├── queries.js
    │   └── scripts
    │       ├── dbDown.js
    │       ├── dbUp.js
    │       └── tablesUp.js
    ├── middlewares
    │   ├── asyncHandler.js
    │   ├── checkEmail.js
    │   ├── checkUserAuth.js
    │   └── validatorHandler.js
    ├── models
    │   ├── property.model.js
    │   └── user.model.js
    ├── routes
    │   ├── auth.route.js
    │   ├── property.route.js
    │   └── user.route.js
    ├── utils
    │   ├── logger.js
    │   ├── password.js
    │   ├── secrets.js
    │   └── token.js
    └── validators
        └── auth.js
```
