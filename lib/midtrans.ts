// @ts-ignore
import { Snap } from 'midtrans-client';

// Create Core API instance
export const snap = new Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});