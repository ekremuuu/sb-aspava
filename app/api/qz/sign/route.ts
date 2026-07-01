import { NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
    try {
        const { request } = await req.json();
        if (!request) {
            return new NextResponse('Missing request parameter to sign', { status: 400 });
        }

        const keyPath = path.join(process.cwd(), 'certificates', 'private-key.pem');
        if (!fs.existsSync(keyPath)) {
            return new NextResponse('Private key not found on server', { status: 404 });
        }

        const privateKey = fs.readFileSync(keyPath, 'utf8');

        // QZ Tray SHA512 imzalama
        const sign = crypto.createSign('SHA512');
        sign.update(request);
        sign.end();

        const signature = sign.sign(privateKey, 'base64');
        return new NextResponse(signature, {
            status: 200,
            headers: { 'Content-Type': 'text/plain' }
        });
    } catch (e: any) {
        console.error('QZ sign error:', e);
        return new NextResponse('Signing failed: ' + e.message, { status: 500 });
    }
}
