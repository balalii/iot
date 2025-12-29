import { NextResponse } from 'next/server';

// Struktur data baru
let sensorData = {
  s1: 0,
  s2: 0,
  s3: 0,
  lastUpdate: new Date().toISOString(),
};

export async function GET() {
  return NextResponse.json(sensorData);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Update data jika ada
    if (body.s1 !== undefined) sensorData.s1 = parseInt(body.s1);
    if (body.s2 !== undefined) sensorData.s2 = parseInt(body.s2);
    if (body.s3 !== undefined) sensorData.s3 = parseInt(body.s3);

    sensorData.lastUpdate = new Date().toISOString();

    console.log('Data Multi Sensor:', sensorData);
    return NextResponse.json({ message: 'Data updated', data: sensorData });
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
