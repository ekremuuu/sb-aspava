export const runtime = 'edge';
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import menuData from '../../../data/menu.json';

export async function GET() {
    try {
        const existingMenu = await redis.get('aspava:menu');
        if (!existingMenu) {
            await redis.set('aspava:menu', menuData);
        }
        
        const existingTables = await redis.get('aspava:tables');
        if (!existingTables) {
            let tablesData = { tables: {} as any, pendingOrders: [], settings: { autoApprove: false } };
            for(let i=1; i<=10; i++) tablesData.tables[i.toString()] = { sessionId: null, orders: [], lastActivity: null };
            await redis.set('aspava:tables', tablesData);
        }

        return NextResponse.json({ success: true, message: 'Eksik veriler Redis e aktarıldı (Varolan veriler korundu)!' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
