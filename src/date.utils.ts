import {
  isEqual,
  isSaturday as fnsIsSaturDay,
  isSunday as fnsIsSunday,
  max,
  subBusinessDays as fnsSubBusinessDays,
  addBusinessDays as fnsAddBusinessDays,
  subDays,
  addDays as fnsAddDays,
} from "date-fns";
import { Task } from "./scheduleTasks";

export const addBusinessDays = fnsAddBusinessDays;
export const addDays = fnsAddDays;
export const substructBusinessDays = fnsSubBusinessDays;
export const subtractDays = subDays;
export const maxDateTime = max;
export const getNowDate = () => new Date();

const isSaturday = fnsIsSaturDay;
const isSunday = fnsIsSunday;
const isDateEqual = (a: Date, b: Date) => isEqual(a, b);

/**
 * Update task dates, according to startDate change
 * forceUpdate param for initial set start-end dates according to duration, progress and business days
 *
 * @returns false if date didn't change, true if it changed
 */
export const updateTaskDatesByStart = (
  task: Task,
  newStartDate: Date,
  forceUpdate = false
): boolean => {
  const daysSpent = Math.floor(task.duration * task.progress);
  const newStartDateCorrectedByHolidays =
    shiftToFirstNextBusinessDay(newStartDate);
  const newStartDateCorrectedByProgress = substructBusinessDays(
    newStartDateCorrectedByHolidays,
    daysSpent
  );

  if (
    !forceUpdate &&
    isDateEqual(task.start, newStartDateCorrectedByProgress)
  ) {
    return false;
  }

  task.start = newStartDateCorrectedByProgress;

  // -1 because every task is minimum 1 day long,
  // say it starts and ends on same date, so it has 1 day duration
  task.end = addBusinessDays(
    newStartDateCorrectedByProgress,
    task.duration - 1
  );
  return true;
};

export const shiftToFirstNextBusinessDay = (date: Date) => {
  if (isSaturday(date)) {
    return addDays(date, 2);
  } else if (isSunday(date)) {
    return addDays(date, 1);
  } else {
    return date;
  }
};
