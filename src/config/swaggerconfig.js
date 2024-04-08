import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Documentacion de las APIs',
      version: '1.0.0',
      description: 'Informacion de la integracion de Users, Products, Cart',
      contact:{
        name: 'Carlos Barrera',
        url: ''
      }
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Servidor Local',
      },
    ],
  },
  apis: ['../docs/*.yaml'], 
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;