import { getWeekNumber } from "../utils/dateUtils";
import "./GanttChart.css";

export default function GanttChart({ tasks }) {
  return (
    <div className="gantt-wrapper">
      <div className="gantt-scroll">
        {/* ---------- Header ---------- */}
        <div className="gantt-header">
          <div className="gantt-task-col">Task</div>
          {Array.from({ length: 52 }, (_, i) => (
            <div key={i} className="gantt-week">
              {i + 1}
            </div>
          ))}
        </div>

        {/* ---------- Rows ---------- */}
        {tasks.map((task) => {
          const startWeek = getWeekNumber(task.startDate);
          const endWeek = getWeekNumber(task.endDate);
          const span =
            startWeek && endWeek ? endWeek - startWeek + 1 : 0;

          return (
            <div key={task._id} className="gantt-row">
              <div className="gantt-task-name">{task.name}</div>

              <div className="gantt-grid">
                {startWeek && endWeek && (
                  <div
                    className="gantt-bar"
                    style={{
                      gridColumn: `${startWeek} / span ${span}`,
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
