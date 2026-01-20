import { Request, Response } from "express";
import CheckoutService from "../services/checkoutService.js";

export class PaymentController {
  private checkoutService: CheckoutService;

  constructor(checkoutService: CheckoutService) {
    this.checkoutService = checkoutService;
  }

  // 1. Inicia el proceso de pago
  public createPreference = async (req: Request, res: Response) => {
    try {
      // Los nombres deben coincidir con el body: JSON.stringify({ userId, shippingAddressId })
      const { userId, shippingAddressId } = req.body;

      if (!userId || !shippingAddressId) {
        return res
          .status(400)
          .json({ message: "userId and shippingAddressId are required" });
      }

      // Llamamos al servicio de negocio
      const result = await this.checkoutService.processCheckout({
        userId,
        shippingAddressId,
        street: req.body.street,
        city: req.body.city,
        zipCode: req.body.zipCode,
        phone: req.body.phone,
      });

      // Enviamos { id: orderId, initPoint: "..." } al frontend
      res.status(200).json(result);
    } catch (error: any) {
      console.error("Controller Error:", error);
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
  public handleWebhook = async (req: Request, res: Response) => {
    try {
      const { query } = req;

      // Mercado Pago envía notificaciones de varios tipos, nos importa 'payment'
      if (query.type === "payment") {
        const paymentId = query["data.id"] as string;

        // Aquí podrías usar el SDK de MP para validar el estado del pago
        // Pero para tu prueba inicial, vamos a llamar a la confirmación
        // Nota: En prod, aquí deberías buscar el pago en MP primero.

        // Supongamos que recuperamos el external_reference (orderId) del pago
        // await this.checkoutService.confirmPayment(orderId, paymentId, "mercadopago");
      }

      res.sendStatus(200); // MP necesita un 200 siempre
    } catch (error) {
      console.error("Webhook error:", error);
      res.sendStatus(500);
    }
  };
}
