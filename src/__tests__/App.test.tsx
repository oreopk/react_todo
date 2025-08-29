import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { describe, expect, test } from 'vitest';
import '@testing-library/jest-dom/vitest';

async function addTask(title: string) {
  const input = screen.getByTestId('title-input');
  await userEvent.clear(input);
  await userEvent.type(input, title);
  await userEvent.click(screen.getByRole('button', { name: /add task/i }));
}

describe('Todos App', () => {
  test('should title and buttons render', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /todos/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add task/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /clear completed/i })
    ).toBeDisabled();
    expect(screen.getByRole('button', { name: 'All' })).toHaveClass(
      'is-active'
    );
    expect(screen.getByRole('button', { name: 'Active' })).not.toHaveClass(
      'is-active'
    );
    expect(screen.getByRole('button', { name: 'Completed' })).not.toHaveClass(
      'is-active'
    );
  });

  test('should add new task', async () => {
    render(<App />);
    await addTask('   New Tasks   ');
    expect(screen.getByText('New Tasks')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /clear completed/i })
    ).toBeDisabled();
  });

  test('the completed button should switch', async () => {
    render(<App />);
    await addTask('New task');
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    expect(
      screen.getByRole('button', { name: /clear completed/i })
    ).toBeEnabled();
  });

  test('should clear all completed tasks', async () => {
    render(<App />);
    await addTask('New task 1');
    await addTask('New task 2');
    const items = screen.getAllByRole('listitem');
    const aItem = items.find((li) => within(li).queryByText('New task 1'));
    if (!aItem) throw new Error('Task not found');
    const aCheckbox = within(aItem).getByRole('checkbox');
    await userEvent.click(aCheckbox);

    await userEvent.click(
      screen.getByRole('button', { name: /clear completed/i })
    );

    expect(screen.queryByText('New task 1')).not.toBeInTheDocument();
    expect(screen.getByText('New task 2')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /clear completed/i })
    ).toBeDisabled();
  });

  test('filters should work', async () => {
    render(<App />);
    await addTask('New task 1');
    await addTask('New task 2');
    const task2Item = screen
      .getAllByRole('listitem')
      .find((li) => within(li).queryByText('New task 2'));
    if (!task2Item) throw new Error('Task New task 2 not found');
    await userEvent.click(within(task2Item).getByRole('checkbox'));

    await userEvent.click(screen.getByRole('button', { name: 'Active' }));
    expect(screen.getByRole('button', { name: 'Active' })).toHaveClass(
      'is-active'
    );
    expect(screen.getByText('New task 1')).toBeInTheDocument();
    expect(screen.queryByText('New task 2')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Completed' }));
    expect(screen.getByRole('button', { name: 'Completed' })).toHaveClass(
      'is-active'
    );
    expect(screen.getByText('New task 2')).toBeInTheDocument();
    expect(screen.queryByText('New task 1')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'All' }));
    expect(screen.getByRole('button', { name: 'All' })).toHaveClass(
      'is-active'
    );
    expect(screen.getByText('New task 1')).toBeInTheDocument();
    expect(screen.getByText('New task 2')).toBeInTheDocument();
  });
});
