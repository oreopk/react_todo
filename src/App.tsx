import './App.css';
import { useCallback, useMemo, useState } from 'react';

type todo_item = {
  id: string;
  title: string;
  completed: boolean;
};

function App() {
  const [tasks, setTasks] = useState<todo_item[]>([]);
  const [title, setTitle] = useState('');

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) => {
      const prev_tasks = [...prev];
      for (let i = 0; i < prev_tasks.length; i++) {
        if (prev_tasks[i].id === id) {
          prev_tasks[i] = {
            ...prev_tasks[i],
            completed: !prev_tasks[i].completed,
          };
          return prev_tasks;
        }
      }
      return prev;
    });
  }, []);

  const addTask = useCallback(() => {
    if (!title) return;
    setTasks((prev) => {
      const prev_tasks = [...prev];
      prev_tasks.push({
        id: Date.now().toString(),
        title: title,
        completed: false,
      });
      return prev_tasks;
    });
    setTitle('');
  }, [title]);
  return (
    <>
      <div>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <button onClick={addTask}>Add Task</button>
      </div>
      {tasks.map((task) => (
        <li key={task.id}>
          <label>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
            />{' '}
            {task.title}
          </label>
        </li>
      ))}
    </>
  );
}

export default App;
