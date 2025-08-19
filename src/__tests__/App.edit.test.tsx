import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

jest.mock("../supabaseFunction", () => ({
  getAllHistory: jest.fn().mockResolvedValue([
    { id: "1", title: "勉強A", time: "2", remark: "" },
    { id: "2", title: "勉強B", time: "1", remark: "メモ" },
  ]),
  // 編集で保存に成功したら、以下の1件が返ってくることにする
  updateHistory: jest.fn().mockResolvedValue({
    id: "2",
    title: "勉強B改",
    time: "3",
    remark: "更新",
  }),
  addHistory: jest.fn(), // 今回のテストでは使わないが、存在だけ用意
  deleteHistory: jest.fn(), // 同上
}));

test("編集 -> 保存で該当行のみ更新され、順序は維持される", async () => {
  const api = require("../supabaseFunction"); // mock の取り出し

  render(<App />);
  await waitForElementToBeRemoved(() => screen.getByText(/now loading/i));

  // 初期順序: 勉強A, 勉強B
  const before = await screen.findAllByText(/学習内容:/);
  expect(before[0].textContent).toMatch(/勉強A/);
  expect(before[1].textContent).toMatch(/勉強B/);

  // 2行目を編集
  const editButtons = screen.getAllByRole("button", { name: "編集" });
  await userEvent.click(editButtons[1]);

  const inputRecords = screen.getByPlaceholderText(
    "学習内容"
  ) as HTMLInputElement;
  const inputTime = screen.getByPlaceholderText(
    "半角数字で入力"
  ) as HTMLInputElement;
  const inputRemark = screen.getByPlaceholderText(
    "備考メモ"
  ) as HTMLInputElement;

  await userEvent.clear(inputRecords);
  await userEvent.type(inputRecords, "勉強B改");
  await userEvent.clear(inputTime);
  await userEvent.type(inputTime, "3");
  await userEvent.clear(inputRemark);
  await userEvent.type(inputRemark, "更新");

  await userEvent.click(screen.getByRole("button", { name: "保存" }));
  await waitForElementToBeRemoved(() => screen.queryByRole("dialog"));

  // 順序そのまま / 2行目だけ更新
  const after = await screen.findAllByText(/学習内容:/);
  expect(after[0].textContent).toMatch(/勉強A/);
  expect(after[1].textContent).toMatch(/勉強B改/);
  expect(after[1].textContent).toMatch(/学習時間:\s*3/);
  expect(after[1].textContent).toMatch(/備考:\s*更新/);

  // 再取得なし（初回のみ）/ updateHistory が正しく呼ばれる
  expect(api.getAllHistory).toHaveBeenCalledTimes(1);
  expect(api.updateHistory).toHaveBeenCalledTimes(1);
  expect(api.updateHistory).toHaveBeenCalledWith("2", "勉強B改", 3, "更新");
});
