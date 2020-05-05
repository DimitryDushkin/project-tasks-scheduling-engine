import { max, subBusinessDays, addBusinessDays, isEqual } from "date-fns";
import { makeGraphFromTasks, makeReverseGraph, dfs } from "./graph.utils";
import { shiftToFirstNextBusinessDay } from "./date.utils";

type ID = string;

export type Task = {
  id: ID;
  title: string;
  start: Date;
  end: Date;
  duration: number;
  position: number;
  progress: number;
  resourceId: ID;
  dependencies?: ID[];
};

export const scheduleTasks = (tasks: Task[], today?: Date) => {
  const graph = makeGraphFromTasks(tasks);
  const tasksById = tasks.reduce((map, task) => {
    map[task.id] = task;
    return map;
  }, {} as { [id: string]: Task });

  // @TODO: 0. Detect cycles, if present throw error

  // 1. Make reverse graph, to detect sinks and sources
  const reverseGraph = makeReverseGraph(graph);

  // 2. If node is source, t.start = max(today, t.start)
  // Repeat until dates remains unchanged, max graph.size times.
  // Similar to optimization in Bellman-Ford algorithm
  // @see https://en.wikipedia.org/wiki/Bellman–Ford_algorithm#Improvements
  for (let i = 0; i <= graph.size; i++) {
    let datesChanged = false;

    for (const [id] of dfs(graph)) {
      const t = tasksById[id];

      const isSource = reverseGraph.get(id)?.size === 0;
      const isSink = graph.get(id)?.size === 0;
      const isDisconnected = isSource && isSink;

      if (isSource || isDisconnected) {
        datesChanged = updateStartDate(t, today ?? new Date());
      } else {
        const prerequesionsEndDates = Array.from(
          reverseGraph.get(id) ?? []
        ).map((id) => tasksById[id].end);
        datesChanged = updateStartDate(
          t,
          addBusinessDays(max(prerequesionsEndDates), 1)
        );
      }
    }

    if (datesChanged === false) {
      break;
    }
  }

  return tasks;
};

/**
 * Update task dates, according to startDate change
 * @returns false if date didn't change, true if it changed
 */
export const updateStartDate = (task: Task, startDate: Date) => {
  const correctedStartDate = shiftToFirstNextBusinessDay(startDate);
  const daysSpent = Math.floor(task.duration * task.progress);
  const newStartDate = subBusinessDays(correctedStartDate, daysSpent);

  if (isEqual(task.start, newStartDate)) {
    return false;
  }

  task.start = subBusinessDays(correctedStartDate, daysSpent);
  // -1 because every task is minimum 1 day long,
  // say it starts and ends on same date, so it has 1 day duration
  task.end = addBusinessDays(task.start, task.duration - 1);

  return true;
};
