// src/config/database.ts

import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Configuración de la conexión a MySQL
const DB_NAME = process.env.DB_NAME ?? "ecommerce_db_default";
const DB_USER = process.env.DB_USER ?? "root";
const DB_PASSWORD = process.env.DB_PASSWORD ?? "your_default_password";
const DB_HOST = process.env.DB_HOST ?? "localhost";
const DB_DIALECT = "mysql";

// 1. Crear la instancia de Sequelize
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT,
  logging: false, // Desactiva el logging de las consultas SQL en la consola (opcional)
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
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
