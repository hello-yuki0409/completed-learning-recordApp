import { supabase } from "./supabaseClient";

// Supabaseの study-record テーブル1行分の型
export type StudyRecord = {
  id: number | string;
  records: string;
  time: number;
  remark?: string | null;
};

export async function getAllHistory(): Promise<StudyRecord[]> {
  const { data, error } = await supabase
    .from("study-record")
    .select("*")
    .returns<StudyRecord[]>();
  if (error) {
    console.error("学習履歴の取得に失敗しました:", error);
    return []; // 失敗時は空配列を返す（UI側で空として扱える）
  }
  return data ?? [];
}

export async function addHistory(
  records: string,
  time: number,
  remark: string
): Promise<StudyRecord | undefined> {
  const { data, error } = await supabase
    .from("study-record")
    .insert([{ records, time, remark }])
    .select()
    .single(); // 1件だけ返す

  if (error) {
    console.error("学習履歴の取得に失敗しました:", error);
    return undefined;
  }
  return data;
}

export async function deleteHistory(id: StudyRecord["id"]): Promise<boolean> {
  const { error } = await supabase.from("study-record").delete().eq("id", id);
  if (error) {
    console.error("削除エラー:", error);
    return false;
  }
  return true;
}
