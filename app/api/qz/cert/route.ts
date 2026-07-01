import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const certPath = path.join(process.cwd(), 'certificates', 'digital-certificate.txt');
        if (!fs.existsSync(certPath)) {
            return new NextResponse('Certificate file not found', { status: 404 });
        }
        const cert = fs.readFileSync(certPath, 'utf8');
        return new NextResponse(cert, {
            status: 200,
            headers: { 'Content-Type': 'text/plain' }
        });
    } catch (e: any) {
        console.error('QZ cert fetch error:', e);
        return new NextResponse('Failed to fetch certificate: ' + e.message, { status: 500 });
    }
}
