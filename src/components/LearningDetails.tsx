import { Box, Heading, Text, Stack, Badge } from "@chakra-ui/react";

export type LearningDetailsProps = {
  records: string;
  time: number;
  remark?: string;
  totalStudyTime: number;
  currentGoal: number;
  baseGoal: number;
};

export const LearningDetails = ({
  records,
  time,
  remark,
  totalStudyTime,
  currentGoal,
  baseGoal,
}: LearningDetailsProps) => {
  // 表示用に整形（NaNは未入力として扱う）
  const displayTime = Number.isNaN(time) ? "" : String(time);

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
        入力内容プレビュー
      </Heading>
      <Stack spacing={2} fontSize="sm">
        <Text>入力されている学習内容：{records || "—"}</Text>
        <Text>
          入力されている時間：{displayTime ? `${displayTime} 時間` : "—"}
        </Text>
        <Text>備考：{remark ?? "—"}</Text>

        <Text mt={2}>
          合計学習時間：
          <Badge colorScheme="leaf" px={2} py={1} rounded="md">
            {totalStudyTime}
          </Badge>
          / {currentGoal} 時間
        </Text>

        {totalStudyTime >= baseGoal && (
          <Text color="leaf.700" mt={1}>
            よし！次の目標は {currentGoal} 時間だ🔥（定量目標）
          </Text>
        )}
      </Stack>
    </Box>
  );
};
