# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [2.0.0] — 2026-04-24 — Sprint 2

### US#100 — Global air quality dashboard

- Dashboard page (`/`) replacing the previous placeholder with a full single-screen summary
- Stats row with 4 `MetricCard` blocks: `salles_actives` (derived from zones count), `capteurs_en_ligne` (online/total ratio), `pm2.5_moyen` (avg µg/m³), `alertes_actives` (alert count)
- `useDashboard` composable fetching `GET /api/dashboard`, mapping raw API fields to typed `DashboardStats` and exposing `alerts`, `loading`, `error`, `refresh`
- Searchable zone grid filtered by name, building or floor; sorted worst-first (`mauvais → moyen → bon`); empty state when no zones match
- `> system_logs` terminal section embedded at the bottom using `LogTerminal` in `compact` mode, wired to `useLogs()` with a `voir_tout →` link to `/logs`
- `AuthGate` removed from the dashboard — page is publicly accessible
- `MetricCard` extended with optional `showBadge` (default `true`) and `showBar` (default `true`) boolean props to match design
- `DashboardTerminal` placeholder component deleted — replaced by the real `LogTerminal`
- Auto-refresh every 10 s for zones, dashboard stats and logs independently via `useAutoRefresh`
- Loading and error states for both the stats row and the zone grid
- 11 page tests covering title, stats labels and values, zone grid rendering, search filter, empty state, `system_logs` header and live log entries

### US#47 — System logs terminal page

- New `/logs` page rendering the system log stream in a terminal-style card (topbar with mac-style dots + prompt text + online indicator, rows `timestamp | level badge | payload`, blinking prompt footer, empty state)
- `LogTerminal` reusable component with `compact` prop prepared for future embedded usage
- `LogLevelBadge` component with 5 levels: DEBUG (blue), INFO (green), RECV (green), WARN (amber), ERROR (red)
- `useLogs` composable fetching `/api/logs` with Bearer token, mapping API fields (`event_type → level`, `node_id → nodeId`), and exposing `bufferUsed` / `bufferCapacity` metrics
- Auto-refresh every 5s via `useAutoRefresh` (shorter cadence than zones page to feel real-time)
- Client-side level filter (`USelectMenu multiple`) and clear button (hides current entries; new polled entries appear normally)
- `LogEntry` and `LogLevel` types added
- Sidebar: `logs` entry moved from `administration` to `monitoring` section, accessible to all authenticated users (matches design)
- New utility classes `.bg-airq-blue-bg` and `.bg-airq-blue-primary` for the DEBUG badge
- Tests: `useLogs` (2), `LogLevelBadge` (5 levels), `LogTerminal` (5), page `/logs` (4)

### US#12 — Manage sensors

- Admin page (`/capteurs`) listing all sensors with sortable table columns (id_tag, modèle, zone, status, batterie, dernière_activité)
- Search bar filtering sensors by id_tag, deviceEui, model or zone name
- Add/edit modal with fields `id_tag`, `deviceEui`, `model`, `zone_id` (select from existing zones) and `status` (select actif/inactif/erreur)
- Inline field validation with LoRaWAN regex `^0x[0-9A-Fa-f]{16}$` on `deviceEui`
- Delete confirmation modal with irreversibility warning
- `useAdminSensors` composable fetching `/api/nodes` with Bearer token and mapping to the typed `Sensor` interface (extended with admin-only optional fields `idTag`, `zoneId`, `batteryPct`)
- `useCrudModals<TItem, TForm>` generic composable factorising add/edit/delete modal state, close-watchers and toast feedback; consumed by both `/zones/gestion` and `/capteurs`
- `/zones/gestion` refactored to consume `useCrudModals` (behaviour unchanged, 52 lines removed)
- `mapNodeStatus` now also handles `LIVE` and `ERROR` statuses (aligning with the OpenAPI `NodeStatus` enum)
- 10 page tests and 2 composable tests (loading, filter, modals, validation, delete confirm, error state)

