import React from 'react'
import { Routes, Route, Router } from 'react-router'

import routes from './routes'

import { AppHeader } from './components/app-header'
import { TaskPreview } from './components/task-preview'
import { BoardPage } from './pages/board-page'


export function RootCmp() {

    return (
        <div>
            <AppHeader />
            <main>
                <Routes>
                    <Route path="/board" element={<BoardPage />} >
                        <Route path="/board/:groupId/:taskId" element={<TaskPreview />} />
                    </Route>
                </Routes>
            </main>
        </div>
    )
}


