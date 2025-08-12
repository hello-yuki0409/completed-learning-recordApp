import {
  Box,
  Heading,
  List,
  ListItem,
  HStack,
  Text,
  Button,
} from "@chakra-ui/react";
import React from "react";
import type { Record as LearningRecord } from "../domain/record";

// props をクラス前提に
export type HistoryListProps = {
  history: LearningRecord[]; // ドメインクラス配列
  onClickDelete: (id: string) => void | Promise<void>; // App側のasyncに対応
};

export const HistoryList: React.FC<HistoryListProps> = ({
  history,
  onClickDelete,
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
      <List spacing={3}>
        {history.map((record) => (
          <ListItem key={record.id}>
            <HStack justify="space-between" align="center">
              <Text fontSize="sm">
                {/* records -> title / timeはstring / remarkは空文字の可能性 */}
                学習内容: {record.title}　学習時間: {record.time} 時間　備考:{" "}
                {record.remark || "—"}
              </Text>
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
    </Box>
  );
};
