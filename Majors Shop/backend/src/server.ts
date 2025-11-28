import express from "express";
import type { Request, Response } from "express";
import * as dotenv from "dotenv";
import { connectDB } from "./config/db.js"; // Se mantiene la conexión
import { createProductRouter } from "./routes/product.js"; // 🚨 Cambiado para usar inyección
import { createUserRouter } from "./routes/user.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { initializeUser } from "./models/User.js";
import { initializeProduct } from "./models/Product.js";
import { sequelize } from "./config/db.js";
import { UserController } from "./controllers/userController.js";
import { ProductController } from "./controllers/productController.js"; // 🚨 NUEVO
import UserRepository from "./repositories/userRepository.js";
import ProductRepository from "./repositories/productRepository.js";
import User from "./models/User.js";
// import Product from "./models/Product.js"; // No es necesaria si usas la variable ProductModel

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://react-ecommerce-sigma-five.vercel.app/",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use((req: Request, res: Response, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// --- Rutas de Prueba ---
app.get("/", (req: Request, res: Response) => {
  res.send("API de E-commerce funcionando.");
});

app.get("/api/users/test", (req, res) => {
  console.log("--- TEST ROUTE HIT ---");
  res.send("Test successful.");
});

// ------------------------------------------------------------------
// Función principal para iniciar el servidor
// ------------------------------------------------------------------
async function startServer() {
  try {
    await connectDB(); // Conecta (autentica)

    // 1. INICIALIZACIÓN DE MODELOS (Capturando el resultado de initializeProduct)
    const ProductModel = initializeProduct(sequelize); // 🚨 Capturamos aquí
    initializeUser(sequelize);

    console.log("✅ Modelos (User, Product) inicializados.");

    // 2. SINCRONIZACIÓN DE BASE DE DATOS
    await sequelize.sync({ alter: true });
    console.log("✅ Base de datos sincronizada: Tablas listas.");

    // ----------------------------------------------------
    // 3. INYECCIÓN DE DEPENDENCIAS (Configuración de Servicios)
    // ----------------------------------------------------

    // --- Configuración de Usuarios ---
    const userRepository = new UserRepository(User);
    const userController = new UserController(userRepository);
    const userRouter = createUserRouter(userController); // Router que usa el Controller inyectado

    // --- Configuración de Productos ---
    // 3a. Crear Repositorio de Producto (inyectando el ProductModel inicializado)
    const productRepository = new ProductRepository(ProductModel);

    // 3b. Crear Controlador de Producto (inyectando el Repositorio)
    const productController = new ProductController(productRepository);

    // 3c. Crear Router de Producto (inyectando el Controlador)
    const productRouter = createProductRouter(productController);

    // 4. USAR RUTAS (Middleware)
    app.use("/api/products", productRouter); // 🚨 Rutas de producto con inyección
    app.use("/api/users", userRouter);

    app.listen(PORT, () => {
      console.log(`🚀 Servidor Express corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Fallo crítico al iniciar la aplicación:", error);
    process.exit(1);
  }
}

startServer();
