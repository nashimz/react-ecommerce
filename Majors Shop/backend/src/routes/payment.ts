import { Router } from "express";
import { PaymentController } from "../controllers/paymentController.js";
import { authenticate } from "../middlewares/auth.js";

export function createPaymentRouter(
  paymentController: PaymentController,
): Router {
  const router = Router();

  router.post("/checkout", authenticate, (req, res) =>
    paymentController.createPreference(req, res),
  );
  router.get("/success", (req, res) =>
    paymentController.handleSuccess(req, res),
  );
  router.get("/failure", (req, res) =>
    paymentController.handleFailure(req, res),
  );

  // Si vas a usar webhooks de Mercado Pago (recomendado)
  // router.post("/webhook", (req, res) => paymentController.handleWebhook(req, res));

  return router;
}
