import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import App from "./App";

jest.mock("./supabaseFunction", () => ({
  getAllHistory: jest.fn().mockResolvedValue([
    { id: "1", title: "勉強A", time: "2", remark: "" },
    { id: "2", title: "勉強B", time: "1.5", remark: "メモ" },
    { id: "3", title: "勉強C", time: "10", remark: "" },
  ]),
  addHistory: jest
    .fn()
    .mockResolvedValue({ id: "3", title: "勉強C", time: "1", remark: "" }),
  deleteHistory: jest.fn().mockResolvedValue(true),
}));

test("初期表示：ローディングが出て、取得完了で消え、履歴が表示される", async () => {
  render(<App />);

  // ローディング表示（同期）
  expect(screen.getByText(/now loading/i)).toBeInTheDocument();

  // ローディングが消えるまで待つ（非同期）
  await waitForElementToBeRemoved(() => screen.getByText(/now loading/i));

  // 勉強A/B が表示（非同期）
  expect(await screen.findByText(/勉強A/)).toBeInTheDocument();

  const rowB = await screen.findByText(/勉強B/);
  expect(rowB).toHaveTextContent(/学習時間:\s*1\.5\s*時間/);

  // 合計バッジ 13.5
  expect(
    screen.getByText((_, el) => el?.textContent === "13.5")
  ).toBeInTheDocument();
});
