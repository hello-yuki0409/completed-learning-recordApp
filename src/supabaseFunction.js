import { supabase } from "./supabaseClient";

export const getAllHistory = async () => {
  const todos = await supabase.from("study-record").select("*");
  return todos.data;
};

export const addHistory = async (records, time, remark) => {
  const { data, error } = await supabase
    .from("study-record")
    .insert([{ records, time, remark }]);
  if (error) {
    console.error("エラーだよん♪♪", error);
    return null;
  }
  return data;
};

export const deleteHistory = async (id) => {
  const { error } = await supabase.from("study-record").delete().eq("id", id);
  if (error) {
    console.error("削除エラー:", error);
    return null;
  }
  return true;
};
