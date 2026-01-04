import { getISOWeek } from "../utils/dateUtils";
import "./GanttChart.css";

export default function GanttChart({ tasks }) {
  return (
    <div className="gantt-container">
      <h4>Gantt Chart (Weeks 1–52)</h4>

      <div className="gantt-header">
        {/* Task Names */}
        <div className="gantt-task-names">
          <div className="header">Task</div>
          {tasks.map((task) => (
            <div key={task._id} className="task-row" title={task.name}>
              {task.name}
            </div>
          ))}
        </div>

        {/* Scrollable Grid */}
        <div className="gantt-grid-scroll">
          <div style={{ width: 32 * 52 }}>
            {/* Week Header */}
            <div className="gantt-grid-header">
              {Array.from({ length: 52 }, (_, i) => (
                <div key={i} className="gantt-week">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Task Rows */}
            {tasks.map((task) => {
              const startWeek = task.startDate ? getISOWeek(task.startDate) : null;
              const endWeek = task.endDate ? getISOWeek(task.endDate) : null;

              return (
                <div key={task._id} className="gantt-grid-row">
                  {Array.from({ length: 52 }).map((_, i) => (
                    <div key={i} className="gantt-grid-cell" />
                  ))}

                  {startWeek && endWeek && (
                    <div
                      className="gantt-task-bar"
                      style={{
                        left: (startWeek - 1) * 32,
                        width: (endWeek - startWeek + 1) * 32,
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
