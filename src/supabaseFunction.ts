import { supabase } from "./supabaseClient";
import { Record as LearningRecord } from "./domain/record";

type StudyRecordRow = {
  id: number; // DB実型に合わせる
  records: string; // DBカラム: records（表示では title に読み替え）
  time: number; // DBは数値想定 -> クラスでは string に変換して保持
  remark: string | null; // null 許容
};

const toLearningRecord = (row: StudyRecordRow): LearningRecord => {
  return new LearningRecord(
    String(row.id), // id は string に統一
    row.records, // records -> title（クラスのプロパティ名）
    String(row.time),
    row.remark ?? "" // null を空文字へ寄せる
  );
};

export async function getAllHistory(): Promise<LearningRecord[]> {
  const { data, error } = await supabase
    .from("study-record")
    .select("id, records, time, remark");
  if (error || !data) {
    console.error("学習履歴の取得に失敗しました:", error);
    return []; // 失敗時は空配列を返す（UI側で空として扱える）
  }

  return (data as StudyRecordRow[]).map(toLearningRecord);
}

export async function addHistory(
  records: string,
  time: number,
  remark: string
): Promise<LearningRecord | undefined> {
  const { data, error } = await supabase
    .from("study-record")
    .insert([{ records, time, remark }])
    .select("id, records, time, remark")
    .single(); // 1件だけ返す

  if (error || !data) {
    console.error("学習履歴の追加に失敗しました:", error);
    return undefined;
  }

  const row = data as StudyRecordRow;
  return toLearningRecord(row);
}

export async function deleteHistory(id: string): Promise<boolean> {
  const { error } = await supabase.from("study-record").delete().eq("id", id);
  if (error) {
    console.error("削除エラー:", error);
    return false;
  }
  return true;
}
