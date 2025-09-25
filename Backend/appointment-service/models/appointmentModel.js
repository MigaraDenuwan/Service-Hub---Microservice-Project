import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Appointment = sequelize.define('Appointment', {
  customerId: { type: DataTypes.STRING, allowNull: false },
  providerId: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  time: { type: DataTypes.TIME, allowNull: false },
  status: {
    type: DataTypes.ENUM('BOOKED', 'CANCELLED', 'RESCHEDULED'),
    defaultValue: 'BOOKED'
  }
});

export default Appointment;
