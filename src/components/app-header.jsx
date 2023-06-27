import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import routes from '../routes';

import { FiChevronDown } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { CreateBoard } from './create-board';
import { boardService } from '../services/board.service';

export function AppHeader() {
  const [isCreate, setIsCreate] = useState(false);
  const [activeBoard, setActiveBoard] = useState(null);
  const boardId = useLocation().pathname.split('/')[2];
  const pathname = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (boardId) {
      loadCurrBoard();
    }
  }, [boardId]);

  async function loadCurrBoard() {
    try {
      const currBoard = await boardService.getById(boardId);
      setActiveBoard(currBoard);
    } catch (err) {
      console.log(err);
    }
  }

  // const user = useSelector(storeState => storeState.userModule.user)

  // async function onLogin(credentials) {
  //     try {
  //         const user = await login(credentials)
  //         showSuccessMsg(`Welcome: ${user.fullname}`)
  //     } catch(err) {
  //         showErrorMsg('Cannot login')
  //     }
  // }
  // async function onSignup(credentials) {
  //     try {
  //         const user = await signup(credentials)
  //         showSuccessMsg(`Welcome new user: ${user.fullname}`)
  //     } catch(err) {
  //         showErrorMsg('Cannot signup')
  //     }
  // }
  // async function onLogout() {
  //     try {
  //         await logout()
  //         showSuccessMsg(`Bye now`)
  //     } catch(err) {
  //         showErrorMsg('Cannot logout')
  //     }
  // }

  return pathname.pathname !== '/' ? (
    <header
      style={
        activeBoard
          ? {
              backgroundColor: activeBoard.style.header
            }
          : {
              backgroundColor: ' hsl(215,90%,32.7%)'
            }
      }
      className="app-header">
      <nav>
        <img
          onClick={() => {
            navigate(`/`);
            setActiveBoard(null);
          }}
          className="logo"
          src="https://a.trellocdn.com/prgb/assets/d947df93bc055849898e.gif"
        />
        {routes.map((route) => (
          <div className="nav-container" key={route.path}>
            <NavLink key={route.path} to={route.path}>
              {route.label}
            </NavLink>
            <FiChevronDown />
          </div>
        ))}
        <button onClick={() => setIsCreate(true)} className="gray-btn create-btn">
          Create
        </button>
        {isCreate && <CreateBoard onClose={() => setIsCreate(false)} />}
      </nav>
    </header>
  ) : (
    <div></div>
  );
}
