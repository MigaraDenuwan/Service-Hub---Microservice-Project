import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Appointment Service API',
      version: '1.0.0',
      description: 'API documentation for Appointment Service'
    },
    servers: [
      {
        url: 'http://localhost:5002',
        description: 'Development server'
      }
    ]
  },
  apis: ['./routes/*.js', './index.js'] // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('Swagger docs available at http://localhost:5002/api-docs');
};

export default setupSwagger;
