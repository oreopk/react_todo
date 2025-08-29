import './App.css';
import { useCallback, useMemo, useState } from 'react';

type todo_item = {
  id: string;
  title: string;
  completed: boolean;
};

type Filter = 'all' | 'active' | 'completed';

function App() {
  const [tasks, setTasks] = useState<todo_item[]>([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const filteredTasks = useMemo(() => {
    if (filter === 'active') return tasks.filter((task) => !task.completed);
    if (filter === 'completed') return tasks.filter((task) => task.completed);
    return tasks;
  }, [tasks, filter]);

  const completed = () => tasks.filter((x) => x.completed);

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((x) => !x.completed));
  }, []);

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
    const t = title.trim();
    if (!t) return;
    setTasks((prev) => {
      const prev_tasks = [...prev];
      prev_tasks.push({
        id: Date.now().toString(),
        title: t,
        completed: false,
      });
      return prev_tasks;
    });
    setTitle('');
  }, [title]);
  return (
    <>
      <div className="main">
        <h1 className="title">todos</h1>
        <div className="header">
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button onClick={addTask}>Add Task</button>
          <button onClick={clearCompleted} disabled={completed().length === 0}>
            Clear completed
          </button>
        </div>
        <ul className="list">
          {filteredTasks.map((task) => (
            <li className="item" key={task.id}>
              <label className="label">
                <input
                  className="checkbox"
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
                <span className="text">{task.title}</span>
              </label>
            </li>
          ))}
        </ul>
        <div className="filters">
          <button
            className={` ${filter === 'all' ? 'is-active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`${filter === 'active' ? 'is-active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={`${filter === 'completed' ? 'is-active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
