import React from "react";
export const LearningDetails = (props) => {
  const {
    records,
    time,
    remark,
    error,
    totalStudyTime,
    currentGoal,
    baseGoal,
  } = props;
  return (
    <div>
      <div>
        <p>入力されている学習内容: {records}</p>
        <p>入力されている時間: {time} 時間</p>
        <p>備考：{remark}</p>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <p>
          合計学習時間：{totalStudyTime} / {currentGoal} 時間
        </p>
        {totalStudyTime >= baseGoal && (
          <p>
            <span style={{ color: "green", marginLeft: 10 }}>
              よし！次の目標は {currentGoal} 時間だ🔥 (定量目標)
            </span>
          </p>
        )}
      </div>
    </div>
  );
};
