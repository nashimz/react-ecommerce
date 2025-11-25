import express from "express";
import type { Request, Response } from "express";
import * as dotenv from "dotenv";
import { connectDB } from "./config/db.ts";
import productRoutes from "./routes/product.ts";
import { createUserRouter } from "./routes/user.ts";
import cors from "cors";
import cookieParser from "cookie-parser";
import { initializeUser } from "./models/User.ts";
import { initializeProduct } from "./models/Product.ts";
import { sequelize } from "./config/db.ts";
import { UserController } from "./controllers/userController.ts";
import UserRepository from "./repositories/userRepository.ts";
import User from "./models/User.ts";

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

// --- Rutas ---
app.get("/", (req: Request, res: Response) => {
  res.send("API de E-commerce funcionando.");
});

app.get("/api/users/test", (req, res) => {
  console.log("--- TEST ROUTE HIT ---");
  res.send("Test successful.");
});

async function startServer() {
  try {
    await connectDB();

    // 1. Inicializar TODOS los Modelos de forma centralizada
    initializeUser(sequelize);
    initializeProduct(sequelize);
    console.log("✅ Modelos (User, Product) inicializados.");

    // 2. Sincronizar (Crea las tablas)
    await sequelize.sync({ alter: true });
    console.log("✅ Base de datos sincronizada: Tablas listas.");

    const userRepository = new UserRepository(User);

    const userController = new UserController(userRepository);

    const userRouter = createUserRouter(userController);

    app.use("/api", productRoutes);
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
