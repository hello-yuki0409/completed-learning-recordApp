import {
  Container,
  SimpleGrid,
  Stack,
  Center,
  Spinner,
  Text,
} from "@chakra-ui/react";

import { useState, useEffect, type MouseEvent } from "react";
import { LearningForm } from "./components/LearningForm";
import { HistoryList, type HistoryRecord } from "./components/HistoryList";
import { LearningDetails } from "./components/LearningDetails";
import { getAllHistory, addHistory, deleteHistory } from "./supabaseFunction";

export default function App() {
  const [records, setRecords] = useState<string>("");
  const [time, setTime] = useState<number>(NaN);
  const [error, setError] = useState<string>("");
  const [remark, setRemark] = useState<string>("");

  const [historyRecords, setHistoryRecordss] = useState<HistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); //データ読み込み中かどうか

  const fetchTodos = async () => {
    setIsLoading(true); // 読み込み開始時
    // getAllHistory の戻り値が型定義されていない場合に備えて as で明示
    const items = (await getAllHistory()) as HistoryRecord[];
    setHistoryRecordss(items);
    setIsLoading(false); // 読み込み完了で Loading 消す
  };

  // useEffectの外でも fetchTodos を使えるようにする
  useEffect(() => {
    fetchTodos();
  }, []);

  // recordsかtimeが空欄でボタン押されたら表示する
  const onClickAdd = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!records.trim() || Number.isNaN(time)) {
      setError("入力されていない項目があります。");
      return;
    }

    setIsLoading(true); // 追加開始
    const result = await addHistory(records, time, remark); // Supabaseに追加
    // "undefined" じゃなければ成功とみなす
    if (result !== undefined) {
      await fetchTodos(); // その場で再取得して即時反映させる
      setRecords("");
      setTime(NaN); // フォームクリア時は未入力状態（NaN）に戻す
      setRemark("");
      setError("");
    } else {
      setError("データの追加に失敗しました。");
    }
    setIsLoading(false);
  };

  // 登録後の削除処理を追加
  const handleDelete = async (id: HistoryRecord["id"]) => {
    setIsLoading(true);
    // Supabase の削除関数を呼び出し、該当IDのデータを削除
    const result = await deleteHistory(id);
    // 削除が成功したら最新の履歴データを再取得して画面を更新する
    if (result) {
      await fetchTodos();
    }
    setIsLoading(false);
  };

  // 学習時間を合計する処理
  const totalStudyTime = historyRecords.reduce(
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

  // 次の目標時間 ~勉強に終わりはない 産まれてから死ぬまで勉強~
  const currentGoal = baseGoal + goalCount * plusGoal;

  // Loading画面を表示する処理
  if (isLoading) {
    return (
      <Center minH="100vh" bg="leaf.50">
        <Stack align="center" spacing={3}>
          <Spinner thickness="3px" color="leaf.500" size="lg" />
          <Text color="leaf.700">Now Loading...</Text>
        </Stack>
      </Center>
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
        <HistoryList history={historyRecords} onClickDelete={handleDelete} />
      </div>
    </div>
  );
}
