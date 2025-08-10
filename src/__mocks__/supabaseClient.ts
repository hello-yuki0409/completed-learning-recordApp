// src/__mocks__/supabaseClient.ts
type InsertResult<T> = { data: T | null; error: null };
type SelectList<T> = { data: T[]; error: null };

const tableApi = {
  // select("*").returns<T>()
  select: (_fields?: string) => ({
    returns: async <T>() =>
      ({ data: [] as unknown as T, error: null } as SelectList<T>),
  }),

  // insert([...]).select().single()
  insert: (_rows: any[]) => ({
    select: () => ({
      single: async () =>
        ({
          data: { id: 1, records: "", time: 0, remark: null },
          error: null,
        } as InsertResult<any>),
    }),
  }),

  // delete().eq('id', id)
  delete: () => ({
    eq: async (_col: string, _val: any) => ({ error: null }),
  }),
};

export const supabase = {
  from: (_table: string) => tableApi,
};
