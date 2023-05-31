import React from 'react';
import { Routes, Route } from 'react-router';

import { AppHeader } from './components/app-header';
import { TaskPreview } from './components/task-preview';
import { BoardPage } from './pages/board-page';
import { Workspaces } from './pages/workspaces';

export function RootCmp() {
  return (
    <div>
      <AppHeader />
      <main>
        <Routes>
          <Route path="/" element={<Workspaces />} />
          <Route path="/board/:boardId" element={<BoardPage />}>
            <Route path="/board/:boardId/:groupId/:taskId" element={<TaskPreview />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}
