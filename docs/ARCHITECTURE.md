# Arquitetura

O TrocaFigs 26 foi implementado como PWA estático, sem backend nesta primeira
fase. Essa decisão reduz custo, simplifica publicação e permite que o app rode em
Vercel, Netlify, GitHub Pages ou qualquer hospedagem estática.

## Camadas

## `core.mjs`

Contém a lógica independente da interface:

- catálogo de figurinhas;
- normalização de texto;
- parser de códigos;
- cálculo de progresso;
- controle de quantidades;
- geração de listas de faltantes e repetidas;
- comparação de trocas.

Essa separação permite testar as regras sem depender do navegador.

## `app.js`

Conecta a lógica ao DOM:

- carrega e salva estado em `localStorage`;
- renderiza estatísticas;
- renderiza grupos e cards de figurinhas;
- controla filtros;
- gera textos para WhatsApp;
- executa importação/exportação de backup;
- registra o Service Worker.

## `styles.css`

Define a experiência visual:

- layout responsivo;
- navegação mobile;
- cards de figurinhas;
- estados de tenho/falta/repetida;
- modo pacote;
- acessibilidade visual por foco e contraste.

## `service-worker.js`

Mantém o app disponível offline depois do primeiro acesso:

- cacheia o shell do app;
- remove caches antigos;
- tenta rede primeiro e cai no cache se estiver offline.

## Persistência

Os dados ficam em `localStorage` no formato:

```js
{
  version: 1,
  catalogVersion: "2026-06-08",
  counts: {
    "BRA 1": 1,
    "USA 12": 2
  },
  profile: {
    name: "",
    city: "",
    meetup: ""
  },
  updatedAt: "..."
}
```

## Limite intencional

Não há backend, login ou sincronização. Isso é adequado para a primeira versão,
mas recursos sociais como mapa, chat e encontros exigirão outra arquitetura.
