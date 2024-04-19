//app/api/saveBlockchain.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

type DataResponse = {
  message: string;
  success: boolean;
}

export const POST = async (req: NextRequest) => {
  if (req.method === 'POST') {
    const data = await req.json();
    console.log('Received blockchain data:', data);

    const dataDir = path.resolve('./chaindata');
    if (!fs.existsSync(dataDir)) {
      console.log('Creating data directory');
      fs.mkdirSync(dataDir);
    } const filePath = path.join(dataDir, 'blockchain.json');
    console.log('Saving blockchain data to', filePath);
    
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log('Blockchain data saved successfully');
      return new NextResponse(JSON.stringify({
        success: true,
        message: 'Blockchain data saved successfully',
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
      console.error('Error writing blockchain data:', err);
      return new NextResponse(JSON.stringify({
        success: false,
        message: 'Failed to save blockchain data',
      }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  } else {
    return new NextResponse(JSON.stringify({
      success: false,
      message: `Method ${req.method} Not Allowed`,
    }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }
};

