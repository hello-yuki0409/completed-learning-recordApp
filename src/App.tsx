import {
  Container,
  SimpleGrid,
  Stack,
  Center,
  Spinner,
  Text,
  Button, // 追加: 新規登録ボタン
  useDisclosure, // 追加: モーダル開閉制御
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter, // 追加: モーダルUI
} from "@chakra-ui/react"; // 追加: モーダル導入のため

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

  const { isOpen, onOpen, onClose } = useDisclosure(); // モーダル制御

  // 入力ステートを初期化する関数（再オープン時に残さないため）
  const resetFormState = () => {
    // フォーム初期化
    setRecords("");
    setTime(NaN); //  未入力表現としてNaNに戻す
    setRemark("");
    setError("");
  };

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
    // 追加: 共通処理を呼ぶだけに
    await addRecordCore(); // 追加
  };

  const addRecordCore = async (): Promise<boolean> => {
    // 追加（UIイベントと処理を分離）
    if (!records.trim() || Number.isNaN(time)) {
      // 追加: 未入力チェック（後でreact-hook-formへ移行予定）
      setError("入力されていない項目があります。"); // 追加
      return false; // 追加
    }
    setIsLoading(true); // 追加開始
    const result = await addHistory(records, time, remark); // Supabaseに追加
    // "undefined" じゃなければ成功とみなす
    if (result !== undefined) {
      await fetchTodos(); // その場で再取得して即時反映させる
      resetFormState(); // 追加: 成功時に初期化
      setIsLoading(false); // 追加
      return true; // 追加: 成功を返す
    } else {
      setError("データの追加に失敗しました。");
      setIsLoading(false); // 追加
      return false; // 追加
    }
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
    <Container maxW="container.lg" py={8} bg="leaf.50">
      {/* 追加: ページ上部に「新規登録」ボタン。クリックでモーダルを開き、毎回初期化 */}
      <Stack direction="row" justify="flex-end" mb={4}>
        {" "}
        {/* 追加: 右上配置 */}
        <Button
          colorScheme="leaf" // 追加: テーマに合わせる
          onClick={() => {
            resetFormState();
            onOpen();
          }} // 追加: 開くたびに初期化
        >
          新規登録
        </Button>
      </Stack>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {/* 学習フォームはモーダル内へ移動するので、ここからは一旦削除 */}
        {/* // 削除: <LearningForm ... /> はモーダル内に移設 */}

        <LearningDetails
          records={records}
          time={time}
          remark={remark}
          error={error}
          totalStudyTime={totalStudyTime}
          currentGoal={currentGoal}
          baseGoal={baseGoal}
        />
        <HistoryList history={historyRecords} onClickDelete={handleDelete} />
      </SimpleGrid>

      {/* 追加: 登録モーダル本体 */}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          resetFormState();
        }}
      >
        {" "}
        {/* 追加: 閉じるときも初期化 */}
        <ModalOverlay /> {/* 追加 */}
        <ModalContent>
          {" "}
          {/* 追加 */}
          <ModalHeader>新規登録</ModalHeader> {/* 追加: タイトル要件 */}
          <ModalCloseButton /> {/* 追加 */}
          <ModalBody>
            {" "}
            {/* 追加: 本文にフォームを入れる */}
            <LearningForm
              records={records}
              setRecords={setRecords}
              time={time}
              setTime={setTime}
              remark={remark}
              setRemark={setRemark}
              onClickAdd={onClickAdd}
              hideSubmit // 追加: モーダルのフッターに登録ボタンを集約するため
            />
          </ModalBody>
          <ModalFooter gap={3}>
            {" "}
            {/* 追加: キャンセル/登録ボタン */}
            <Button
              variant="outline"
              onClick={() => {
                onClose();
                resetFormState();
              }} // 追加: キャンセルで閉じて初期化
            >
              キャンセル
            </Button>
            <Button
              colorScheme="leaf"
              isLoading={isLoading} // 追加: 既存ローディングと連動
              onClick={async () => {
                const ok = await addRecordCore(); // 追加: 共通処理
                if (ok) onClose(); // 追加: 成功時のみ閉じる
              }}
            >
              登録
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}
