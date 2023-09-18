// @ts-ignore
import { Snap } from 'midtrans-client';
import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function POST(req: Request) {
  const notificationJson = await req.json();

  // Create Core API / Snap instance (both have shared `transactions` methods)
  let apiClient = new Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
  });

  const statusResponse = await apiClient.transaction.notification(notificationJson);
  
  const orderId = statusResponse.order_id;
  const transactionStatus = statusResponse.transaction_status;
  const fraudStatus = statusResponse.fraud_status;

  if (transactionStatus == 'capture') {
    // capture only applies to card transaction, which you need to check for the fraudStatus
    if (fraudStatus == 'challenge') {
      // TODO set transaction status on your databaase to 'challenge'
    } else if (fraudStatus == 'accept') {
      // TODO set transaction status on your databaase to 'success'
    }
  } else if (transactionStatus == 'settlement') {
    const order = await prismadb.order.update({
      where: {
        id: orderId,
      },
      data: {
        isPaid: true,
        address: 'Palembang',
        phone: '08228069xxxx',
      },
      include: {
        orderItems: true,
      },
    });

    const productIds = order.orderItems.map((orderItem) => orderItem.productId);

    await prismadb.product.updateMany({
      where: {
        id: {
          in: [...productIds],
        },
      },
      data: {
        isArchived: true,
      },
    });
  } else if (transactionStatus == 'deny') {
    // TODO you can ignore 'deny', because most of the time it allows payment retries
    // and later can become success
  } else if (transactionStatus == 'cancel' || transactionStatus == 'expire') {
    // TODO set transaction status on your databaase to 'failure'
  } else if (transactionStatus == 'pending') {
    // TODO set transaction status on your databaase to 'pending' / waiting payment
  }

  return new NextResponse(null, { status: 200 });
}
