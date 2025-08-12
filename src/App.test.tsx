import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("./supabaseFunction", () => ({
  getAllHistory: jest
    .fn()
    .mockResolvedValue([{ id: "1", title: "勉強A", time: "2", remark: "" }]),
  addHistory: jest
    .fn()
    .mockResolvedValue({ id: "2", title: "勉強B", time: "1.5", remark: "" }),
  deleteHistory: jest.fn().mockResolvedValue(true),
}));

test("ロード表示が出てから消え、履歴が表示される", async () => {
  render(<App />);

  expect(
    await screen.findByText(/学習内容:\s*勉強A\s*学習時間:\s*2\s*時間/i)
  ).toBeInTheDocument();
});
