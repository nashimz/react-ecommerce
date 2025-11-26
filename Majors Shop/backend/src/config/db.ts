// src/config/database.ts

import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";

// Cargar variables de entorno desde el archivo .env
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL must be defined in the .env file.");
}

// 1. Crear la instancia de Sequelize
const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

// 2. Función para probar la conexión
async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    // Puedes re-lanzar o salir de la aplicación si la conexión falla
    throw error;
  }
}

// 3. Exportar la instancia de Sequelize y la función de conexión
export { sequelize, connectDB };
