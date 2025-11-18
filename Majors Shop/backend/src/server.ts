import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.js";
import cors from "cors";

// Cargar variables de entorno
dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // tu React/Vite
  })
);
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Opcional: Middleware simple de logeonpm install --save-dev @types/express
app.use((req: Request, res: Response, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// --- Rutas ---
app.get("/", (req: Request, res: Response) => {
  res.send("API de E-commerce funcionando.");
});

// Usar el archivo de rutas de productos (donde estará /api/products)
app.use("/api", productRoutes);

// --- Inicialización del Servidor y la Base de Datos ---
async function startServer() {
  try {
    // 1. Conectar a la base de datos
    await connectDB();

    // 2. Iniciar el servidor Express
    app.listen(PORT, () => {
      console.log(`🚀 Servidor Express escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    // Si la conexión falla, no iniciamos el servidor
    console.error(
      "FATAL ERROR: Falló la inicialización del servidor debido a un problema con la base de datos.",
      error
    );
    process.exit(1); // Salir del proceso con error
  }
}

// Ejecutar la función de inicio
startServer();
