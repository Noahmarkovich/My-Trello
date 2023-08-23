import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, signup } from '../store/user.actions';
import leftHero from '../assets/img/login-left-img.svg';
import rightHero from '../assets/img/login-right-img.svg';
import logo from '../assets/img/logo-homepage.png';
import { LoginForm } from '../components/login/login-form';

export function LoginPage() {
  const user = useSelector((storeState) => storeState.userModule.user);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    fullName: '',
    avatar: {}
  });
  const [isSignUp, setIsSignUp] = useState(true);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setCredentials(user);
      setIsSignUp(false);
    }
  }, []);
  function handleChange(ev) {
    const field = ev.target.name;
    const value = ev.target.value;
    setCredentials({ ...credentials, [field]: value });
  }

  async function onSignUp(ev) {
    if (ev) {
      ev.preventDefault();
    }
    if (!credentials.email || !credentials.password || !credentials.fullName) {
      return;
    }
    try {
      await signup(credentials);
      navigate('/workspaces');
    } catch (err) {
      console.log(err);
    }
  }

  async function onLogin(ev) {
    ev.preventDefault();
    try {
      await login(credentials);
      navigate('/workspaces');
    } catch (err) {
      setErr('Invalid email or password');
      console.log(err);
    }
  }

  return (
    <section className="login-page">
      <main className="login-main">
        <header>
          <div className="logo-container">
            <img src={logo} alt="logo" className="login-logo" />
            <h2>Nrello</h2>
          </div>
          <h1>{isSignUp ? 'Sign up to continue' : 'Log in to continue'}</h1>
        </header>
        <LoginForm
          isSignUp={isSignUp}
          onSignUp={onSignUp}
          onLogin={onLogin}
          credentials={credentials}
          handleChange={handleChange}
          err={err}
        />
        <button
          className="clean-txt-btn"
          onClick={() => {
            isSignUp ? setIsSignUp(false) : setIsSignUp(true);
            setCredentials({
              email: '',
              password: '',
              fullName: '',
              avatar: {}
            });
          }}>
          {isSignUp ? 'Already have an account? Log in' : 'Create an account'}
        </button>
      </main>
      <div className="img-container">
        <img src={leftHero} alt="left-hero" className="right-hero" />
        <img src={rightHero} alt="rightHero" className="right-hero" />
      </div>
    </section>
  );
}
