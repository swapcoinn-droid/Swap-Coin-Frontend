type RoutePlaceholderProps = {
  title: string
}

export function RoutePlaceholder({ title }: RoutePlaceholderProps) {
  return (
    <main>
      <h1>{title}</h1>
      <p>Pantalla pendiente de implementación.</p>
    </main>
  )
}
