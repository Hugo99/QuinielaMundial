# ⚽ Quiniela Mundial 2026

App interna de quiniela para la oficina. Resultados en tiempo real via ESPN.

## Setup rápido

```bash
npm install
npm run dev
```

Abre http://localhost:5173

## Deploy a GitHub Pages

### Opción A — Manual

```bash
npm install
npm run build
```

Sube la carpeta `dist/` a la rama `gh-pages` de tu repo, o usa la acción de abajo.

### Opción B — GitHub Actions (automático)

Crea el archivo `.github/workflows/deploy.yml` con este contenido y cada push a `main` despliega solo:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

Luego en tu repo: **Settings → Pages → Source → Deploy from branch → gh-pages**

Tu quiniela quedará en: `https://<tu-usuario>.github.io/<nombre-repo>/`

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor local con hot-reload |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Preview del build local |
