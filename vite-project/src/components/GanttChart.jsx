import { getISOWeek } from "../utils/dateUtils";

const WEEK_WIDTH = 32;
const TOTAL_WEEKS = 52;
const ROW_HEIGHT = 32;
const NAME_COL_WIDTH = 180;
const HEADER_HEIGHT = 28;

const rowStyle = {
  height: ROW_HEIGHT,
  boxSizing: "border-box",
  borderBottom: "1px solid #eee",
};

export default function GanttChart({ tasks }) {
  return (
    <div style={{ marginTop: "24px" }}>
      <h4>Gantt Chart (Weeks 1–52)</h4>

      <div style={{ display: "flex", border: "1px solid #ddd" }}>
        {/* ---------- Task Names (Fixed) ---------- */}
        <div style={{ width: NAME_COL_WIDTH, background: "#fafafa" }}>
          {/* Header */}
          <div
            style={{
              height: HEADER_HEIGHT,
              boxSizing: "border-box",
              padding: "6px",
              fontSize: "11px",
              fontWeight: "bold",
              borderBottom: "1px solid #ddd",
            }}
          >
            Task
          </div>

          {tasks.map((task) => (
            <div
              key={task._id}
              style={{
                ...rowStyle,
                padding: "6px",
                fontSize: "12px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={task.name}
            >
              {task.name}
            </div>
          ))}
        </div>

        {/* ---------- Single Scroll Area ---------- */}
        <div style={{ overflowX: "auto" }}>
          <div style={{ width: WEEK_WIDTH * TOTAL_WEEKS }}>
            {/* ---------- Week Header ---------- */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${TOTAL_WEEKS}, ${WEEK_WIDTH}px)`,
                height: HEADER_HEIGHT,
                boxSizing: "border-box",
                borderBottom: "1px solid #ddd",
                background: "#fafafa",
              }}
            >
              {Array.from({ length: TOTAL_WEEKS }, (_, i) => (
                <div
                  key={i}
                  style={{
                    borderRight: "1px solid #e0e0e0",
                    fontSize: "10px",
                    textAlign: "center",
                    lineHeight: `${HEADER_HEIGHT}px`,
                    boxSizing: "border-box",
                    color: "#555",
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>

            {/* ---------- Task Rows ---------- */}
            {tasks.map((task) => {
              const startWeek = task.startDate
                ? getISOWeek(task.startDate)
                : null;
              const endWeek = task.endDate
                ? getISOWeek(task.endDate)
                : null;

              return (
                <div
                  key={task._id}
                  style={{
                    ...rowStyle,
                    position: "relative",
                    display: "grid",
                    gridTemplateColumns: `repeat(${TOTAL_WEEKS}, ${WEEK_WIDTH}px)`,
                  }}
                >
                  {/* Grid cells */}
                  {Array.from({ length: TOTAL_WEEKS }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        borderRight: "1px solid #f0f0f0",
                        boxSizing: "border-box",
                      }}
                    />
                  ))}

                  {/* Task bar */}
                  {startWeek && endWeek && (
                    <div
                      style={{
                        position: "absolute",
                        left: (startWeek - 1) * WEEK_WIDTH,
                        width: (endWeek - startWeek + 1) * WEEK_WIDTH,
                        height: "18px",
                        top: "7px",
                        background: "#1976d2",
                        borderRadius: "4px",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
