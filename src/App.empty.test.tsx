import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import App from "./App";

jest.mock("./supabaseFunction", () => ({
  getAllHistory: jest.fn().mockResolvedValue([]),
  addHistory: jest.fn(),
  deleteHistory: jest.fn(),
}));

test("履歴が空でも画面が表示される（空メッセージ）", async () => {
  render(<App />);
  await waitForElementToBeRemoved(() => screen.getByText(/now loading/i));

  expect(screen.getByText(/履歴がありません/)).toBeInTheDocument();

  // 少なくともクラッシュせず、合計が0で出る
  expect(
    screen.getByText((_, el) => el?.textContent === "0")
  ).toBeInTheDocument();
});
