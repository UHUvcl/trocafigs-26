# TrocaFigs 26

PWA independente para organizar figurinhas, faltantes e repetidas de uma colecao de futebol 2026.

## Rodar localmente

```bash
npm test
npm start
```

Abra `http://localhost:5173`.

Sem npm, no Mac, use o arquivo `Abrir_TrocaFigs.command`.

## Escopo

- Funciona offline depois do primeiro carregamento.
- Salva os dados no proprio aparelho via `localStorage`.
- Compartilha listas por WhatsApp usando texto simples.
- Exporta e importa backup em JSON.
- Nao usa imagens, logos, emblemas ou assets oficiais.
- Pode ser publicado como site estatico em Vercel, Netlify ou GitHub Pages.

## Fontes usadas para a base 2026

- FIFA: lista das 48 selecoes classificadas para 2026.
- Panini Group: estrutura publica da colecao principal, com 48 selecoes, 20 figurinhas por selecao, 20 especiais FWC e 980 figurinhas no total.

As informacoes foram conferidas em 2026-06-08. O app permite ajustar/importar dados para lidar com variacoes regionais ou futuras mudancas.
