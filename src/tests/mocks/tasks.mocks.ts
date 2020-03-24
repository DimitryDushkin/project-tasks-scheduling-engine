import { Task } from "../../scheduleTasks";
import { subDays, addDays } from "date-fns";

export const todayForTest = new Date("2020-01-01");
export const tasks: Task[] = [
  {
    id: "0",
    title: "Make scheduling algorithm",
    start: todayForTest,
    end: new Date("2020-01-02"),
    duration: 2,
    position: 0,
    progress: 0,
    resourceId: "Alice",
    dependencies: ["1"]
  },
  {
    id: "1",
    title: "Write tests for algorithms",
    start: todayForTest,
    end: new Date("2020-01-02"),
    duration: 2,
    position: 1,
    progress: 0,
    resourceId: "Bob"
  },
  {
    id: "2",
    title: "Research a lot of gantt plotting libs",
    start: todayForTest,
    end: new Date("2020-01-02"),
    duration: 2,
    position: 2,
    progress: 0,
    resourceId: "Bob",
    dependencies: ["3"]
  },
  {
    id: "3",
    title: "Write your own",
    start: todayForTest,
    end: new Date("2020-01-02"),
    duration: 2,
    position: 3,
    progress: 0,
    resourceId: "Alice"
  }
];

export const correctlyScheduledTasks: Task[] = [
  {
    id: "0",
    title: "Make scheduling algorithm",
    start: todayForTest,
    end: new Date("2020-01-02"),
    duration: 2,
    position: 0,
    progress: 0,
    resourceId: "Alice",
    dependencies: ["1"]
  },
  {
    id: "1",
    title: "Write tests for algorithms",
    start: new Date("2020-01-03"),
    end: new Date("2020-01-06"),
    duration: 2,
    position: 1,
    progress: 0,
    resourceId: "Bob"
  },
  {
    id: "2",
    title: "Research a lot of gantt plotting libs",
    start: new Date("2020-01-07"),
    end: new Date("2020-01-08"),
    duration: 2,
    position: 2,
    progress: 0,
    resourceId: "Bob",
    dependencies: ["3"]
  },
  {
    id: "3",
    title: "Write your own",
    start: new Date("2020-01-09"),
    end: new Date("2020-01-10"),
    duration: 2,
    position: 3,
    progress: 0,
    resourceId: "Alice"
  }
];

export const tasksWithProgresses: Task[] = [
  {
    id: "0",
    title: "Make scheduling algorithm",
    start: todayForTest,
    end: new Date("2020-01-04"),
    duration: 4,
    position: 0,
    progress: 0.5,
    resourceId: "Alice",
    dependencies: ["1"]
  },
  {
    id: "1",
    title: "Write tests for algorithms",
    start: todayForTest,
    end: new Date("2020-01-02"),
    duration: 2,
    position: 1,
    progress: 0.5,
    resourceId: "Bob"
  }
];

export const correctlyScheduledTasksWithProgresses: Task[] = [
  {
    id: "0",
    title: "Make scheduling algorithm",
    start: subDays(todayForTest, 2),
    end: new Date("2020-01-02"),
    duration: 4,
    position: 0,
    progress: 0.5,
    resourceId: "Alice",
    dependencies: ["1"]
  },
  {
    id: "1",
    title: "Write tests for algorithms",
    start: addDays(todayForTest, 1),
    end: new Date("2020-01-03"),
    duration: 2,
    position: 1,
    progress: 0.5,
    resourceId: "Bob"
  }
];
