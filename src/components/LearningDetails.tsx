export type LearningDetailsProps = {
  records: string;
  time: number;
  remark?: string;
  error?: string;
  totalStudyTime: number;
  currentGoal: number;
  baseGoal: number;
};

export const LearningDetails = ({
  records,
  time,
  remark,
  error,
  totalStudyTime,
  currentGoal,
  baseGoal,
}: LearningDetailsProps) => {
  // 表示用に整形（NaNは未入力として扱う）
  const displayTime = Number.isNaN(time) ? "" : String(time);
  const displayRemark = remark ?? "";

  return (
    <div>
      <div>
        <p>入力されている学習内容: {records || ""}</p>
        <p>入力されている時間: {displayTime ? `${displayTime} 時間` : ""}</p>
        <p>備考：{displayRemark}</p>

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
