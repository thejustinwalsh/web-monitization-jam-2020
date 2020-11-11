export interface TaskCoroutine {
    (): void;
}

export type Task = {
    interval: number,
    elapsed: number,
    coroutine: LuaThread
};

const tasks: Array<Task> = [];

export function task(interval: number, co: TaskCoroutine): void {
    tasks.push({ interval, elapsed: 0, coroutine: coroutine.create(() => co()) });
}

export function update(dt: number): void {
    const dead: Array<number> = [];
    for (let i = 0; i < tasks.length; i++) {
        const t = tasks[i];

        t.elapsed += dt;
        if(t.elapsed >= t.interval) {
            t.elapsed = t.elapsed - t.interval;
            const [result] = coroutine.resume(t.coroutine);
            if (result == false) dead.push(i);
        }
    }

    for (let i = dead.length - 1; i >= 0; i--) {
        const index = dead[i];
        tasks.splice(index, 1);
    }
}