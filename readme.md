### Simple sheduling algorithm for planning tasks with day-based time quant

[NPM Package](https://npmjs.org/package/project-tasks-scheduling-engine)

## Install

```shell
npm install project-tasks-scheduling-engine
```

## Use

```typescript
import { scheduleTasks } from "project-tasks-scheduling-engine";

const todayForTest = new Date("2020-01-01");

console.log(
  scheduleTasks(
    [
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
    ],
    todayForTest // optional
  )
);

// ->
[
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
```
