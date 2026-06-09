import './route-placeholder.css'

type RoutePlaceholderProps = {
  title: string
}

export function RoutePlaceholder({ title }: RoutePlaceholderProps) {
  return (
    <main className="route-placeholder" aria-labelledby="route-placeholder-title">
      <section className="route-placeholder__content">
        <div className="route-placeholder__copy">
          <span className="route-placeholder__eyebrow">Próximamente</span>
          <h1 id="route-placeholder-title">{title}</h1>
          <p>
            Estamos preparando algo sorprendente para esta sección. Muy pronto vas a poder
            explorar una experiencia más completa, visual y conectada con tus metas financieras.
          </p>
        </div>

        <div className="route-placeholder__stage" aria-hidden="true">
          <div className="route-placeholder__orbit" />
          <div className="route-placeholder__card route-placeholder__card--main">
            <span>Vista en construcción</span>
            <strong>Muy pronto</strong>
            <div className="route-placeholder__progress">
              <span />
            </div>
          </div>
          <div className="route-placeholder__card route-placeholder__card--mini">
            <span>Demo ready</span>
          </div>
          <div className="route-placeholder__spark route-placeholder__spark--one" />
          <div className="route-placeholder__spark route-placeholder__spark--two" />
        </div>
      </section>
    </main>
  )
}
