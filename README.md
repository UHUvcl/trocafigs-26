# TrocaFigs 26

PWA independente para organizar figurinhas da coleção 2026, controlar faltantes,
registrar repetidas e facilitar trocas por WhatsApp.

> Projeto pessoal de estudo, portfólio e prática de desenvolvimento web. Não é um
> app oficial e não utiliza imagens, logos, escudos ou materiais protegidos.

## Acesse

- Produção Vercel: <https://trocafigs-26.vercel.app/>
- Produção Netlify: <https://coruscating-biscochitos-f68126.netlify.app/>
- Repositório: <https://github.com/UHUvcl/trocafigs-26>

## Por que criei

A ideia nasceu observando crianças e conhecidos colecionando figurinhas: muitas
listas em papel, prints no WhatsApp, repetidas difíceis de organizar e dúvidas
sobre o que ainda faltava para completar o álbum.

O objetivo foi transformar esse processo em uma ferramenta simples, rápida e
acessível para todas as idades.

## Funcionalidades

- Marcar figurinhas que a pessoa já possui.
- Ver automaticamente as figurinhas faltantes.
- Registrar repetidas para troca.
- Adicionar várias figurinhas de uma vez pelo modo pacote.
- Colar listas em texto livre.
- Usar entrada por voz quando o navegador permitir.
- Compartilhar listas pelo WhatsApp.
- Comparar possíveis trocas com outra pessoa.
- Exportar e importar backup em JSON.
- Funcionar como PWA instalável.
- Continuar funcionando offline depois do primeiro carregamento.
- Salvar dados localmente no aparelho, sem exigir cadastro.
- Acompanhar acessos gerais pelo Web Analytics do Netlify.

## Stack

- HTML semântico
- CSS responsivo
- JavaScript modular
- PWA com `manifest.webmanifest`
- Service Worker para cache/offline
- `localStorage` para persistência local
- Deploy estático em Vercel e Netlify
- Testes com Node.js usando `node:assert`

## Arquitetura

Arquivos principais:

- `index.html`: estrutura da aplicação.
- `styles.css`: identidade visual e responsividade.
- `app.js`: eventos, renderização de telas e integração com o DOM.
- `core.mjs`: regras de negócio, catálogo, parser, estatísticas e textos.
- `service-worker.js`: cache offline e atualização de assets.
- `manifest.webmanifest`: configuração PWA.
- `tests/`: testes de regras e smoke tests públicos.
- `docs/ANALYTICS.md`: acompanhamento de acessos e limites de medição.

Mais detalhes em [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Como rodar localmente

```bash
npm test
npm start
```

Abra:

```text
http://localhost:5173
```

Sem `npm`, no macOS, também dá para abrir com:

```text
Abrir_TrocaFigs.command
```

## Testes

```bash
npm test
```

A suíte cobre:

- tamanho e consistência do catálogo;
- parser de códigos como `BRA1`, `ARG 10`, `USA12x2`;
- contadores de tenho/faltam/repetidas;
- geração de listas para WhatsApp;
- arquivos PWA;
- URLs públicas em Vercel e Netlify;
- ausência de dependências externas obrigatórias.

Detalhes em [docs/QUALITY.md](docs/QUALITY.md).

## Deploy

O projeto é estático e não precisa de servidor de aplicação. Qualquer push na
branch `main` atualiza os deploys conectados.

- Build command: nenhum.
- Publish directory: raiz do projeto.
- Arquivo principal: `index.html`.

Detalhes em [DEPLOY.md](DEPLOY.md).

## Analytics

O Web Analytics do Netlify está ativo para acompanhar pageviews, visitantes
únicos, origens, países, páginas acessadas e erros 404 sem instalar scripts de
terceiros no app.

Detalhes em [docs/ANALYTICS.md](docs/ANALYTICS.md).

## Privacidade e segurança

Esta versão não exige login e não envia dados pessoais para um backend. As
figurinhas marcadas ficam no próprio aparelho via `localStorage`.

Isso foi uma decisão consciente para:

- publicar rápido;
- reduzir complexidade;
- evitar coleta desnecessária de dados;
- tornar o app seguro para uso inicial por crianças, adolescentes e famílias.

Funcionalidades futuras como perfis, mapa, encontros e chat exigem autenticação,
moderação e regras de segurança.

## Aprendizados demonstrados

Este projeto foi criado como exercício prático de desenvolvimento e portfólio.
Ele demonstra:

- modelagem de dados no front-end;
- manipulação de estado local;
- parser de entrada textual;
- UX para fluxo de uso real;
- PWA/offline;
- deploy estático;
- versionamento com Git;
- automação de testes;
- preocupação com privacidade e direitos de uso.

Mais detalhes em [docs/LEARNING_NOTES.md](docs/LEARNING_NOTES.md).

## Roadmap

- Melhorar ainda mais a experiência visual.
- Adicionar importação de listas em mais formatos.
- Criar grupos privados de troca.
- Evoluir comparação inteligente entre colecionadores.
- Avaliar leitura por câmera/OCR.
- Avaliar backend com login e sincronização.
- Planejar moderação antes de qualquer recurso público de localização.

Veja [docs/ROADMAP.md](docs/ROADMAP.md).

## Base de dados

A base inicial usa 980 códigos:

- 20 especiais `FWC`;
- 48 seleções;
- 20 códigos por seleção.

As informações foram conferidas em 2026-06-08 a partir de fontes públicas. O app
foi estruturado para permitir ajustes caso existam variações regionais ou futuras
mudanças.

## Observação legal

TrocaFigs 26 é uma ferramenta independente de organização pessoal. O projeto não
usa marcas oficiais, imagens oficiais, escudos, fotos, logos ou material gráfico
protegido.
