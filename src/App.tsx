import React from "react";
import { useState, useEffect } from "react";
import { LearningForm } from "./components/LearningForm";
import { HistoryList } from "./components/HistoryList";
import { LearningDetails } from "./components/LearningDetails";
import { getAllHistory, addHistory, deleteHistory } from "./supabaseFunction";
import "./App.css";

export function App() {
  const [records, setRecords] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [remark, setRemark] = useState("");
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true); //データ読み込み中かどうか

  const fetchTodos = async () => {
    setIsLoading(true); // 読み込み開始時
    const todos = await getAllHistory();
    setTodos(todos);
    setIsLoading(false); // 読み込み完了時
  };

  // useEffectの外でも fetchTodos を使えるようにする
  useEffect(() => {
    fetchTodos();
  }, []);

  // recordsかtimeが空欄でボタン押されたら表示する
  const onClickAdd = async (event) => {
    event.preventDefault();
    if (records === "" || time === "") {
      setError("入力されていない項目があります。");
      return;
    }

    setIsLoading(true); // 追加開始
    const result = await addHistory(records, time, remark); // Supabaseに追加
    // "undefined" じゃなければ成功とみなす
    if (result !== undefined) {
      await fetchTodos(); // その場で再取得して即時反映させる
      setRecords("");
      setTime("");
      setRemark("");
      setError("");
    } else {
      setError("データの追加に失敗しました。");
    }
    setIsLoading(false);
  };

  // 登録後の削除処理を追加
  const handleDelete = async (id) => {
    setIsLoading(true);
    const result = await deleteHistory(id);
    if (result) {
      await fetchTodos();
    }
    setIsLoading(false);
  };

  // 学習時間を合計する処理
  const totalStudyTime = todos.reduce(
    (sum, records) => sum + Number(records.time),
    0
  );

  // 目標時間を達成したら+500してエンドレス表示
  const baseGoal = 1000;
  const plusGoal = 500;
  const goalCount =
    totalStudyTime < baseGoal
      ? 0
      : Math.floor((totalStudyTime - baseGoal) / plusGoal) + 1;

  // 次の目標時間 ~勉強に終わりはない、産まれてから死ぬまで勉強~
  const currentGoal = baseGoal + goalCount * plusGoal;

  // Loading画面を表示する処理
  if (isLoading) {
    return (
      <div
        style={{
          background: "#333",
          color: "#fff",
          minHeight: "100vh",
          padding: "2em",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2rem",
        }}
      >
        Now Loading...
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="card">
        <LearningForm
          records={records}
          setRecords={setRecords}
          time={time}
          setTime={setTime}
          remark={remark}
          setRemark={setRemark}
          onClickAdd={onClickAdd}
        />
      </div>
      <div className="card">
        <LearningDetails
          records={records}
          time={time}
          remark={remark}
          error={error}
          totalStudyTime={totalStudyTime}
          currentGoal={currentGoal}
          baseGoal={baseGoal}
        />
      </div>
      <div className="card">
        <HistoryList history={todos} onClickDelete={handleDelete} />
      </div>
    </div>
  );
}
