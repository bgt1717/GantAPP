import { getISOWeek } from "../utils/dateUtils";

export default function GanttChart({ tasks }) {
  const WEEK_WIDTH = 30;
  const TOTAL_WEEKS = 52;

  return (
    <div style={{ marginTop: "20px", overflowX: "auto" }}>
      <h4>Gantt Chart (Weeks 1–52)</h4>

      {/* ---------- Week Header ---------- */}
      <div style={{ display: "flex", marginBottom: "8px" }}>
        {Array.from({ length: TOTAL_WEEKS }, (_, i) => (
          <div
            key={i}
            style={{
              width: WEEK_WIDTH,
              fontSize: "10px",
              textAlign: "center",
              borderRight: "1px solid #ddd",
              color: "#555",
            }}
          >
            {i + 1}
          </div>
        ))}
      </div>

      {/* ---------- Task Rows ---------- */}
      {tasks.map((task) => {
        if (!task.startDate || !task.endDate) return null;

        const startWeek = getISOWeek(task.startDate);
        const endWeek = getISOWeek(task.endDate);

        return (
          <div key={task._id} style={{ marginBottom: "12px" }}>
            <div style={{ fontSize: "12px", marginBottom: "4px" }}>
              {task.name}
            </div>

            <div
              style={{
                position: "relative",
                height: "20px",
                width: WEEK_WIDTH * TOTAL_WEEKS,
                background: "#f5f5f5",
                borderRadius: "4px",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: (startWeek - 1) * WEEK_WIDTH,
                  width: (endWeek - startWeek + 1) * WEEK_WIDTH,
                  height: "100%",
                  background: "#1976d2",
                  borderRadius: "4px",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
