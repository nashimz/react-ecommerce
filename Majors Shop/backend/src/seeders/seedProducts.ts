import { fetchProducts } from "../utils/fetchApi.js";
import { sequelize } from "../config/db.js";
import ProductRepository from "../repositories/productRepository.js";

async function seedProducts() {
  await sequelize.authenticate();
  console.log("✅ Conexión a la base de datos establecida.");

  try {
    await sequelize.sync({ alter: true });
    console.log("Database & tables synced!");

    // 1. Usamos el Repositorio para contar los productos
    const productCount = await ProductRepository.count();
    if (productCount > 0) {
      console.log(
        `✅ La base de datos ya contiene ${productCount} productos. Seeding omitido.`
      );
      return;
    }

    // 2. Obtener datos
    console.log("⏳ Obteniendo productos de dummyjson.com...");
    const productsData = await fetchProducts();

    // 3. Usamos el Repositorio para crear los productos
    await ProductRepository.createBulk(productsData);

    console.log(
      `🎉 Seeding exitoso: ${productsData.length} productos insertados.`
    );
  } catch (error) {
    console.error("❌ Error durante el proceso de Seeding:", error);
  } finally {
    await sequelize.close();
  }
}

seedProducts();
