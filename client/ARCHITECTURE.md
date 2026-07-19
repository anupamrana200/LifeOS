# LifeOS frontend foundation

This directory is a JavaScript-only Vite application. Product pages, domain services, and authentication behaviour are deliberately excluded from this foundation.

## Token source of truth

`src/theme/` holds all visual tokens. `npm run generate:theme` converts the JavaScript theme tokens into `src/styles/theme.css`, which provides CSS variables for runtime light/dark switching. Tailwind maps semantic utilities such as `bg-canvas`, `text-content-primary`, and `bg-primary` to those variables. Do not add literal colour values to components.

## Route boundaries

`routes/routeConfig.js` owns route declarations. `router.jsx` attaches layouts and guards. `ProtectedRoute` and `GuestRoute` read the dedicated authentication context rather than placing session decisions inside pages. `RouteSlot` leaves all product routes empty until feature work starts.

## Authentication

`context/AuthProvider.jsx` owns only the authenticated user, access-token reference, authentication flags, and initialization/loading flags. `services/auth/` is the exclusive API boundary for authentication pages. The Axios instance uses credentialed requests, attaches an in-memory bearer token when an API supplies one, collapses concurrent token refreshes into one request, retries a failed request once, and clears local session state if refresh fails.

The current backend uses HTTP-only access and refresh cookies, so those cookies—not browser storage—are the persistent session mechanism. The Remember Me preference is forwarded with the sign-in request for backend policy handling; no HTTP-only credential is read or stored by the frontend.

The UI and service boundary also expect `POST /auth/forgot-password`, `POST /auth/reset-password/:token`, and `POST /auth/verify-email/:token`. These endpoints need to be present server-side for recovery and verification to execute; the current local server route list contains the core session endpoints but not these three routes.

## Layout composition

`AppShell` owns the responsive sidebar, top navigation, header slot, content slot, and optional footer. Auth and landing flows use the same shell without navigation. Workspace layouts provide navigation and are specialised into Dashboard, Chat, and Settings wrappers.

## Authenticated shell

The workspace shell extends `AppShell` only; feature layouts continue to use it unchanged. `navigation.config.js` is the single source for workspace navigation and route metadata, which drives active links, automatic breadcrumbs, and default page headers. The sidebar keeps its desktop mini/expanded preference in local storage and becomes an accessible drawer with backdrop on smaller screens.

Top-bar menus, notifications, global search, and the command palette are presentation-only components under `components/layout/`. The command palette owns keyboard focus while open and responds to `Ctrl/Cmd + K` and Escape. `components/feedback/` contains generic loading, empty, and error states so feature modules do not recreate shell feedback patterns.

## Dashboard home

`pages/dashboard/DashboardHomePage.jsx` composes the dashboard from presentational components in `components/dashboard/`. Static placeholder data lives in `data/dashboard.mock.js`, preventing the dashboard from depending on backend contracts before those feature APIs are introduced. Lists accept empty data and use the shared feedback empty state; `DashboardSkeleton` is available for the eventual loading boundary.

## AI chat foundation

The chat foundation is feature-scoped: `ChatLayout` mounts `ChatProvider` only for the authenticated `/chat` route. `ChatProvider` owns mock conversation/message data, selection, typing state, and responsive panel state; it makes no network calls. `components/chat/` contains the panel, message, input, code-block, skeleton, and empty-chat primitives, while `pages/chat/ChatPage.jsx` only composes them. Message body markup is marked as markdown-ready without adding a renderer, parser, syntax highlighter, or generation integration.

## Chat backend integration

`services/chat/` separates conversation CRUD, message retrieval, and POST SSE streaming. `ChatProvider` replaces its mock transport state with server data, displays the user message immediately, appends each SSE token to a single optimistic assistant message, and merges only final metadata such as sources after persistence. The stream uses `fetch` because browser `EventSource` cannot issue the backend’s authenticated POST request; cookie credentials are included and a single refresh/retry is attempted for an initial 401.

The server does not expose rename or pin endpoints, and its stream has no event IDs or resumable cursor. The client therefore never automatically replays a failed or interrupted generation, avoiding duplicate persisted messages; its retry control safely reloads the conversation instead. Abort stops the browser stream and restores the composer. Local conversation filtering provides search without another backend endpoint.

## Document management

`DocumentProvider` is mounted only for the protected documents route. It owns server pagination, list/search/sort state, local status/date filters, selection, upload queue progress, and request cancellation. `services/documents/` maps directly to the backend list, single-file upload, metadata update, download, and delete endpoints; `components/documents/` is purely presentational. The backend processes only one file per request, so the UI accepts a multiple-file selection but dispatches each queue item as its own upload request.

The present server exposes category, search, and sorting filters but no re-index endpoint or server-side status/date filtering. It also accepts PDF, Word, Excel, and image MIME types; the upload drop zone validates that actual server contract rather than advertising unsupported TXT, Markdown, CSV, or JSON uploads.

## Settings, profile, and global search

`SettingsProvider` persists application, AI, chat, notification, appearance, and profile-draft preferences in local storage; it resolves the System theme selection through the existing theme provider. `SearchProvider` performs on-demand, backend-backed searches over conversations and documents, merges them with local route/settings actions, and stores recent search queries locally. The command palette uses that same provider for keyboard-accessible application navigation.

The current backend exposes no profile update, settings, model catalog, password change, or active-session-list endpoints. Those surfaces remain local/UI-ready without fabricating requests; current-user details and existing secure logout behavior continue to come from the authentication module.

## Conventions

- Import source modules with `@/`.
- Keep product API calls in `services/`, shared transport in `lib/`, and feature state in `store/`.
- Re-export public module APIs through `index.js` barrels.
- Add new visual primitives under `components/ui/` and semantic product components under `components/common/`.
