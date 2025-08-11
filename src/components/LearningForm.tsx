import { type ChangeEvent } from "react";
import {
  Box,
  Heading,
  Stack,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Button,
} from "@chakra-ui/react";

export type LearningFormProps = {
  records: string;
  setRecords: (value: string) => void;
  time: number;
  setTime: (value: number) => void;
  remark: string;
  setRemark: (value: string) => void;
  onClickAdd: React.MouseEventHandler<HTMLButtonElement>;
  hideSubmit?: boolean; // 追加: モーダル側にボタンを出すためのフラグ
};

export const LearningForm = ({
  records,
  setRecords,
  time,
  setTime,
  remark,
  setRemark,
  onClickAdd,
  hideSubmit, // 追加
}: LearningFormProps) => {
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
        学習時間記録
      </Heading>
      <Stack spacing={5}>
        <FormControl>
          <FormLabel>学習内容</FormLabel>
          <Input
            value={records}
            placeholder="学習内容"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setRecords(e.target.value)
            }
          />
        </FormControl>

        <FormControl>
          <FormLabel>学習時間（時間）</FormLabel>
          <NumberInput
            min={0}
            clampValueOnBlur={false}
            value={Number.isNaN(time) ? "" : String(time)}
            onChange={(valueString, valueNumber) => {
              setTime(valueString === "" ? NaN : valueNumber);
            }}
          >
            <NumberInputField placeholder="半角数字で入力" />
          </NumberInput>
        </FormControl>

        <FormControl>
          <FormLabel>備考</FormLabel>
          <Input
            value={remark}
            placeholder="備考メモ"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setRemark(e.target.value)
            }
          />
        </FormControl>

        {!hideSubmit && ( // 追加: 単体表示時のみボタンを出す（モーダルでは非表示）
          <Button onClick={onClickAdd} alignSelf="flex-start">
            登録
          </Button>
        )}
      </Stack>
    </Box>
  );
};
