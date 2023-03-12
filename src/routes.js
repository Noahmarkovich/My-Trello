import { HomePage } from './pages/home-page.jsx'
import { AboutUs } from './pages/about-us.jsx'
import { BoardIndex } from './pages/board-index.jsx'
import { ReviewIndex } from './pages/review-index.jsx'
import { ChatApp } from './pages/chat-app.jsx'
import { AdminApp } from './pages/admin-app.jsx'



// Routes accesible from the main navigation (in AppHeader)
const routes = [
    // {
    //     path: '/',
    //     component: <HomePage />,
    //     label: 'Home 🏠',
    // },
    {
        path: 'board',
        component: <BoardIndex />,
        label: 'Workspace'
    },
    {
        path: 'review',
        component: <ReviewIndex />,
        label: 'Recent'
    },
    {
        path: 'chat',
        component: <ChatApp />,
        label: `Chat`
    },
    {
        path: 'about',
        component: <AboutUs />,
        label: 'Template'
    },
    {
        path: 'admin',
        component: <AdminApp />,
        label: 'Create'
    }
]

export default routes