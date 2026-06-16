import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ReactNode } from 'react';
import '@testing-library/jest-dom';
import TaskCard from '../components/TaskCard';
import LanguageContext from '../contexts/LanguageContext';
import { TaskBase } from '../types/task_types';
import ProjectCard from '../components/ProjectCard';
import { ProjectBase } from '../types/project_types';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import QuoteModal from '../components/QuoteModal';
import KanbanColumn from '../components/KanbanColumn';
import CommentModal from '../components/CommentModal';

const queryClient = new QueryClient();

// Helper function to render components with necessary wrapper providers
function renderWithRequirements(ui: ReactNode, language = 'en') {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <LanguageContext.Provider value={{ language, setLanguage: () => {} }}>
          {ui}
        </LanguageContext.Provider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

describe('TaskCard Component', () => {
  it('renders task title and description', () => {
    const task: TaskBase = { id: 1, name: 'Test Task', description: 'This is a test task', priority: 'medium', deadline: '', status: 'todo', project_id: 1, created_at: '' };
    renderWithRequirements(<TaskCard task={task} onEdit={() => {}} onDelete={() => {}} onOpenComments={() => {}} />);

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('This is a test task')).toBeInTheDocument();
  });
});

describe('ProjectCard Component', () => {
  it('renders project name and description', () => {
    const project: ProjectBase = { id: 1, name: 'Test Project', description: 'This is a test project', created_at: '', owner_id: 1 };
    renderWithRequirements(<ProjectCard project={project} onEdit={() => {}} onDelete={() => {}} isDeleting={false} />);

    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('This is a test project')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });
});

describe('QuoteModal Component', () => {
  it('renders quote text and author', () => {
    const quote = 'This is a test quote';
    renderWithRequirements(<QuoteModal quote={quote} setQuote={() => {}} onSave={() => {}} onClose={() => {}} />);

    expect(screen.getByText('This is a test quote')).toBeInTheDocument();
    expect(screen.getByText('Edit Quote')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });
});

describe('KanbanColumn Component', () => {
  it('renders column for all tasks status and languages', () => {
    // Test for English
    renderWithRequirements(<KanbanColumn status="todo" tasks={[]} onEdit={() => {}} onDelete={() => {}} onNewTask={() => {}} onOpenComments={() => {}} taskLength={0} commentCounts={{}} />);
    expect(screen.getByText('To Do')).toBeInTheDocument();

    renderWithRequirements(<KanbanColumn status="in_progress" tasks={[]} onEdit={() => {}} onDelete={() => {}} onNewTask={() => {}} onOpenComments={() => {}} taskLength={0} commentCounts={{}} />);
    expect(screen.getByText('In Progress')).toBeInTheDocument();

    renderWithRequirements(<KanbanColumn status="done" tasks={[]} onEdit={() => {}} onDelete={() => {}} onNewTask={() => {}} onOpenComments={() => {}} taskLength={0} commentCounts={{}} />);
    expect(screen.getByText('Done')).toBeInTheDocument();

    // Test for Portuguese
    renderWithRequirements(<KanbanColumn status="todo" tasks={[]} onEdit={() => {}} onDelete={() => {}} onNewTask={() => {}} onOpenComments={() => {}} taskLength={0} commentCounts={{}} />, 'pt');
    expect(screen.getByText('A Fazer')).toBeInTheDocument();

    renderWithRequirements(<KanbanColumn status="in_progress" tasks={[]} onEdit={() => {}} onDelete={() => {}} onNewTask={() => {}} onOpenComments={() => {}} taskLength={0} commentCounts={{}} />, 'pt');
    expect(screen.getByText('Em Progresso')).toBeInTheDocument();

    renderWithRequirements(<KanbanColumn status="done" tasks={[]} onEdit={() => {}} onDelete={() => {}} onNewTask={() => {}} onOpenComments={() => {}} taskLength={0} commentCounts={{}} />, 'pt');
    expect(screen.getByText('Concluído')).toBeInTheDocument();
  });
});

describe('CommentModal Component', () => {
  it('renders comment input and buttons', () => {
    // English tests
    renderWithRequirements(<CommentModal newComment='' setNewComment={() => {}} comments={[]} handleAddComment={() => {}} handleDeleteComment={() => {}} commentError='' onClose={() => {}} />);

    expect(screen.getByText('Notes')).toBeInTheDocument();
    expect(screen.getByText('No notes yet. Add one!')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add a comment...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Note' })).toBeInTheDocument();

    // Portuguese tests
    renderWithRequirements(<CommentModal newComment='' setNewComment={() => {}} comments={[]} handleAddComment={() => {}} handleDeleteComment={() => {}} commentError='' onClose={() => {}} />, 'pt');

    expect(screen.getByText('Notas')).toBeInTheDocument();
    expect(screen.getByText('Ainda não há notas. Adicione uma!')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Adicione um comentário...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Adicionar Nota' })).toBeInTheDocument();
  });
});