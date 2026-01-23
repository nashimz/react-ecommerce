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
  router.get("/success", authenticate, (req, res) =>
    paymentController.handleSuccess(req, res),
  );
  router.get("/failure", authenticate, (req, res) =>
    paymentController.handleFailure(req, res),
  );

  router.post("/webhook", paymentController.receiveWebhook);

  // Si vas a usar webhooks de Mercado Pago (recomendado)
  // router.post("/webhook", (req, res) => paymentController.handleWebhook(req, res));

  return router;
}
