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
src/components/CommandReference  Filterable command reference component
src/data/*.json           Generated shortcut/command data (see below)
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

## Generated data

Two data files under `src/data/` are **generated** from the application so the published
reference never drifts from what ships. Both are produced by tools in the
[Oblikovati](https://github.com/Oblikovati) repo:

| File | Feeds | Generator | Regenerate |
| --- | --- | --- | --- |
| `keybindings.json` | Keyboard Shortcuts page (`KeyboardMap`) | `cmd/keymap-dump` | `go run ./cmd/keymap-dump > .../src/data/keybindings.json` |
| `commands.json` | Commands page (`CommandReference`) | `cmd/command-dump` | `go run ./cmd/command-dump > .../src/data/commands.json` |

Run the generators from a checkout of the Oblikovati application repo after any default
chord, command word, or alias changes. `keybindings.json` holds only pressable keyboard
chords; the full command vocabulary (including typed aliases) lives in `commands.json`.

### Add-in developer docs

The **Add-in Development** section (`docs/addins/`) is synced from the sibling
[Oblikovati.API](https://github.com/Oblikovati/Oblikovati.API) repo: the developer guides from
its `docs/wiki/`, plus a per-package API reference rendered from the Go doc comments with
[gomarkdoc](https://github.com/princjef/gomarkdoc). Regenerate after the API surface or those
guides change:

```bash
go install github.com/princjef/gomarkdoc/cmd/gomarkdoc@latest
OBLIKOVATI_API_DIR=../Oblikovati.API python3 scripts/sync-addin-docs.py
```

The sync enforces the same no-third-party-product policy as the API repo; it fails if any
imported page names one.

## Deployment

The production site runs on the Hetzner K3s cluster. Pushes to `main` build an
immutable GHCR image and apply `deploy/kubernetes/production.yaml`. The GitHub
repository needs the `KUBECONFIG_HETZNER` secret. DNS must point
`docs.oblikovati.org` to the cluster before the Let’s Encrypt HTTP challenge can
complete.

The former DigitalOcean App Platform configuration was removed after migration.

The app is described declaratively in [`.do/app.yaml`](.do/app.yaml) (a Node static-site
build, output `build/`). Each push to `main` triggers a fresh deployment of the latest commit
(`doctl apps create-deployment --force-rebuild`). Changes to `.do/app.yaml` itself are applied
separately with `doctl apps update <app-id> --spec .do/app.yaml` (the deploy workflow does not
re-apply the spec, because an unchanged-spec update redeploys the previous commit).


Pull requests run `.github/workflows/ci.yml`, which builds every locale as a merge gate.
