import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const connectWithRetry = async () => {
  const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'postgres',
      logging: false
    }
  );

  let retries = 5;
  while (retries) {
    try {
      await sequelize.authenticate();
      console.log('Database connected!');
      break;
    } catch (err) {
      console.error('Database connection failed, retrying in 5s...', err);
      retries -= 1;
      await new Promise(res => setTimeout(res, 5000));
    }
  }

  return sequelize;
};

export default await connectWithRetry();
