# docs.oblikovati.org

The documentation website for [Oblikovati](https://website-oblikovati.org), built with
[Docusaurus](https://docusaurus.io/) 3.10. Dark-first brand theme, i18n (English,
Português-BR, Español), Lua code highlighting, docs versioning, published as a
DigitalOcean App Platform static site.

## Local development

Requires Node 20 (see `.nvmrc`).

```bash
npm install
npm run start          # dev server with hot reload (default locale)
npm run start -- --locale pt-BR   # preview a specific locale
npm run build          # production build of every locale into build/
npm run serve          # serve the production build locally
```

## Structure

```
docs/                     Documentation content (served at the site root)
src/css/custom.css        Brand theme (Infima variable overrides + fonts)
src/components/KeyboardMap ISO keyboard SVG + shortcut tables component
src/data/keybindings.json  Generated shortcut data (see below)
static/img/               Logo + favicons (from website-oblikovati.org)
i18n/{pt-BR,es}/          Locale content + UI-string translations
```

## Translations

UI strings (theme labels, etc.) are generated per locale:

```bash
npm run write-translations -- --locale pt-BR
npm run write-translations -- --locale es
```

Translated doc pages live under
`i18n/<locale>/docusaurus-plugin-content-docs/current/`; any page not translated there
falls back to its English version.

## Keyboard-shortcut data

`src/data/keybindings.json` is **generated** from the application so the published
shortcuts never drift from what ships. It is produced by the `keymap-dump` tool in the
[Oblikovati](https://github.com/Oblikovati) repo. Regenerate it after any default chord or
command alias changes:

```bash
# from a checkout of the Oblikovati application repo
go run ./cmd/keymap-dump > /path/to/docs.oblikovati.org/src/data/keybindings.json
```

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds the site and then
triggers a DigitalOcean App Platform deployment via `doctl`.

### One-time bootstrap

1. Create an App Platform **static site** app pointing at this repo, with build command
   `npm run build` and output directory `build`.
2. Note the app id (`doctl apps list`).
3. Add two GitHub repository secrets:
   - `DIGITALOCEAN_ACCESS_TOKEN` — a DO API token with app write access
   - `DO_APP_ID` — the app id from step 2

Pull requests run `.github/workflows/ci.yml`, which builds every locale as a merge gate.
