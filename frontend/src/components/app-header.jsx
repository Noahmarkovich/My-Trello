import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import routes from '../routes';

import { FiChevronDown } from 'react-icons/fi';
import { useEffect, useRef, useState } from 'react';
import { CreateBoard } from './create-board';
import { boardService } from '../services/board.service';
import { useSelector } from 'react-redux';
import { useOnClickOutside } from '../hooks/useOnClickOutside';
import { logout } from '../store/user.actions';

export function AppHeader() {
  const [isCreate, setIsCreate] = useState(false);
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const optionRef = useRef(null);
  useOnClickOutside(optionRef, () => setIsOptionOpen(false));
  const user = useSelector((storeState) => storeState.userModule.user);
  const boardId = useLocation().pathname.split('/')[2];
  const pathname = useLocation();
  const [activeBoard, setActiveBoard] = useState(null);
  const [logo, setLogo] = useState('https://a.trellocdn.com/prgb/assets/d947df93bc055849898e.gif');
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
          onMouseOver={() => setLogo('https://trello.com/assets/87e1af770a49ce8e84e3.gif')}
          onMouseLeave={() =>
            setLogo('https://a.trellocdn.com/prgb/assets/d947df93bc055849898e.gif')
          }
          className="logo-container">
          <img
            onClick={() => {
              navigate(`/`);
              setActiveBoard(null);
            }}
            className="logo"
            src={logo}
          />
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
        <section className="user-container">
          <button
            onClick={() => setIsOptionOpen(!isOptionOpen)}
            style={{ backgroundColor: user.avatar.color }}
            className="avatar">
            {user.avatar ? user.avatar.initials : 'NM'}
          </button>
          {isOptionOpen && (
            <div className="user-options" ref={optionRef}>
              <h2 className="options-header">ACCOUNT</h2>
              <div className="user-info">
                <div style={{ backgroundColor: user.avatar.color }} className="avatar">
                  {user.avatar ? user.avatar.initials : 'NM'}
                </div>
                <div>
                  <h3>{user.fullName}</h3>
                  <p>{user.email}</p>
                </div>
              </div>
              <div className="option">
                <a onClick={onLogout}>Switch accounts</a>
              </div>
              <div className="option">
                <a onClick={onLogout}>Log out</a>
              </div>
            </div>
          )}
        </section>
      )}
    </header>
  ) : (
    <div></div>
  );
}
