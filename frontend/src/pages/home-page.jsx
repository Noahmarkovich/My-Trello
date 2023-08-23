import logo from '../assets/img/logo-homepage.png';
import { AiFillGithub } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import heroImg from '../assets/img/hero-homepage.jpg';
import { WaveHomepage } from '../components/svg/homepage-wave';
import { useSelector } from 'react-redux';

export function HomePage() {
  const user = useSelector((storeState) => storeState.userModule.user);
  const navigate = useNavigate();
  const contentList = [
    {
      title: 'Boards',
      txt: 'Nrello boards keep tasks organized and work moving forward. ln a glance, see everything from "things to do" to "aww yeah, we did it!"'
    },
    {
      title: 'Lists',
      txt: "The different stages of a task. Start as simple as To Do, Doing or Done-or build a workflow custom fit to your team's needs. There's no wrong way to Nrello. "
    },
    {
      title: 'Cards',
      txt: 'Cards represent tasks and ideas and hold all the information to get the job done. As you make progress, move cards across lists to show their status.'
    }
  ];

  function directTo() {
    if (user) {
      navigate('/workspaces');
    } else {
      navigate('/login');
    }
  }

  return (
    <section className="home-page">
      <header className="home-page-header">
        <div className="logo-container">
          <img className="logo" src={logo} />
          <h1>Nrello</h1>
        </div>
        <div className="login-btn-container">
          <button onClick={directTo} className="login-btn white">
            Log in
          </button>
          <button onClick={directTo} className="login-btn blue">
            Get Nrello for free
          </button>
        </div>
      </header>
      <main className="main-homepage">
        <section className="hero">
          <div className="intro">
            <div className="text">
              <h1>Nrello brings all your tasks, teammates, and tools together</h1>
              <p>Keep everything in the same place—even if your team isn&apos;t.</p>
              <button onClick={directTo} className="hero-btn">
                Start now
              </button>
            </div>
            <img className="hero-img" src={heroImg} alt="Nrello-hero" />
          </div>
          <WaveHomepage />
        </section>

        <section className="content-container">
          <div className="content">
            <h2>A productivity powerhouse</h2>
            <p className="title-paragraph">
              Simple, flexible, and powerful. All it takes are boards, lists, and cards to get a
              clear view of who&apos;s doing what and what needs to get done. Learn more in our
              guide for getting started.
            </p>
            <div className="paragraphs">
              {contentList.map((content, idx) => {
                return (
                  <button className="paragraph" key={idx}>
                    <h5>{content.title}</h5>
                    <p>{content.txt}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
        <footer>
          <small>trello clone project by </small>
          <a href="https://github.com/Noahmarkovich">
            <AiFillGithub />
          </a>
        </footer>
      </main>
    </section>
  );
}
