export type LearningFormProps = {
  records: string;
  setRecords: (value: string) => void;
  time: number;
  setTime: (value: number) => void;
  remark: string;
  setRemark: (value: string) => void;
  onClickAdd: React.MouseEventHandler<HTMLButtonElement>;
};

export const LearningForm = ({
  records,
  setRecords,
  time,
  setTime,
  remark,
  setRemark,
  onClickAdd,
}: LearningFormProps) => {
  return (
    <form>
      <h1 data-testid="title">学習時間記録</h1>
      <div>
        <label>
          学習内容
          <input
            type="text"
            value={records}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setRecords(e.target.value)
            }
            placeholder="学習内容"
            style={{ fontSize: "16px" }}
          />
        </label>
      </div>
      <div>
        <label>
          学習時間
          <input
            type="number"
            value={Number.isNaN(time) ? "" : time} // NaN のときだけ空文字にして placeholder 表示
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              setTime(value === "" ? NaN : parseFloat(value)); // 空欄なら NaN、数字なら数値に
            }}
            min="0"
            step="1"
            placeholder="半角数字で入力"
            style={{ fontSize: "16px" }}
          />
        </label>
      </div>
      <div>
        <label>
          備考
          <input
            type="text"
            value={remark}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setRemark(e.target.value)
            }
            placeholder="備考メモ"
            style={{ fontSize: "16px" }}
          />
        </label>
      </div>
      <button
        onClick={onClickAdd}
        style={{
          color: "#333",
          border: "none",
          borderRadius: "0.3em",
          padding: "0.2em 0.6em",
          cursor: "pointer",
        }}
      >
        登録
      </button>
    </form>
  );
};
