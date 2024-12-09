import { v4 as uuidv4 } from "uuid";

import axios from "axios";

import { IPaystackPaymentObject } from "../interfaces/transaction-interface";

class PaymentService {
  private static generatePaystackReference(): string {
    return uuidv4();
  }

  public static async generatePaystackPaymentUrl(email: string, amount: number): Promise<IPaystackPaymentObject | null> {
    try {
      const amountInKobo = amount * 100;

      const params = {
        email,
        amount: amountInKobo,
        channels: ["card"],
        callback_url: `${process.env.PAYSTACK_CALLBACK_URL}`,
        reference: PaymentService.generatePaystackReference(),
      };

      const config = { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, "Content-Type": "application/json" } };

      const { data } = await axios.post("https://api.paystack.co/transaction/initialize", params, config);

      if (data && data.status) {
        return data.data;
      }

      return null as any;
    } catch (error) {
      console.error(error);
      return null as any;
    }
  }
}

export default PaymentService;
