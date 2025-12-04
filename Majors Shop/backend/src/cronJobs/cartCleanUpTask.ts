import cron from "node-cron";

import CartRepository from "../repositories/cartRepository";
import Product from "../models/Product";
import CartItem from "../models/CartItem";
import Cart from "../models/Cart";

const cartRepository = new CartRepository(Cart, CartItem, Product);

const CLEANUP_THRESHOLD_DAYS = 2;

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
