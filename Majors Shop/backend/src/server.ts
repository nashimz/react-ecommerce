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
import { initializeCart } from "./models/Cart.js";
import { initializeCartItem } from "./models/Cart-item.js";
import { configureModelAssociations } from "./models/associations.js";
import { sequelize } from "./config/db.js";
import { UserController } from "./controllers/userController.js";
import { ProductController } from "./controllers/productController.js"; // 🚨 NUEVO
import UserRepository from "./repositories/userRepository.js";
import ProductRepository from "./repositories/productRepository.js";
import User from "./models/User.js";
import Cart from "./models/Cart.js";
import CartItem from "./models/Cart-item.js";
import { createCartRouter } from "./routes/cart.js";
import { CartController } from "./controllers/cartController.js";
import CartRepository from "./repositories/cartRepository.js";
import { startCartCleanupCron } from "./cronJobs/cartCleanUpTask.js";
import Address, { initializeAddress } from "./models/Address.js";
import Order, { initializeOrder } from "./models/Order.js";
import OrderItem, { initializeOrderItem } from "./models/Order-item.js";
import Transaction, { initializeTransaction } from "./models/Transaction.js";
import { createOrderRouter } from "./routes/order.js";
import OrderRepository from "./repositories/orderRepository.js";
import { OrderController } from "./controllers/orderController.js";
import CheckoutService from "./services/checkoutService.js";
import { PaymentController } from "./controllers/paymentController.js";
import { createPaymentRouter } from "./routes/payment.js";
import AddressRepository from "./repositories/addressRepository.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "https://majorsshop.vercel.app/",
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    credentials: true,
  }),
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

async function startServer() {
  try {
    await connectDB();

    const ProductModel = initializeProduct(sequelize);
    initializeUser(sequelize);
    initializeCart(sequelize);
    initializeCartItem(sequelize);
    initializeAddress(sequelize);
    initializeOrder(sequelize);
    initializeOrderItem(sequelize);
    initializeTransaction(sequelize);

    configureModelAssociations();

    console.log("✅ Modelos (User, Product, Cart, CartItem) inicializados.");

    await sequelize.sync({ alter: true });
    console.log("✅ Base de datos sincronizada: Tablas listas.");

    const userRepository = new UserRepository(User);
    const userController = new UserController(userRepository);
    const userRouter = createUserRouter(userController);
    const productRepository = new ProductRepository(ProductModel);
    const productController = new ProductController(productRepository);
    const productRouter = createProductRouter(productController);
    const cartRepository = new CartRepository(Cart, CartItem, ProductModel);
    const cartController = new CartController(cartRepository);
    const cartRouter = createCartRouter(cartController);
    const orderRepository = new OrderRepository(Order, OrderItem, Transaction);
    const addressRepository = new AddressRepository(Address);
    const checkoutService = new CheckoutService(
      cartRepository,
      productRepository,
      orderRepository,
      addressRepository,
    );
    const orderController = new OrderController(
      orderRepository,
      checkoutService,
    );
    const orderRouter = createOrderRouter(orderController);
    const paymentRouter = createPaymentRouter(
      new PaymentController(checkoutService),
    );

    app.use("/api/products", productRouter);
    app.use("/api/users", userRouter);
    app.use("/api/carts", cartRouter);
    app.use("/api/orders", orderRouter);
    app.use("/api/payments", paymentRouter);
    startCartCleanupCron();
    app.listen(PORT, () => {
      console.log(`🚀 Servidor Express corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Fallo crítico al iniciar la aplicación:", error);
    process.exit(1);
  }
}

startServer();
