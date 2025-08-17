import {
  Box,
  Heading,
  Stack,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  FormErrorMessage, //（エラー表示）
} from "@chakra-ui/react";

import { useForm, Controller } from "react-hook-form"; // （RHF）

// 送信値の型
export type LearningFormValues = {
  records: string;
  time: number;
  remark: string;
};

// RHF版のprops（親は成功時の処理だけを受け取る）
export type LearningFormProps = {
  formId: string; // モーダルフッターのsubmitボタンと紐づけ
  onValidSubmit: (values: LearningFormValues) => void | Promise<void>;
};

// RHF版コンポーネント
export const LearningForm = ({ formId, onValidSubmit }: LearningFormProps) => {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    reset,
  } = useForm<LearningFormValues>({
    mode: "onBlur", // フォーカスアウトで検証
    defaultValues: {
      records: "",
      time: undefined as unknown as number,
      remark: "",
    },
  });

  const onSubmit = async (values: LearningFormValues) => {
    await onValidSubmit(values); // 成功時のみ親へ通知
    reset(); // 成功後は初期化（再オープン時に残らない）
  };

  return (
    <Box
      as="form"
      id={formId} // フッターのsubmitボタンから送信するため
      onSubmit={handleSubmit(onSubmit)}
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
        {/* 学習内容（必須） */}
        <FormControl isInvalid={!!errors.records} isRequired>
          <FormLabel>学習内容</FormLabel>
          <Input
            placeholder="学習内容"
            {...register("records", {
              required: "内容の入力は必須です",
              setValueAs: (v) => (typeof v === "string" ? v.trim() : v), // 空白のみ防止
              validate: (v) => v.length > 0 || "内容の入力は必須です", // 空文字弾く
            })}
          />
          <FormErrorMessage>{errors.records?.message}</FormErrorMessage>
        </FormControl>
        {/* 学習時間（必須・0以上） */}
        <FormControl isInvalid={!!errors.time} isRequired>
          <FormLabel>学習時間（時間）</FormLabel>
          <Controller
            control={control}
            name="time"
            rules={{
              required: "時間の入力は必須です",
              validate: (value) => {
                if (
                  value === undefined ||
                  value === null ||
                  Number.isNaN(value)
                ) {
                  return "時間の入力は必須です"; // NaN/未入力も弾く
                }
                if (value === 0) return "時間は0以上である必要があります";
                return true;
              },
            }}
            render={({ field: { value, onChange, onBlur } }) => (
              <NumberInput
                min={0}
                clampValueOnBlur={false}
                value={value ?? ""} // 未入力時は空文字で表示
                onChange={(valueString, valueNumber) => {
                  if (valueString === "")
                    onChange(undefined); // 未入力はundefined
                  else if (Number.isNaN(valueNumber)) onChange(NaN);
                  else onChange(valueNumber);
                }}
                onBlur={onBlur} // onBlur検証
              >
                <NumberInputField placeholder="半角数字で入力" />
              </NumberInput>
            )}
          />
          <FormErrorMessage>{errors.time?.message}</FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel>備考</FormLabel>
          <Input placeholder="備考メモ" {...register("remark")} />
        </FormControl>
      </Stack>
    </Box>
  );
};