### Issue #94 — Zone without sensors shows "mauvais" and fake charts

- `AirQuality` type extended with `'inconnu'` state
- Zones with `node_count === 0` now map to `'inconnu'` instead of `'mauvais'` in `useZones`
- `useChartData` returns `null` when no baseline measurements are provided, avoiding fabricated series
- `QualityBadge` renders `'inconnu'` with neutral (muted) styling
- `MetricCard` renders a neutral progress bar for `'inconnu'` quality
- `ZoneBarChart` shows an "aucune mesure disponible" empty state when no chart data
- `/graphiques` shows an empty state when the selected zone has no chart data
- `zones/[id]` page message adapted to distinguish `'inconnu'` (no sensors) from `'mauvais'` (offline)

### US#70 — Zone management page

- Zone management page (`/zones/gestion`) with sortable table (nom, étage, bâtiment, qualité air, capteurs)
- Search/filter bar filtering zones by nom, étage or bâtiment in real time
- Add/edit modal with form fields (nom, bâtiment, étage, description) using `airq-input` styling
- Delete confirmation modal with irreversibility warning
- `AuthGate` protection on the management page
- `PageHeader` with breadcrumb (ROOT → ZONES → GESTION) and action button in `#title-extras` slot
- `UModal` replacing custom `<Teleport>` modals; `watch()` resets modal state on backdrop/Escape close
- `UInput` for the search field with leading icon
- Polling every 10 seconds to keep quality badges live (same as index page)
- 6 page tests covering loading state, zone display, search filter, page title, and modal triggers

### US#71 — Authentication and conditional display

- Login page (`/login`) with username/password form, session expired warning, and password toggle
- `useAuth` composable with JWT decode, cookie persistence, and token expiration check
- Mock user database (`scripts/users.json`) with per-user JWT generation
- Auth middleware protecting admin routes (`/capteurs`, `/gestion-zones`, `/alertes`, `/logs`)
- Auth interceptor plugin injecting Bearer token and handling 401 responses
- Conditional sidebar: monitoring only when anonymous, administration + user info when admin
- Role-based access: viewer role has same access as anonymous (no admin section)
- `AuthGate` component showing lock screen for unauthenticated users on `/zones`, `/zones/:id`, `/graphiques`
- Mock server validates credentials and returns 401 for invalid login attempts
- 11 auth tests (useAuth composable + login page)

### US#69 — Display sensors data

- Handle sensor click (event + active selection)
- Synchronize UI state with the URL
- Add a visual indicator for the active sensor
- Implement refresh while preserving the selected sensor
- Display dynamic sensor data (dynamic data is generated based on room data). If a room has multiple sensors, the average of the sensor values determines the room’s values.

### US#6 — View air quality for a zone

- Add responsive design management for the "graphiques" page and the "zone/id" page.
- Add coherence between the graphics colors

## [1.0.0] — 2026-03-31 — Sprint 1

### US#9 — Generate evolution charts for a zone

- `/graphiques` page with 5 line charts per zone
- `ZoneChart` component wrapping Chart.js Line via vue-chartjs
- `useChartData` composable generating mock time series
- Zone dropdown selector and time period tabs (24h, 7j, 30j, 1a)
- Chart types: `TimePeriod`, `MetricKey`, `ChartSeries`, `ZoneChartData`
- 24h evolution charts on zone detail page (environment + particulates)
- Tests for composable, component and page

### US#6 — View air quality for a zone

- Zone detail page `/zones/[id]` with air quality measurements
- MetricCard and QualityBadge components
- Mock composables: useZone, useMeasurements, useSensors, useZones
- TypeScript types for the domain (Zone, Measurement, Sensor)
- Clickable breadcrumbs (ROOT → dashboard, ZONES → list)
- Random generation values for the zone data
- Implemented the graphics for the time values in the time, and automatically synced with the zone data
- Time scales for the graphics (1m, 5m, 1h, 24h, 7j, 30j, 1a)

