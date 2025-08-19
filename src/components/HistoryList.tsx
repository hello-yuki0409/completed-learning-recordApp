import {
  Box,
  Heading,
  List,
  ListItem,
  HStack,
  Text,
  Button,
  Badge,
  Divider,
} from "@chakra-ui/react";
import React from "react";
import type { Record as LearningRecord } from "../domain/record";

// props をクラス前提に
export type HistoryListProps = {
  history: LearningRecord[]; // ドメインクラス配列
  onClickDelete: (id: string) => void | Promise<void>;
  onClickEdit: (rec: LearningRecord) => void;
  totalStudyTime: number; // 合計学習時間
  currentGoal: number; // 現在の目標
  baseGoal: number; // 基準目標（1000）
};

export const HistoryList: React.FC<HistoryListProps> = ({
  history,
  onClickDelete,
  onClickEdit,
  totalStudyTime,
  currentGoal,
  baseGoal,
}) => {
  return (
    <Box
      bg="white"
      p={6}
      rounded="2xl"
      boxShadow="sm"
      border="1px"
      borderColor="blackAlpha.100"
    >
      <Heading size="md" mb={4} color="leaf.700">
        登録履歴
      </Heading>
      {/* 履歴が空のときの文言を表示 */}
      {history.length === 0 ? (
        <Text color="gray.500" fontSize="sm" data-testid="empty-message">
          履歴がありません
        </Text>
      ) : (
        <List spacing={3}>
          {history.map((record) => (
            <ListItem key={record.id}>
              <HStack justify="space-between" align="center">
                <Text fontSize="sm">
                  {/* records -> title / timeはstring / remarkは空文字の可能性 */}
                  学習内容: {record.title}　学習時間: {record.time} 時間　備考:
                  {record.remark || "—"}
                </Text>
                <Button
                  variant="outline"
                  colorScheme="leaf"
                  size="sm"
                  onClick={() => onClickEdit(record)} // 押したレコードを渡す
                >
                  編集
                </Button>
                <Button
                  variant="outline"
                  colorScheme="red"
                  size="sm"
                  onClick={() => onClickDelete(record.id)} // idはstring
                >
                  削除
                </Button>
              </HStack>
            </ListItem>
          ))}
        </List>
      )}
      {/* カード下部に合計学習時間の表示を移設 */}
      <Divider my={4} /> {/* 区切り線 */}
      <Text>
        合計学習時間：
        <Badge colorScheme="leaf" px={2} py={1} rounded="md">
          {totalStudyTime}
        </Badge>
        / {currentGoal} 時間
      </Text>
      {totalStudyTime >= baseGoal && (
        <Text color="leaf.700" mt={1}>
          よし！次の目標は {currentGoal} 時間だ🔥
        </Text>
      )}
    </Box>
  );
};
