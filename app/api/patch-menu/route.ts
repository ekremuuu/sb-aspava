export const runtime = 'edge';
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import newMenuData from '../../../data/menu.json';

export async function GET() {
    try {
        const currentMenuData = await redis.get('aspava:menu');
        if (!currentMenuData) return NextResponse.json({ error: 'Menu not found in Redis' });
        
        let m = typeof currentMenuData === 'string' ? JSON.parse(currentMenuData) : currentMenuData;
        const newM = newMenuData as any;
        
        // Sadece açıklamaları (desc) güncelleyelim, fiyatları ve diğer ayarları koruyalım
        Object.keys(m).forEach(cat => {
            if (m[cat] && m[cat].items && newM[cat] && newM[cat].items) {
                m[cat].items = m[cat].items.map((item: any) => {
                    // Yeni dosyada aynı ada sahip ürünü bul
                    const match = newM[cat].items.find((newItem: any) => newItem.name === item.name);
                    if (match) {
                        item.desc = match.desc; // Gramaj ve içindekiler bilgisini al
                    }
                    return item;
                });
            }
        });
        
        await redis.set('aspava:menu', m);
        return NextResponse.json({ success: true, message: 'Menü açıklamaları, gramajlar ve içindekiler başarıyla güncellendi. Fiyatlarınız korundu!' });
    } catch(e: any) {
        return NextResponse.json({ error: String(e) });
    }
}
