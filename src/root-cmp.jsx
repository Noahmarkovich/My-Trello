import React from 'react'
import { Routes, Route, Router } from 'react-router'

import routes from './routes'

import { AppHeader } from './cmps/app-header'
import { TaskPreview } from './cmps/task-preview'
import { BoardIndex } from './pages/board-index'


export function RootCmp() {

    return (
        <div>
            <AppHeader />
            <main>
                <Routes>
                    <Route path="/board" element={<BoardIndex />} >
                        <Route path="/board/:groupId/:taskId" element={<TaskPreview />} />
                    </Route>
                </Routes>
            </main>
        </div>
    )
}


