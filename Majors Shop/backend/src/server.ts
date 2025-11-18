import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://react-ecommerce-sigma-five.vercel.app/",
    ],
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

app.use("/api", productRoutes);

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor Express escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(
      "FATAL ERROR: Falló la inicialización del servidor debido a un problema con la base de datos.",
      error
    );
    process.exit(1);
  }
}

startServer();
