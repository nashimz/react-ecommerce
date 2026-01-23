import { Request, Response } from "express";
import CheckoutService from "../services/checkoutService.js";
import { AuthRequest } from "../middlewares/auth.js";
import { Payment } from "mercadopago/dist/clients/payment/index.js";
import { MercadoPagoConfig } from "mercadopago/dist/mercadoPagoConfig.js";

export class PaymentController {
  private checkoutService: CheckoutService;

  constructor(checkoutService: CheckoutService) {
    this.checkoutService = checkoutService;
  }

  client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || "",
  });

  // 1. Inicia el proceso de pago
  public createPreference = async (req: AuthRequest, res: Response) => {
    // 1. Obtenemos el ID del usuario directamente del middleware de auth
    const userId = req.userId;
    // 2. Obtenemos los datos de dirección del body
    const { street, city, zipCode, phone } = req.body;

    // Validación
    if (!street || !city || !zipCode || !phone) {
      return res.status(400).json({
        message:
          "Missing checkout data: Street, City, ZipCode and Phone are required.",
      });
    }

    try {
      const result = await this.checkoutService.processCheckout({
        userId,
        street,
        city,
        zipCode,
        phone,
      });

      // Enviamos el initPoint para que el frontend redirija a Mercado Pago
      return res.status(200).json(result);
    } catch (error: any) {
      console.error("Payment Error:", error);
      res.status(500).json({ message: error.message });
    }
  };

  public handleSuccess = async (req: Request, res: Response) => {
    // Mercado Pago envía datos por URL aquí (payment_id, status, etc.)
    // Redirigimos al usuario a la página de éxito de tu React
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${FRONTEND_URL}/payment-success?status=approved`);
  };

  public handleFailure = async (req: Request, res: Response) => {
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${FRONTEND_URL}/payment-failure?status=rejected`);
  };

  // 2. Escucha a Mercado Pago (Webhook)
  public receiveWebhook = async (req: Request, res: Response) => {
    try {
      const { query } = req;

      // Mercado Pago envía notificaciones de distintos tipos.
      // Nos interesa cuando el 'type' es 'payment'.
      const topic = query.topic || query.type;

      if (topic === "payment") {
        const paymentId = query.id || query["data.id"];

        // 1. Consultar el estado del pago a Mercado Pago
        const payment = await new Payment(this.client).get({
          id: Number(paymentId),
        });

        if (payment.status === "approved") {
          // 2. Usar el external_reference que guardamos antes (ID de la Orden)
          const orderId = Number(payment.external_reference);
          const transactionId = payment.id?.toString() || "";
          const method = payment.payment_method_id || "mercadopago";

          // 3. Ejecutar la lógica de confirmación que ya tienes en tu Service
          await this.checkoutService.confirmPayment(
            orderId,
            transactionId,
            method,
          );

          console.log(`Orden ${orderId} confirmada exitosamente via Webhook.`);
        }
      }

      // IMPORTANTE: Siempre responder 200 o 204 a Mercado Pago
      // para que deje de re-enviar la notificación.
      res.sendStatus(200);
    } catch (error) {
      console.error("Webhook Error:", error);
      res.sendStatus(500);
    }
  };
}
