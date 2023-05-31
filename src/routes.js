// import { HomePage } from './pages/home-page.jsx'
import { BoardPage } from './pages/board-page.jsx';

// Routes accesible from the main navigation (in AppHeader)
const routes = [
  // {
  //     path: '/',
  //     component: <HomePage />,
  //     label: 'Home 🏠',
  // },
  {
    path: 'board',
    component: <BoardPage />,
    label: 'Workspace'
  }
  // {
  //     path: 'chat',
  //     component: <ChatApp />,
  //     label: `Chat`
  // },
  // {
  //     path: 'about',
  //     component: <AboutUs />,
  //     label: 'Template'
  // },
  // {
  //     path: 'admin',
  //     component: <AdminApp />,
  //     label: 'Create'
  // }
];

export default routes;
