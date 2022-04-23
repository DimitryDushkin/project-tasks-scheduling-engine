import { makeGraphFromTasks } from "../graph.utils";
import { scheduleTasks } from "../scheduleTasks";
import { longSpreadedTasksMock } from "./mocks/longSpreadedtasks.mocks";
import {
  tasks,
  correctlyScheduledTasks,
  todayForTest,
  tasksWithProgresses,
  correctlyScheduledTasksWithProgresses,
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

  it("should correctly schedule tasks with long spreaded links between them", () => {
    const scheduledTasks = scheduleTasks(longSpreadedTasksMock, todayForTest);
    const startTimes = new Set();

    for (const task of scheduledTasks) {
      if (startTimes.has(task.start.toISOString())) {
        expect(true).toEqual(false);
        throw new Error("time repeated!");
      }
      startTimes.add(task.start.toISOString());
    }
  });
});
