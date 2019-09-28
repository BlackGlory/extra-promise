import { each } from 'iterable-operator'
import { Task, TaskRunner } from './utils/task-runner'

export async function parallel<T>(tasks: Iterable<Task<T>>, limit: number = Infinity): Promise<T[]> {
  return await runTasks(new TaskRunner(limit), tasks)

  function runTasks(runner: TaskRunner, tasks: Iterable<Task<T>>) {
    return new Promise<T[]>((resolve, reject) => {
      const results: T[] = []

      runner.once('completed', () => resolve(results))
      runner.once('error', error => reject(error))

      each(tasks, addTaskToRunner)

      function addTaskToRunner(task: Task<T>, index: number) {
        runner.add(async () => logResult(index, await Promise.resolve(task())))
      }

      function logResult(index: number, value: T) {
        results[index] = value
      }
    })
  }
}
