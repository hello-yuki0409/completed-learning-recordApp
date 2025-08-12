import {
  Container,
  SimpleGrid,
  Stack,
  Center,
  Spinner,
  Text,
  Button, // 新規登録ボタン
  useDisclosure, // モーダル開閉制御
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter, // モーダルUI
} from "@chakra-ui/react";

import { useState, useEffect } from "react";
import {
  LearningForm,
  type LearningFormValues,
} from "./components/LearningForm";
import { HistoryList } from "./components/HistoryList";
import { LearningDetails } from "./components/LearningDetails";
import { getAllHistory, addHistory, deleteHistory } from "./supabaseFunction";
import { useToast } from "@chakra-ui/react";
import { Record as LearningRecord } from "./domain/record";

export default function App() {
  const [records, setRecords] = useState<string>("");
  const [time, setTime] = useState<number>(NaN);
  const [remark, setRemark] = useState<string>("");

  const [historyRecords, setHistoryRecordss] = useState<LearningRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); //データ読み込み中かどうか

  const { isOpen, onOpen, onClose } = useDisclosure(); // モーダル制御

  const toast = useToast();

  // 入力ステートを初期化する関数（再オープン時に残さないため）
  const resetFormState = () => {
    // フォーム初期化
    setRecords("");
    setTime(NaN); //  未入力表現としてNaNに戻す
    setRemark("");
  };

  const fetchTodos = async () => {
    setIsLoading(true); // 読み込み開始時
    // getAllHistory の戻り値が型定義されていない場合に備えて as で明示
    const items = await getAllHistory();
    setHistoryRecordss(items);
    setIsLoading(false); // 読み込み完了で Loading 消す
  };

  // useEffectの外でも fetchTodos を使えるようにする
  useEffect(() => {
    fetchTodos();
  }, []);

  const addRecordCore = async (
    values: LearningFormValues
  ): Promise<boolean> => {
    const { records, time, remark } = values;
    setIsLoading(true);
    const result = await addHistory(records, time, remark);
    if (result !== undefined) {
      await fetchTodos();
      resetFormState();
      setIsLoading(false);
      return true;
    } else {
      toast({
        status: "error",
        title: "登録に失敗しました",
        description: "しばらくしてから再度お試しください。",
      }); // APIエラーはトースト通知
      setIsLoading(false);
      return false;
    }
  };

  // 登録後の削除処理を追加
  const handleDelete = async (id: string) => {
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

  const FORM_ID = "learning-form";

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
      {/* ページ上部に「新規登録」ボタン。クリックでモーダルを開き、毎回初期化 */}
      <Stack direction="row" justify="flex-end" mb={4}>
        {/* 右上配置 */}
        <Button
          colorScheme="leaf" // テーマに合わせる
          onClick={() => {
            resetFormState();
            onOpen();
          }} // 開くたびに初期化
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
          totalStudyTime={totalStudyTime}
          currentGoal={currentGoal}
          baseGoal={baseGoal}
        />
        <HistoryList history={historyRecords} onClickDelete={handleDelete} />
      </SimpleGrid>

      {/* 登録モーダル本体 */}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          resetFormState();
        }}
      >
        {/* 閉じるときも初期化 */}
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>新規登録</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* RHF版のフォーム（成功時に登録 -> 成功なら閉じる） */}
            <LearningForm
              formId={FORM_ID}
              onValidSubmit={async (values) => {
                // RHFの値を親で登録処理に渡す
                const ok = await addRecordCore(values);
                if (ok) onClose();
              }}
            />
          </ModalBody>
          <ModalFooter gap={3}>
            <Button
              variant="outline"
              onClick={() => {
                onClose();
                resetFormState();
              }}
            >
              キャンセル
            </Button>
            {/* フッターからフォームsubmitを発火 */}
            <Button
              colorScheme="leaf"
              form={FORM_ID}
              type="submit"
              isLoading={isLoading}
            >
              登録
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}
