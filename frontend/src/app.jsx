import React from 'react';
import { Routes, Route } from 'react-router';

import { AppHeader } from './components/app-header';
import { TaskPreview } from './components/task-preview';
import { BoardPage } from './pages/board-page';
import { HomePage } from './pages/home-page';
import { LoginPage } from './pages/login-page';
import { Workspaces } from './pages/workspaces';

export function App() {
  return (
    <div>
      <section>
        <main>
          <AppHeader />
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
