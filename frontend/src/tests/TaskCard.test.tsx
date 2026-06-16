import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ReactNode } from 'react';
import '@testing-library/jest-dom';
import TaskCard from '../components/TaskCard';
import LanguageContext from '../contexts/LanguageContext';
import { TaskBase } from '../types/task_types';

function renderWithLanguage(ui: ReactNode, language = 'en') {
  return render(
    <LanguageContext.Provider value={{ language, setLanguage: () => {} }}>
      {ui}
    </LanguageContext.Provider>
  );
}

describe('TaskCard Component', () => {
  it('renders task title and description', () => {
    const task: TaskBase = { id: 1, name: 'Test Task', description: 'This is a test task', priority: 'medium', deadline: '', status: 'todo', project_id: 1, created_at: '' };
    renderWithLanguage(<TaskCard task={task} onEdit={() => {}} onDelete={() => {}} onOpenComments={() => {}} />);

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('This is a test task')).toBeInTheDocument();
  });
});