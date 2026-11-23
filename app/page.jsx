import { BlurText } from "./blur-text";
import { Newsletter } from "./launch-experience";
import { TasbeehReveal } from "./tasbeeh-reveal";

export default async function Home({ searchParams }) {
  const { signup } = await searchParams;

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <div className="wrap flex items-center justify-between gap-4">
          <a className="brand-link inline-flex items-center" href="#top" aria-label="Everyday Muslims home">
            <img src="/identity/tasbeeh-mark.webp" alt="" width="576" height="298" />
            <span>Everyday Muslims</span>
          </a>
          <a className="header-link inline-flex items-center" href="#launch-email">
            Launch updates <span className="link-arrow" aria-hidden="true">↘</span>
          </a>
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        <section className="hero" aria-labelledby="launch-title" data-enter>
          <div className="wrap hero-grid grid items-center">
            <div className="hero-copy">
              <p className="launch-status inline-flex items-center">
                <span className="status-dot" aria-hidden="true" />
                Launching soon
              </p>
              <h1 id="launch-title">
                <BlurText text="Little things." />{" "}
                <BlurText text="Lasting faith." startIndex={2} />
              </h1>
              <p className="hero-description">
                Something we’ve been dreaming up is finally taking shape.
                The first look is yours.
              </p>
              <Newsletter initialStatus={signup} />
            </div>
            <TasbeehReveal />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap"><small>© 2026 Everyday Muslims</small></div>
      </footer>
    </>
  );
}
