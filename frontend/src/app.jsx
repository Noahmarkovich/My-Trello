import React from 'react';
import { Routes, Route } from 'react-router';

import { AppHeader } from './components/app-header';
import { TaskPreview } from './components/board/task/task-preview';
import { BoardPage } from './pages/board-page';
import { HomePage } from './pages/home-page';
import { LoginPage } from './pages/login-page';
import { Workspaces } from './pages/workspaces';
import { useShouldShowHeader } from './hooks/useShouldShowHeader';

export function App() {
  const shouldShowHeader = useShouldShowHeader();

  return (
    <div>
      <section>
        <main>
          {shouldShowHeader && <AppHeader />}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/workspaces" element={<Workspaces />} />
            <Route path="/board/:boardId" element={<BoardPage />}>
              <Route path="/board/:boardId/:groupId/:taskId" element={<TaskPreview />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>
      </section>
    </div>
  );
}
