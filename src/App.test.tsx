import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import App from "./App";
import { Record as LearningRecord } from "./domain/record";

jest.mock("./supabaseFunction", () => ({
  // 学習履歴取得（配列）
  getAllHistory: jest.fn().mockResolvedValue([
    new LearningRecord("1", "勉強A", "2", "—"), // title=勉強A, time=2
  ]),
  // 学習履歴追加（1件）
  addHistory: jest
    .fn()
    .mockResolvedValue(new LearningRecord("2", "勉強B", "1.5", "")),
  // 削除
  deleteHistory: jest.fn().mockResolvedValue(true),
}));

test("ロード表示が出てから消え、履歴が表示される", async () => {
  render(<App />);

  // まずはローディングが見えることを確認
  expect(
    await screen.findByText(/学習内容:\s*勉強A\s*学習時間:\s*2\s*時間/i)
  ).toBeInTheDocument();

  // ローディングが消えるのを待つ（これで act 警告も解消）
  await waitForElementToBeRemoved(() => screen.getByText(/now loading/i));

  // 以降はポストロードのアサーション
  expect(await screen.findByText(/勉強A/)).toBeInTheDocument();
});
