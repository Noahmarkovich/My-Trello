import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import routes from '../routes';

import { FiChevronDown } from 'react-icons/fi';
import { useEffect, useRef, useState } from 'react';
import { CreateBoard } from './create-board';
import { boardService } from '../services/board.service';
import { useSelector } from 'react-redux';
import { useOnClickOutside } from '../hooks/useOnClickOutside';
import { logout } from '../store/user.actions';
import { HeaderUserContainer } from './header-user-container';

export function AppHeader() {
  const [isCreate, setIsCreate] = useState(false);
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const optionRef = useRef(null);
  useOnClickOutside(optionRef, () => setIsOptionOpen(false));
  const user = useSelector((storeState) => storeState.userModule.user);
  const boardId = useLocation().pathname.split('/')[2];
  const pathname = useLocation();
  const [activeBoard, setActiveBoard] = useState(null);
  const [logo, setLogo] = useState(require('../assets/img/header-static-logo.gif'));
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

  async function onLogout() {
    try {
      await logout();
      setIsOptionOpen(false);
      navigate('/login');
    } catch (err) {
      console.log(err);
    }
  }

  return pathname.pathname !== '/' && pathname.pathname !== '/login' ? (
    <header
      style={
        boardId && activeBoard
          ? {
              backgroundColor: activeBoard.style.header
            }
          : {
              backgroundColor: ' hsl(215,90%,32.7%)'
            }
      }
      className="app-header">
      <nav>
        <div
          onMouseOver={() => setLogo(require('../assets/img/motion-logo.gif'))}
          onMouseLeave={() => setLogo(require('../assets/img/header-static-logo.gif'))}
          className="logo-container"
          onClick={() => {
            navigate(`/`);
            setActiveBoard(null);
          }}>
          <img className="logo" src={logo} />
          <h1>Nrello</h1>
        </div>
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
      {user && (
        <HeaderUserContainer
          user={user}
          onClickUserOption={() => setIsOptionOpen(!isOptionOpen)}
          isOptionOpen={isOptionOpen}
          optionRef={optionRef}
          onLogout={onLogout}
        />
      )}
    </header>
  ) : (
    <div></div>
  );
}
