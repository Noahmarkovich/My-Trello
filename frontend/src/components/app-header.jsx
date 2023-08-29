import { NavLink, useNavigate } from 'react-router-dom';
import routes from '../routes';

import { useRef, useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useOnClickOutside } from '../hooks/useOnClickOutside';
import { SET_ACTIVE_BOARD } from '../store/board.reducer';
import { logout } from '../store/user.actions';
import { CreateBoard } from './create-board';
import { HeaderUserContainer } from './header-user-container';
import { dispatchBoard } from '../store/board.actions';

export function AppHeader() {
  const [isCreate, setIsCreate] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  useOnClickOutside(userMenuRef, () => setIsUserMenuOpen(false));
  const user = useSelector((storeState) => storeState.userModule.user);
  const activeBoard = useSelector((storeState) => storeState.boardModule.activeBoard);
  const [logo, setLogo] = useState(require('../assets/img/header-static-logo.gif'));
  const navigate = useNavigate();
  // const dispatch = useDispatch();

  async function onLogout() {
    try {
      await logout();
      setIsUserMenuOpen(false);
      navigate('/login');
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <header
      style={{
        backgroundColor: activeBoard?.style.header ?? 'hsl(215,90%,32.7%)'
      }}
      className="app-header">
      <nav>
        <div
          // TODO: Fix require
          onMouseOver={() => setLogo(require('../assets/img/motion-logo.gif'))}
          onMouseLeave={() => setLogo(require('../assets/img/header-static-logo.gif'))}
          className="logo-container"
          onClick={() => {
            navigate(`/`);
            dispatchBoard(SET_ACTIVE_BOARD, null);
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
          onClickUserOption={() => setIsUserMenuOpen(!isUserMenuOpen)}
          isOptionOpen={isUserMenuOpen}
          optionRef={userMenuRef}
          onLogout={onLogout}
        />
      )}
    </header>
  );
}
