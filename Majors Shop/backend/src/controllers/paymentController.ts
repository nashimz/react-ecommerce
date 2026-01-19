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
      const { shippingAddressId } = req.body;
      const userId = (req as any).user.id; // Asumiendo que tienes un middleware de auth

      const result = await this.checkoutService.processCheckout({
        userId,
        shippingAddressId,
        paymentDetails: { method: "mercadopago", token: "" }, // El token no es necesario para Preferences
      });

      // Enviamos el initPoint al frontend
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
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