### US#7 — Class management

- Sidebar navigation with logo, monitoring/administration sections, user info and dark mode toggle
- Collapsible sidebar with auto-collapse below 1024px and toggle button
- Zones accordion in sidebar with sub-zone navigation and selection indicator
- Sidebar 240px layout + flexible content area
- Semantic design tokens (backgrounds, borders, text, status, radius) with light/dark support from `design.pen`
- Dashboard placeholder and custom error page (404/500/403) matching design system
- Responsive chart grids (auto-fit with minmax) and scrollable sensor tables
- Component refactoring (MetricCard, QualityBadge) to use semantic tokens
- Routes renamed from `/zone/:id` to `/zones/:id` for consistency
- Unit tests for `AppSidebar` component
- Removed unused `AppLogo` component and Nuxt UI starter template content

### US#13 — Frontend unit tests

- Vitest testing environment with project-based config (unit + nuxt)
- AppSidebar tests (5 tests)

### US#14 — GitLab CI/CD pipeline

- GitLab CI pipeline with lint, typecheck and test stages

### US#15 — Mock server

- Mock server integration with dynamic route mocking
- MockServer migrated from JavaScript to TypeScript
- Improved type safety with recursive `JsonValue` type

## [Unreleased]

### chore/code-refactor — UI polish & CSS architecture

- ITCSS architecture: extracted `main.css` into `settings/tokens.css`, `components/card.css`, `components/input.css`, `utilities/text.css`, `utilities/background.css`
- CSS utility classes `text-airq-*` and `bg-airq-*` replacing inline `text-[var(--airq-*)]` throughout all templates
- New utility files `utilities/border.css` and `utilities/radius.css`; `text.css` and `background.css` extended with status colour classes
- Complete token migration: all remaining `[var(--airq-*)]` inline syntax replaced with utility classes across all Vue files
- Nuxt UI neutral color fixed: `neutral: 'slate'` → `neutral: 'neutral'` in `app.config.ts` (removes blue tint on hover states)
- Nuxt UI dark mode primary color fixed: `--ui-primary` override in `.dark` prevents auto-switch to shade-400
- `UBreadcrumb` separator replaced with plain text `<span>/</span>` slot instead of SVG icon
- `USelect` dropdown styling fixed with explicit UI keys (`content`, `viewport`, `item`, `itemLabel`)
- `QualityBadge` ring removed with `!ring-0` on subtle variant
- Hover states corrected: sidebar collapse button, error page back button, ZoneBarChart active period, graphiques active period tab
- `AppSidebar`: collapse button pinned to bottom, color mode toggle and logout hidden in collapsed state, accordion and admin section gated by auth/role; accordion chevron green
- Native `<table>` replaced with `UTable` in `zones/[id].vue`
- Native `<button>` replaced with `UButton` in `graphiques.vue`
- Login page: back-to-app link added

### Added

- Semantic design tokens (backgrounds, borders, text, status, radius) with light/dark support
- Color palettes: green, amber, red, blue
- design.pen file as UI source of truth
- Sidebar navigation with logo, monitoring/administration sections, user info and dark mode toggle
- Collapsible sidebar with auto-collapse below 1024px and toggle button
- Zones accordion in sidebar with selection indicator
- Sidebar 240px layout + flexible content area
- Dashboard placeholder page
- Custom error page (404/500/403) with terminal style
- Responsive chart grids (auto-fit with minmax)
- Horizontally scrollable sensor table on small screens

### Changed

- Routes renamed from `/zone/:id` to `/zones/:id` for consistency
- MetricCard and QualityBadge use semantic CSS tokens
- Dark mode button hover uses design system tokens

### Removed

- Nuxt UI starter template content (TemplateMenu, marketing pages)
- AppLogo component (replaced by logo in sidebar)
