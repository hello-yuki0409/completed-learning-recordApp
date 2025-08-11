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

export type HistoryRecord = {
  id: string | number;
  records: string;
  time: number;
  remark?: string;
};

export type HistoryListProps = {
  history: HistoryRecord[];
  onClickDelete: (id: HistoryRecord["id"]) => void;
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
                学習内容: {record.records}　学習時間: {record.time} 時間　備考:{" "}
                {record.remark ?? "—"}
              </Text>
              <Button
                variant="outline"
                colorScheme="red"
                size="sm"
                onClick={() => onClickDelete(record.id)}
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
