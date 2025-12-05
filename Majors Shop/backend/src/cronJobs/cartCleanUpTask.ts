import cron from "node-cron";

import CartRepository from "../repositories/cartRepository.js";
import Product from "../models/Product.js";
import CartItem from "../models/Cart-item.js";
import Cart from "../models/Cart.js";

const cartRepository = new CartRepository(Cart, CartItem, Product);

const CLEANUP_THRESHOLD_DAYS = 1;

async function runCartCleanup(): Promise<void> {
  const thresholdDate = new Date();

  thresholdDate.setDate(thresholdDate.getDate() - CLEANUP_THRESHOLD_DAYS);

  try {
    const deletedCount: number = await cartRepository.deleteExpiredCarts(
      thresholdDate
    );
    console.log(
      `[CRON] Limpieza exitosa. Se eliminaron ${deletedCount} carritos inactivos.`
    );
  } catch (error) {
    console.error("[CRON] Error al ejecutar la limpieza de carritos:", error);
  }
}

export function startCartCleanupCron(): void {
  cron.schedule("0 0 3 * * *", () => {
    runCartCleanup();
  });
}
