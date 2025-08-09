import React from "react";
export const LearningForm = (props) => {
  const { records, setRecords, time, setTime, remark, setRemark, onClickAdd } =
    props;

  return (
    <form>
      <h1 data-testid="title">学習時間記録</h1>
      <div>
        <label>
          学習内容
          <input
            type="text"
            value={records}
            onChange={(e) => setRecords(e.target.value)}
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
            value={time}
            onChange={(e) => setTime(e.target.value)}
            min="0"
            step="0.1"
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
            onChange={(e) => setRemark(e.target.value)}
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
