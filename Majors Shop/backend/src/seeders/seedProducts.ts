// src/seeders/seedProducts.ts

import { fetchProducts } from "../utils/fetchApi.js";
import { sequelize } from "../config/db.js";
import ProductRepository from "../repositories/productRepository.js"; // Importa la CLASE
// 🚨 NECESARIO: Importar la función de inicialización del modelo de producto
import { initializeProduct } from "../models/Product.js";
// Si tienes otros modelos (como User), importalos e inicializalos aquí también.

async function seedProducts() {
  try {
    // 1. CONEXIÓN A LA BASE DE DATOS
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos establecida.");

    // 2. INICIALIZACIÓN DE MODELOS
    // Es crucial inicializar el modelo ANTES de usarlo en el repositorio.
    const ProductModel = initializeProduct(sequelize);

    // 3. SINCRONIZACIÓN
    // Asegura que la tabla exista en la base de datos de Render.
    await sequelize.sync({ alter: true });
    console.log("Database & tables synced!");

    // 4. INYECCIÓN DE DEPENDENCIAS
    // Creamos la INSTANCIA del repositorio, pasándole el modelo ya inicializado.
    const productRepository = new ProductRepository(ProductModel);

    // 5. CHEQUEO DE DATOS EXISTENTES
    const productCount = await productRepository.count();
    if (productCount > 0) {
      console.log(
        `✅ La base de datos ya contiene ${productCount} productos. Seeding omitido.`
      );
      return;
    }

    // 6. OBTENER DATOS
    console.log("⏳ Obteniendo productos de dummyjson.com...");
    // La variable 'productsData' se declara aquí como una 'const' local
    const productsData = await fetchProducts();

    // 7. INSERTAR DATOS
    console.log(`⏳ Insertando ${productsData.length} productos...`);
    await productRepository.createBulk(productsData);

    console.log(
      `🎉 Seeding exitoso: ${productsData.length} productos insertados.`
    );
  } catch (error) {
    console.error("❌ Error durante el proceso de Seeding:", error);
  } finally {
    // 8. CERRAR CONEXIÓN
    await sequelize.close();
    console.log("Conexión a la base de datos cerrada.");
  }
}

seedProducts();
