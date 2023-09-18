import { NextResponse } from 'next/server';

import { snap } from '@/lib/midtrans';
import prismadb from '@/lib/prismadb';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  const { productIds } = await req.json();

  if (!productIds || productIds.length === 0) {
    return new NextResponse('Product ids are required', { status: 400 });
  }

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds
      }
    }
  });

  const totalPrice = products.reduce((total, product) => {
    return total + Number(product.price);
  }, 0);

  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        create: productIds.map((productId: string) => ({
          product: {
            connect: {
              id: productId,
            },
          },
        })),
      },
    },
  });

  const parameter = {
    transaction_details: {
      order_id: order.id,
      gross_amount: totalPrice,
    },
    callbacks: {
      finish: 'http://localhost:3001/cart',
    },
    credit_card: {
      secure: true,
    },
    customer_details: {
      first_name: 'Charles',
      last_name: 'Pasiak'
    },
  };

  const midtransResult = await snap.createTransaction(parameter);
  const url = midtransResult.redirect_url;
  const token = midtransResult.token;

  return NextResponse.json(
    { url, token },
    {
      headers: corsHeaders,
    }
  );
}
