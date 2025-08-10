// src/App.test.tsx
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import App from "./App";

// supabaseClient は setupTests.ts でグローバル mock 済み
// こちらはデータ取得関数をモック
jest.mock("./supabaseFunction", () => ({
  getAllHistory: jest
    .fn()
    .mockResolvedValue([{ id: 1, records: "勉強A", time: 60, remark: null }]),
  addHistory: jest.fn(),
  deleteHistory: jest.fn(),
}));

test("ロード表示が出てから消え、履歴が表示される", async () => {
  render(<App />);

  // まずはローディングが見えることを確認
  expect(screen.getByText(/now loading/i)).toBeInTheDocument();

  // ローディングが消えるのを待つ（これで act 警告も解消）
  await waitForElementToBeRemoved(() => screen.getByText(/now loading/i));

  // 以降はポストロードのアサーション
  await waitFor(() => {
    expect(screen.getByText(/勉強A/)).toBeInTheDocument();
  });
});
