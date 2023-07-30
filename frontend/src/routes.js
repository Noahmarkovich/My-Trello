// import { HomePage } from './pages/home-page.jsx'

import { Workspaces } from './pages/workspaces.jsx';

// Routes accesible from the main navigation (in AppHeader)
const routes = [
  // {
  //     path: '/',
  //     component: <HomePage />,
  //     label: 'Home 🏠',
  // },
  {
    path: 'workspaces',
    component: <Workspaces />,
    label: 'Workspaces'
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
