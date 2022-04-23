import { todayForTest } from "./tasks.mocks";

export const longSpreadedTasksMock = [
  {
    id: "3",
    title: "Final task",
    start: todayForTest,
    end: todayForTest,
    duration: 1,
    position: 6,
    progress: 0,
    resourceId: "Alice",
    blockedBy: ["1", "2"],
  },
  {
    id: "1",
    title: "task 1",
    start: todayForTest,
    end: todayForTest,
    duration: 1,
    position: 0,
    progress: 0,
    resourceId: "Alice",
    blockedBy: [],
  },
  {
    id: "2",
    title: "task 2",
    start: todayForTest,
    end: todayForTest,
    duration: 1,
    position: 7,
    progress: 0,
    resourceId: "Alice",
    blockedBy: [],
  },
];
