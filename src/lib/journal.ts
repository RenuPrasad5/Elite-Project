import { supabase } from './supabase';

export interface Trade {
  id: string;
  user_id: string;
  date: string;
  asset: string;
  side: 'Long' | 'Short';
  pnl: number;
  rr: number;
  setup: string;
  emotion: string;
  mistake: string;
  tags: string[];
  screenshot_url?: string;
  created_at?: string;
}

export async function fetchTrades(userId: string): Promise<Trade[]> {
  const { data, error } = await supabase
    .from('trades')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching trades:', error);
    return [];
  }
  return data as Trade[];
}

export async function createTrade(trade: Omit<Trade, 'id' | 'created_at'>): Promise<Trade | null> {
  const { data, error } = await supabase
    .from('trades')
    .insert([trade])
    .select()
    .single();

  if (error) {
    console.error('Error creating trade:', error);
    throw error;
  }
  return data as Trade;
}

export async function deleteTrade(tradeId: string): Promise<boolean> {
  const { error } = await supabase
    .from('trades')
    .delete()
    .eq('id', tradeId);

  if (error) {
    console.error('Error deleting trade:', error);
    return false;
  }
  return true;
}

export async function uploadScreenshot(file: File, userId: string): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('trade-screenshots')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading screenshot:', uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage
    .from('trade-screenshots')
    .getPublicUrl(filePath);

  return data.publicUrl;
}
