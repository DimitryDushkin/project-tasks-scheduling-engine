import { addDays, isSaturday, isSunday } from "date-fns";

export const shiftToFirstNextBusinessDay = (date: Date) => {
  if (isSaturday(date)) {
    return addDays(date, 2);
  } else if (isSunday(date)) {
    return addDays(date, 1);
  } else {
    return date;
  }
};
