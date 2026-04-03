const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Provider Service API',
      version: '1.0.0',
      description: 'API documentation for Provider Service'
    },
    servers: [
      {
        url: 'http://localhost:5003',
        description: 'Development server'
      }
    ]
  },
  apis: ['./routes/*.js', './server.js']
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('Swagger docs available at http://localhost:5003/api-docs');
};

module.exports = setupSwagger;
