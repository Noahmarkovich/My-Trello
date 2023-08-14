import logo from '../assets/img/logo-homepage.png';
import { AiFillGithub } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();
  const contentList = [
    {
      title: 'Boards',
      txt: 'Trello boards keep tasks organized and work moving forward. ln a glance, see everything from "things to do" to "aww yeah, we did it!"'
    },
    {
      title: 'Lists',
      txt: "The different stages of a task. Start as simple as To Do, Doing or Done-or build a workflow custom fit to your team's needs. There's no wrong way to Trello. "
    },
    {
      title: 'Cards',
      txt: 'Cards represent tasks and ideas and hold all the information to get the job done. As you make progress, move cards across lists to show their status.'
    }
  ];

  return (
    <section className="home-page">
      <header className="home-page-header">
        <div className="logo-container">
          <img className="logo" src={logo} />
          <h1>Nrello</h1>
        </div>
        <div className="login-btn-container">
          <button className="login-btn white">Log in</button>
          <button className="login-btn blue">Get Nrello for free</button>
        </div>
      </header>
      <main className="main-homepage">
        <section className="hero">
          <div className="intro">
            <div className="text">
              <h1>Nrello brings all your tasks, teammates, and tools together</h1>
              <p>Keep everything in the same place—even if your team isn&apos;t.</p>
              <button onClick={() => navigate('/login')} className="hero-btn">
                Start now
              </button>
            </div>
            <img
              className="hero-img"
              src="https://images.ctfassets.net/rz1oowkt5gyp/75rDABL8fyMtNLlUAtBxrg/c5e145977a86c41c47e17c69410c64f7/TrelloUICollage_4x.png?w=2280&amp;fm=webp"
              alt="trello-hero"
            />
          </div>
          <svg
            className="shape-divider"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none">
            <path
              d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
              className="shape-fill"
              fill="white"></path>
          </svg>
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
