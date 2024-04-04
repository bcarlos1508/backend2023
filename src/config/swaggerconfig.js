import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Documentacion de las APIs',
      version: '1.0.0',
      description: 'Informacion de la integracion de Users, Products, Cart',
      contact:{
        name: 'Dotto Martin',
        url: 'https://www.linkedin.com/in/martin-miguel-dotto-1a3913141/'
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