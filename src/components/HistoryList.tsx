import React from "react";

export type HistoryRecord = {
  id: string | number;
  records: string;
  time: number;
  remark?: string;
};

export type HistoryListProps = {
  history: HistoryRecord[];
  onClickDelete: (id: HistoryRecord["id"]) => void;
};

export const HistoryList: React.FC<HistoryListProps> = ({
  history,
  onClickDelete,
}) => {
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
