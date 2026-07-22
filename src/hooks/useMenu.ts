import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Category, MenuItem } from '@/types';

interface MenuData {
  categories: Category[];
  items: MenuItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useMenu(): MenuData {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const [catRes, itemRes] = await Promise.all([
      supabase.from('categories').select('*').order('sort_order', { ascending: true }),
      supabase
        .from('menu_items')
        .select('*')
        .eq('is_available', true)
        .order('sort_order', { ascending: true }),
    ]);
    if (catRes.error || itemRes.error) {
      setError(catRes.error?.message ?? itemRes.error?.message ?? 'Failed to load menu');
    } else {
      setCategories(catRes.data ?? []);
      setItems(itemRes.data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return { categories, items, loading, error, refetch: load };
}
