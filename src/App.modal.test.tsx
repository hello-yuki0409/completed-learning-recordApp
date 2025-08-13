import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

// Supabase呼び出しはすべてモック（通信しない）
jest.mock("./supabaseFunction", () => ({
  getAllHistory: jest.fn().mockResolvedValue([]),
  addHistory: jest.fn().mockResolvedValue({
    id: "10",
    title: "React",
    time: "1",
    remark: "",
  }),
  deleteHistory: jest.fn().mockResolvedValue(true),
}));

const { addHistory } = jest.requireMock("./supabaseFunction");

describe("モーダルのバリデーション（react-hook-form）", () => {
  test("未入力のまま登録 → フィールド下にエラーが出る", async () => {
    render(<App />);

    // 1) モーダルを開く
    await userEvent.click(screen.getByRole("button", { name: "新規登録" }));

    // 2) 何も入力せず「登録」を押す
    await userEvent.click(screen.getByRole("button", { name: "登録" }));

    // 3) エラーメッセージがモーダル内の各フィールド直下に出る
    expect(await screen.findByText("内容の入力は必須です")).toBeInTheDocument();
    expect(await screen.findByText("時間の入力は必須です")).toBeInTheDocument();

    // 4) 失敗なので API は呼ばれない
    expect(addHistory).not.toHaveBeenCalled();
  });

  test("時間が負の値 → 「時間は0以上である必要があります」が出る", async () => {
    render(<App />);

    // 1) モーダルを開く
    await userEvent.click(screen.getByRole("button", { name: "新規登録" }));

    // 2) 学習内容だけ入れる
    await userEvent.type(screen.getByPlaceholderText("学習内容"), "TypeScript");

    // 3) 時間に負の値を入れる
    const timeField = screen.getByPlaceholderText("半角数字で入力");
    await userEvent.clear(timeField);
    await userEvent.type(timeField, "-1");

    // 4) 登録
    await userEvent.click(screen.getByRole("button", { name: "登録" }));

    // 5) エラーメッセージ表示
    expect(
      await screen.findByText("時間は0以上である必要があります")
    ).toBeInTheDocument();

    // 6) 失敗なので API は呼ばれない
    expect(addHistory).not.toHaveBeenCalled();
  });

  test("正しい入力なら登録が走る（小数もOK）", async () => {
    render(<App />);

    // 1) モーダルを開く
    await userEvent.click(screen.getByRole("button", { name: "新規登録" }));

    // 2) 正しい入力（学習内容 + 時間1.5）
    await userEvent.type(screen.getByPlaceholderText("学習内容"), "React");
    const timeField = screen.getByPlaceholderText("半角数字で入力");
    await userEvent.clear(timeField);
    await userEvent.type(timeField, "1.5");

    // 3) 登録
    await userEvent.click(screen.getByRole("button", { name: "登録" }));

    // 4) API が呼ばれる（数値で渡っていることも確認）
    expect(addHistory).toHaveBeenCalledWith("React", 1.5, "");
  });
});
