import { Link } from 'react-router-dom'

import { ArrowRightIcon } from '../../components/icons/AuthIcons'
import { BrandMark } from '../../components/icons/BrandMark'
import { routes } from '../../router/routes'
import './landing-page.css'

const features = [
  {
    title: 'Cambio de divisas sin friccion',
    description:
      'Consulta balances, compra divisas y mueve tu dinero entre monedas desde un unico panel.',
  },
  {
    title: 'Metas de ahorro para viajeros',
    description:
      'Organiza objetivos por destino, moneda y avance para saber cuanto falta antes de tu proximo viaje.',
  },
  {
    title: 'Historial claro de movimientos',
    description:
      'Revisa compras, recargas, conversiones y gastos con informacion facil de entender.',
  },
]

const audiences = [
  'Nomadas digitales que cobran o gastan en varias monedas.',
  'Viajeros frecuentes que quieren planear presupuestos por destino.',
  'Personas que buscan una billetera simple para organizar divisas y metas.',
]

const metrics = [
  { value: '24/7', label: 'Acceso a tu centro financiero' },
  { value: '3+', label: 'Monedas listas para organizar' },
  { value: '100%', label: 'Flujo pensado para movilidad' },
]

export function LandingPage() {
  return (
    <main className="landing-page">
      <header className="landing-nav">
        <Link className="landing-nav__brand" to={routes.home} aria-label="Swap-Coin inicio">
          <span className="landing-nav__mark">
            <BrandMark />
          </span>
          <span>Swap-Coin</span>
        </Link>

        <nav className="landing-nav__links" aria-label="Navegacion publica">
          <a href="#features">Funciones</a>
          <a href="#audience">Para quien es</a>
          <Link to={routes.login}>Iniciar sesion</Link>
          <Link className="landing-nav__cta" to={routes.register}>
            Crear cuenta
          </Link>
        </nav>
      </header>

      <section className="landing-hero">
        <div className="landing-hero__content">
          <span className="landing-eyebrow">Finanzas para moverte por el mundo</span>
          <h1>Cambia divisas, alcanza tus metas y viaja con mas control.</h1>
          <p>
            Swap-Coin es una billetera web para organizar monedas, comprar divisas y planear
            objetivos de ahorro desde una experiencia simple, visual y lista para viajeros.
          </p>

          <div className="landing-hero__actions">
            <Link className="landing-button landing-button--primary" to={routes.register}>
              Crear cuenta <ArrowRightIcon />
            </Link>
            <Link className="landing-button landing-button--secondary" to={routes.login}>
              Ya tengo cuenta
            </Link>
          </div>
        </div>

        <div className="landing-wallet" aria-label="Vista previa de billetera">
          <div className="landing-wallet__header">
            <span>Balance global</span>
            <strong>$12,450.00</strong>
          </div>
          <div className="landing-wallet__cards">
            <span>USD $4,200</span>
            <span>EUR €3,850</span>
            <span>COP $16.8M</span>
          </div>
          <div className="landing-wallet__goal">
            <span>Meta: Viaje a Medellin</span>
            <strong>85%</strong>
            <div className="landing-wallet__progress">
              <span />
            </div>
          </div>
        </div>
      </section>

      <section className="landing-metrics" aria-label="Resumen de beneficios">
        {metrics.map((metric) => (
          <article key={metric.label}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </article>
        ))}
      </section>

      <section className="landing-section" id="features">
        <div className="landing-section__header">
          <span className="landing-eyebrow">Funciones principales</span>
          <h2>Todo lo esencial para administrar divisas en movimiento.</h2>
        </div>

        <div className="landing-feature-grid">
          {features.map((feature, index) => (
            <article className="landing-feature-card" key={feature.title}>
              <span className="landing-feature-card__number">0{index + 1}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-audience" id="audience">
        <div>
          <span className="landing-eyebrow">A quien va dirigido</span>
          <h2>Para personas que viven, trabajan o viajan entre monedas.</h2>
          <p>
            La experiencia esta pensada para reducir el ruido de las finanzas personales cuando
            tu vida no ocurre en una sola ciudad ni en una sola divisa.
          </p>
        </div>

        <ul>
          {audiences.map((audience) => (
            <li key={audience}>{audience}</li>
          ))}
        </ul>
      </section>

      <section className="landing-cta">
        <h2>Empieza a organizar tu dinero antes del proximo destino.</h2>
        <p>Crea tu cuenta, registra tus monedas y prueba el flujo de metas y dashboard.</p>
        <Link className="landing-button landing-button--primary" to={routes.register}>
          Crear cuenta gratis <ArrowRightIcon />
        </Link>
      </section>

      <footer className="landing-footer">
        <Link className="landing-footer__brand" to={routes.home} aria-label="Swap-Coin inicio">
          <span className="landing-footer__mark">
            <BrandMark />
          </span>
          <span>Swap-Coin</span>
        </Link>

        <p>Finanzas simples para personas que se mueven entre monedas, metas y destinos.</p>

        <nav className="landing-footer__links" aria-label="Enlaces del footer">
          <a href="#features">Funciones</a>
          <a href="#audience">Para quien es</a>
          <Link to={routes.login}>Iniciar sesion</Link>
        </nav>
      </footer>
    </main>
  )
}
