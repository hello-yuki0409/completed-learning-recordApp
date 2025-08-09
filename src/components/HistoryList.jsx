import React from "react";
export const HistoryList = ({ history, onClickDelete }) => {
  return (
    <div>
      <h2>登録履歴</h2>
      <ul>
        {history.map((record) => (
          <li
            key={record.id}
            data-testid="history-item"
            style={{ marginBottom: "0.5em" }}
          >
            学習内容: {record.records}
            学習時間: {record.time} 時間 備考： {record.remark}
            <button
              onClick={() => onClickDelete(record.id)}
              style={{
                marginLeft: "1em",
                color: "#333",
                border: "none",
                borderRadius: "0.3em",
                padding: "0.2em 0.6em",
                cursor: "pointer",
              }}
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
