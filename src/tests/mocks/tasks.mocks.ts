import { subtractDays } from "../../date.utils";
import { Task } from "../../scheduleTasks";

export const todayForTest = new Date("2020-01-01");
/**
  ┌──────────────────┐
  │ Prev project     ├─┐
  │ id:0, Bob        │ │
  └──────────────────┘ │Implicitly by dev
                       │
                     ┌─▼────────────┐
                     │ Make UI      ├────────────┐
                     │ id:1, Bob    │            │
                     └──────────────┘            │
                                                 │
  ┌────────────────────┐                         │
  │ Make algorithm     │                         │
  │ id:2, Alice        ├───────────────────────┐ │
  └────────────────────┘                       │ │
                                           ┌───▼─▼────────────────────────┐
                                           │ Complete: combine UI and alg │
                                           │ id: 3, Alice                 │
                                           └──────────────────────────────┘
 */
export const tasks: Array<Task> = [
  {
    id: "0",
    position: 0,
    title: "Prev project",
    start: todayForTest,
    end: todayForTest,
    duration: 2,
    progress: 0,
    resourceId: "Bob",
  },
  {
    id: "1",
    position: 1,
    title: "Make UI",
    start: todayForTest,
    end: todayForTest,
    duration: 2,
    progress: 0,
    resourceId: "Bob",
  },
  {
    id: "2",
    position: 2,
    title: "Make algorithm",
    start: todayForTest,
    end: todayForTest,
    duration: 3,
    progress: 0,
    resourceId: "Alice",
  },
  {
    id: "3",
    position: 3,
    title: "Complete: combine UI and algorithm",
    start: todayForTest,
    end: todayForTest,
    duration: 2,
    progress: 0,
    resourceId: "Alice",
    blockedBy: ["1", "2"],
  },
];

export const correctlyScheduledTasks: Array<Task> = [
  {
    id: "0",
    position: 0,
    title: "Prev project",
    start: todayForTest,
    end: new Date("2020-01-02"),
    duration: 2,
    progress: 0,
    resourceId: "Bob",
  },
  {
    id: "1",
    position: 1,
    title: "Make UI",
    start: new Date("2020-01-03"),
    end: new Date("2020-01-06"),
    duration: 2,
    progress: 0,
    resourceId: "Bob",
  },
  {
    id: "2",
    position: 2,
    title: "Make algorithm",
    start: todayForTest,
    end: new Date("2020-01-03"),
    duration: 3,
    progress: 0,
    resourceId: "Alice",
  },
  {
    id: "3",
    position: 3,
    title: "Complete: combine UI and algorithm",
    start: new Date("2020-01-07"),
    end: new Date("2020-01-08"),
    duration: 2,
    progress: 0,
    resourceId: "Alice",
    blockedBy: ["1", "2"],
  },
];

export const tasksWithProgresses: Array<Task> = [
  {
    id: "0",
    title: "Make scheduling algorithm",
    start: todayForTest,
    end: todayForTest,
    duration: 4,
    position: 0,
    progress: 0.5,
    resourceId: "Alice",
  },
  {
    id: "1",
    title: "Write tests for algorithms",
    start: todayForTest,
    end: todayForTest,
    duration: 2,
    position: 1,
    progress: 0.5,
    resourceId: "Bob",
    blockedBy: ["0"],
  },
];

export const correctlyScheduledTasksWithProgresses: Array<Task> = [
  {
    id: "0",
    title: "Make scheduling algorithm",
    start: subtractDays(todayForTest, 2),
    end: new Date("2020-01-02"),
    duration: 4,
    position: 0,
    progress: 0.5,
    resourceId: "Alice",
  },
  {
    id: "1",
    title: "Write tests for algorithms",
    start: new Date("2020-01-02"),
    end: new Date("2020-01-03"),
    duration: 2,
    position: 1,
    progress: 0.5,
    resourceId: "Bob",
    blockedBy: ["0"],
  },
];

export const tasksSingleResource: Array<Task> = [
  {
    id: "0",
    position: 0,
    title: "Prev project",
    start: todayForTest,
    end: todayForTest,
    duration: 1,
    progress: 0,
    resourceId: "Bob",
  },
  {
    id: "1",
    position: 1,
    title: "Make UI",
    start: todayForTest,
    end: todayForTest,
    duration: 1,
    progress: 0,
    resourceId: "Bob",
  },
  {
    id: "2",
    position: 2,
    title: "Make algorithm",
    start: todayForTest,
    end: todayForTest,
    duration: 1,
    progress: 0,
    resourceId: "Bob",
  },
  {
    id: "3",
    position: 3,
    title: "Complete: combine UI and algorithm",
    start: todayForTest,
    end: todayForTest,
    duration: 1,
    progress: 0,
    resourceId: "Bob",
    blockedBy: ["1", "2"],
  },
];
