# Swap-Coin Frontend

Swap-Coin es una aplicación web para gestionar una wallet multidivisa, consultar saldos, agregar o retirar dinero, cambiar divisas, revisar el historial de transacciones y administrar metas de ahorro. Este repositorio contiene el frontend desarrollado con React, TypeScript y Vite.

## Índice

- [Descripción General](#descripción-general)
- [Manual De Usuario](#manual-de-usuario)
  - [Acceso A La Aplicación](#acceso-a-la-aplicación)
  - [Crear Una Cuenta](#crear-una-cuenta)
  - [Iniciar Sesión](#iniciar-sesión)
  - [Dashboard Principal](#dashboard-principal)
  - [Agregar Saldo](#agregar-saldo)
  - [Retirar Saldo](#retirar-saldo)
  - [Cambiar Divisa](#cambiar-divisa)
  - [Metas De Ahorro](#metas-de-ahorro)
  - [Historial De Transacciones](#historial-de-transacciones)
  - [Chatbot](#chatbot)
  - [Cerrar Sesión](#cerrar-sesión)
- [Manual De Decisiones Técnicas](#manual-de-decisiones-técnicas)
  - [React](#react)
  - [TypeScript](#typescript)
  - [Vite](#vite)
  - [React Router DOM](#react-router-dom)
  - [Context, Provider Y Hooks](#context-provider-y-hooks)
  - [Servicios API](#servicios-api)
  - [CSS Modular Por Componente](#css-modular-por-componente)
  - [Vitest Y Testing Library](#vitest-y-testing-library)
  - [Vercel](#vercel)
- [Estructura Del Proyecto](#estructura-del-proyecto)
- [Rutas Principales](#rutas-principales)
- [Instalación Y Ejecución Local](#instalación-y-ejecución-local)
- [Variables De Entorno](#variables-de-entorno)
- [Scripts Disponibles](#scripts-disponibles)
- [Instrucciones Para Clonar El Repositorio](#instrucciones-para-clonar-el-repositorio)
- [Flujo Recomendado De Trabajo Con Git](#flujo-recomendado-de-trabajo-con-git)
- [Pruebas](#pruebas)

## Descripción General

El frontend de Swap-Coin permite que un usuario cree una cuenta, inicie sesión y gestione su información financiera desde una interfaz responsive. La aplicación se conecta a una API desplegada en Railway mediante servicios centralizados, evitando llamadas directas dispersas por las pantallas.

Las funciones principales son:

- Registro e inicio de sesión.
- Protección de rutas privadas.
- Visualización de saldos por divisa.
- Agregar saldo a la wallet.
- Retirar saldo de la wallet.
- Cambiar divisas.
- Crear, consultar, actualizar y eliminar metas de ahorro.
- Aportar o retirar dinero de una meta.
- Consultar historial de transacciones.
- Usar un chatbot de apoyo dentro de la experiencia.

## Manual De Usuario

Este manual está pensado para una persona que no conoce el proyecto. Los nombres de botones y secciones se explican tal como aparecen en la interfaz.

### Acceso A La Aplicación

Al abrir Swap-Coin, el usuario llega a la landing page. Allí encontrará información general sobre la plataforma, sus funciones principales y accesos para iniciar sesión o crear una cuenta.

Desde la landing page se puede:

- Ir a `Crear cuenta` para registrarse.
- Ir a `Iniciar sesión` si ya existe una cuenta.
- Revisar información general sobre Swap-Coin.

### Crear Una Cuenta

Para crear una cuenta:

1. Presionar el botón `Crear cuenta`.
2. Escribir el nombre completo.
3. Escribir un correo electrónico válido.
4. Escribir una contraseña segura.
5. Confirmar la contraseña.
6. Aceptar los términos y condiciones.
7. Presionar `Crear cuenta`.

Validaciones importantes:

- El correo debe tener un formato válido, por ejemplo `usuario@email.com`.
- La contraseña y la confirmación deben coincidir.
- La contraseña debe cumplir las reglas de seguridad definidas por la aplicación.
- El usuario debe aceptar los términos para poder continuar.

Cuando el registro se completa correctamente, la aplicación redirige al usuario a la pantalla de inicio de sesión.

### Iniciar Sesión

Para iniciar sesión:

1. Presionar `Iniciar sesión`.
2. Escribir el correo electrónico registrado.
3. Escribir la contraseña.
4. Presionar `Ingresar`.

Si las credenciales son correctas, el usuario será enviado al dashboard privado. Si ocurre un error, la pantalla mostrará un mensaje indicando el problema.

La sesión se guarda usando el token devuelto por el backend. Las rutas privadas solo se pueden consultar cuando existe una sesión válida.

### Dashboard Principal

El dashboard es la pantalla principal después de iniciar sesión. Desde allí el usuario puede revisar un resumen de su cuenta.

En el dashboard se muestra:

- Saludo con el nombre del usuario autenticado.
- Saldo total estimado.
- Saldos por divisa.
- Accesos rápidos para agregar saldo, retirar saldo y cambiar divisa.
- Resumen de metas de ahorro.
- Últimos movimientos o transacciones.
- Botón de chatbot.

Desde esta pantalla también se puede navegar hacia metas, historial de transacciones y otras operaciones de la wallet.

### Agregar Saldo

La pantalla `Agregar saldo` permite cargar dinero en una divisa disponible.

Para agregar saldo:

1. Entrar al dashboard.
2. Seleccionar la acción para agregar saldo.
3. Elegir la divisa.
4. Escribir el monto.
5. Presionar el botón para agregar saldo.
6. Confirmar la operación en el modal.

Antes de completar la transacción, la aplicación muestra un modal de confirmación para que el usuario revise el monto y la divisa. Si confirma, el frontend envía la operación al backend.

Después de una operación exitosa, aparece un mensaje de confirmación durante unos segundos. El mensaje también informa que se envió un correo relacionado con la transacción y que el usuario puede revisar su bandeja de spam.

### Retirar Saldo

La pantalla `Retirar saldo` permite descontar dinero de la wallet.

Para retirar saldo:

1. Entrar a la opción de retiro desde el dashboard o la navegación.
2. Elegir la divisa.
3. Escribir el monto a retirar.
4. Confirmar la operación.

La operación depende del saldo disponible. Si el monto solicitado supera el saldo actual, la aplicación muestra un mensaje de error y evita completar la transacción.

### Cambiar Divisa

La pantalla `Cambiar divisa` permite convertir dinero de una moneda a otra.

Para cambiar divisa:

1. Elegir la moneda de origen.
2. Elegir la moneda de destino.
3. Escribir el monto a cambiar.
4. Revisar la información del cambio.
5. Confirmar la operación.

La aplicación se comunica con el backend para procesar la conversión. Después de confirmar, se muestra un mensaje temporal de éxito y se informa que se envió un correo sobre la transacción.

### Metas De Ahorro

La sección `Metas de ahorro` permite administrar objetivos financieros.

El usuario puede:

- Crear una nueva meta.
- Consultar metas existentes.
- Ver el progreso de cada meta.
- Aportar dinero a una meta.
- Retirar dinero de una meta.
- Ajustar el monto objetivo o la fecha límite.
- Eliminar una meta.

Cada meta muestra:

- Nombre.
- Divisa.
- Estado.
- Porcentaje de progreso.
- Monto ahorrado.
- Monto objetivo.
- Fecha límite, si existe.

Reglas importantes:

- Al ajustar una meta, el nuevo monto objetivo no puede ser menor al objetivo actual permitido.
- Si el usuario intenta guardar un valor inválido, el campo muestra un mensaje en rojo y el botón queda deshabilitado.
- Después de aportar, retirar o ajustar una meta, la información se actualiza en pantalla.

### Historial De Transacciones

La pantalla `Historial de transacciones` muestra los movimientos registrados en la wallet.

El usuario puede:

- Ver recargas.
- Ver retiros.
- Ver cambios de divisa.
- Buscar movimientos por texto.
- Filtrar por tipo de movimiento.
- Filtrar por divisa.
- Cambiar de página cuando existan varias páginas de resultados.
- Volver al dashboard con el botón `Volver al inicio`.

Esta sección ayuda a revisar qué operaciones se han realizado y cuándo ocurrieron.

### Chatbot

El chatbot aparece como un botón flotante dentro de la experiencia privada. Su propósito es brindar ayuda rápida al usuario dentro de la aplicación.

El usuario puede abrirlo, escribir una pregunta y recibir una respuesta generada mediante el servicio configurado en el backend.

### Cerrar Sesión

Para cerrar sesión:

1. Presionar el botón `Cerrar Sesión` en la navegación.
2. Revisar el modal de confirmación.
3. Confirmar la salida.

Cuando se cierra sesión, la aplicación elimina la información local de autenticación y redirige al usuario a la experiencia pública.

## Manual De Decisiones Técnicas

### React

Se usó React porque permite construir interfaces por componentes reutilizables. Esto ayuda a separar pantallas, formularios, tarjetas, botones, navbar, footer y elementos comunes sin duplicar lógica visual.

React también facilita manejar estados de interfaz como modales, formularios, mensajes de éxito, errores y menús responsive.

### TypeScript

Se usó TypeScript para reducir errores durante el desarrollo. En este proyecto es especialmente útil porque existen contratos con el backend, por ejemplo:

- Usuario autenticado.
- Wallet.
- Balance por divisa.
- Transacciones.
- Metas de ahorro.
- Respuestas de acciones como aportar, retirar o cambiar divisa.

Tipar estas respuestas permite detectar cambios incorrectos antes de ejecutar la aplicación.

### Vite

Se usó Vite porque ofrece un entorno de desarrollo rápido, simple y moderno para React. Permite levantar el proyecto localmente con buena velocidad y generar builds optimizados para producción.

También facilita el uso de variables de entorno con el prefijo `VITE_`.

### React Router DOM

Se usó React Router DOM para manejar la navegación de la aplicación. El proyecto tiene rutas públicas y privadas:

- Rutas públicas: landing, login y registro.
- Rutas privadas: dashboard, wallet, metas e historial.

Además, se implementaron guards para controlar quién puede entrar a cada sección.

### Context, Provider Y Hooks

La autenticación se organiza con `AuthContext`, `AuthProvider` y `useAuth`.

Esta decisión evita pasar información de sesión manualmente por props en muchas capas. Cualquier componente que necesite saber si el usuario está autenticado puede consumir el hook `useAuth`.

La separación es:

- `context`: define el contrato del contexto.
- `providers`: contiene la lógica que entrega el estado global.
- `hooks`: expone una forma sencilla y controlada de consumir ese estado.

### Servicios API

Las llamadas al backend están centralizadas en `src/services` y usan `apiRequest` desde `src/api.ts`.

Esta decisión permite:

- Evitar repetir `fetch` en cada pantalla.
- Reutilizar headers de autenticación.
- Manejar errores de API de forma consistente.
- Mantener las pantallas enfocadas en UI y flujo de usuario.

### CSS Modular Por Componente

El proyecto usa archivos CSS cercanos a cada componente o página. Por ejemplo, una pantalla tiene su archivo `.css` en la misma carpeta.

Esto ayuda a:

- Encontrar rápido dónde modificar estilos.
- Evitar archivos gigantes difíciles de mantener.
- Mantener coherencia visual por sección.

### Vitest Y Testing Library

Se usó Vitest para pruebas unitarias porque se integra muy bien con Vite y TypeScript. Testing Library se usó para probar componentes desde la perspectiva del usuario.

La combinación permite probar:

- Validaciones.
- Servicios de API.
- Guards de rutas.
- Formularios de login y registro.
- Pantallas principales.
- Componentes reutilizables.

### Vercel

El proyecto incluye configuración para deploy en Vercel. Al usar React Router con rutas del lado del cliente, `vercel.json` ayuda a que al refrescar rutas internas como `/app/metas` o `/app/historial` no se produzca un error 404.

## Estructura Del Proyecto

```txt
PF-Frontend/
├── public/
├── src/
│   ├── assets/
│   ├── auth/
│   ├── components/
│   ├── context/
│   ├── design/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── providers/
│   ├── router/
│   ├── routes/
│   ├── services/
│   ├── test/
│   ├── tests/
│   ├── types/
│   └── utils/
├── .env.example
├── package.json
├── tsconfig.json
├── vercel.json
└── vite.config.ts
```

Descripción de carpetas principales:

- `public`: recursos estáticos públicos.
- `src/assets`: imágenes, íconos u otros recursos usados por la aplicación.
- `src/auth`: piezas relacionadas con autenticación.
- `src/components`: componentes reutilizables como navbar, botones, formularios, tarjetas y chatbot.
- `src/context`: definición de contextos globales, como el contexto de autenticación.
- `src/design`: referencias visuales utilizadas durante el diseño de pantallas.
- `src/hooks`: hooks personalizados, por ejemplo `useAuth`.
- `src/layouts`: layouts compartidos, como la estructura privada con navbar.
- `src/pages`: pantallas completas de la aplicación.
- `src/providers`: providers que entregan estado global a la aplicación.
- `src/router`: configuración de rutas y guards.
- `src/routes`: espacio reservado para organización de rutas si se amplía el proyecto.
- `src/services`: funciones que se conectan con el backend.
- `src/test`: utilidades para pruebas.
- `src/tests`: espacio para pruebas generales o auxiliares.
- `src/types`: tipos compartidos.
- `src/utils`: funciones reutilizables de validación o transformación de datos.

## Rutas Principales

| Ruta | Acceso | Descripción |
| --- | --- | --- |
| `/` | Pública | Landing page de Swap-Coin. |
| `/login` | Pública | Inicio de sesión. |
| `/registro` | Pública | Registro de usuario. |
| `/app/dashboard` | Privada | Resumen principal de la wallet. |
| `/app/agregar-saldo` | Privada | Agregar saldo a la wallet. |
| `/app/retirar` | Privada | Retirar saldo de la wallet. |
| `/app/cambiar-divisa` | Privada | Cambiar dinero entre divisas. |
| `/app/metas` | Privada | CRUD de metas de ahorro. |
| `/app/historial` | Privada | Historial de transacciones. |
| `/app/comprar` | Privada | Ruta placeholder para compra de divisa. |

## Instalación Y Ejecución Local

Requisitos recomendados:

- Node.js instalado.
- npm instalado.
- Git instalado.

Pasos:

```bash
npm install
cp .env.example .env
npm run dev
```

En PowerShell también se puede copiar el archivo de entorno con:

```powershell
Copy-Item .env.example .env
```

Después de ejecutar `npm run dev`, Vite mostrará una URL local en la terminal. Normalmente será:

```txt
http://localhost:5173
```

## Variables De Entorno

El proyecto usa un archivo `.env` local para configurar la URL base del backend.

Archivo `.env.example`:

```env
VITE_API_URL=https://coin-swap-backend-production.up.railway.app
```

Para trabajar localmente:

1. Copiar `.env.example`.
2. Crear un archivo `.env`.
3. Mantener la variable `VITE_API_URL` apuntando al backend correspondiente.

Importante:

- No se deben guardar credenciales privadas en el frontend.
- No se debe colocar la URL de conexión directa a PostgreSQL en `.env` del frontend.
- Las claves privadas, credenciales de base de datos y secretos deben vivir únicamente en el backend o en el panel seguro del proveedor de despliegue.

## Scripts Disponibles

| Script | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo. |
| `npm run build` | Compila TypeScript y genera la versión de producción. |
| `npm run preview` | Sirve localmente el build de producción. |
| `npm run lint` | Ejecuta ESLint. |
| `npm run test` | Ejecuta Vitest en modo interactivo. |
| `npm run test:run` | Ejecuta la suite de pruebas una sola vez. |
| `npm run test:coverage` | Ejecuta pruebas y genera reporte de cobertura. |

## Instrucciones Para Clonar El Repositorio

Para clonar el proyecto desde GitHub:

```bash
git clone <URL_DEL_REPOSITORIO>
cd PF-Frontend
npm install
cp .env.example .env
npm run dev
```

En Windows con PowerShell:

```powershell
git clone <URL_DEL_REPOSITORIO>
cd PF-Frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Si se quiere trabajar sobre la rama `developer`:

```bash
git checkout developer
git pull origin developer
```

Si se quiere crear una rama de trabajo desde `developer`:

```bash
git checkout developer
git pull origin developer
git checkout -b feature/nombre-de-la-tarea
```

## Flujo Recomendado De Trabajo Con Git

El flujo sugerido para el equipo es:

1. Mantener `main` como rama estable.
2. Usar `developer` como rama base de integración.
3. Crear subramas desde `developer` para cada funcionalidad.
4. Hacer commits pequeños y descriptivos en inglés.
5. Subir la subrama a GitHub.
6. Crear Pull Request hacia `developer`.
7. Revisar y hacer merge desde GitHub.
8. Eliminar la subrama cuando ya no se necesite.

Ejemplo:

```bash
git checkout developer
git pull origin developer
git checkout -b feature/example
git add .
git commit -m "feat: add example feature"
git push -u origin feature/example
```

## Pruebas

El proyecto usa Vitest y Testing Library.

Para ejecutar todas las pruebas:

```bash
npm run test:run
```

Para ejecutar pruebas en modo desarrollo:

```bash
npm run test
```

Para generar cobertura:

```bash
npm run test:coverage
```

Las pruebas actuales cubren:

- Validaciones de autenticación.
- Servicios de API.
- Manejo de sesión.
- Formularios de login y registro.
- Guards de rutas públicas y privadas.
- Dashboard.
- Metas de ahorro.
- Historial de transacciones.
- Componentes reutilizables de UI.
