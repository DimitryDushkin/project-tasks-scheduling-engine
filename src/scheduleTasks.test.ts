import { scheduleTasks } from "./scheduleTasks";
import {
  tasks,
  correctlyScheduledTasks,
  todayForTest,
  tasksWithProgresses,
  correctlyScheduledTasksWithProgresses
} from "./mocks/tasks.mocks";

describe("scheduleTasks", () => {
  it("should re-schedule tasks with 0 progresses", () => {
    expect(scheduleTasks(tasks, todayForTest)).toEqual(correctlyScheduledTasks);
  });

  it("should correctly schedule tasks with 50 progress", () => {
    expect(scheduleTasks(tasksWithProgresses, todayForTest)).toEqual(
      correctlyScheduledTasksWithProgresses
    );
  });
});
