# Briefing para redesign do TrocaFigs 26

## Contexto

O TrocaFigs 26 e um PWA independente para colecionadores controlarem figurinhas:

- marcar as que ja possui;
- ver as que faltam;
- registrar repetidas;
- comparar trocas;
- compartilhar listas por WhatsApp;
- funcionar bem em celular, tablet e desktop.

O produto deve parecer divertido, desejavel e simples para criancas, adolescentes e adultos. A versao atual funciona, mas o dono do produto nao gostou do layout por ainda parecer muito "quadrado", generico e com cara de dashboard.

## Objetivo do redesign

Criar uma interface visualmente mais forte, moderna e prazerosa de usar, com cara de app de colecao/album, nao de painel administrativo.

Prioridades:

1. Mobile-first.
2. Visual mais divertido e colecionavel.
3. Menos blocos retangulares grandes.
4. Cards de figurinha mais bonitos e menores.
5. Modo rapido de cadastrar figurinhas com destaque.
6. Navegacao intuitiva para criancas/adolescentes.
7. Bom contraste e acessibilidade.
8. Sem usar imagens, logos, escudos, marcas oficiais ou material protegido.

## Fluxo principal

O usuario normalmente faz isso:

1. Abre varios pacotes/envelopes.
2. Digita, cola ou fala codigos das figurinhas.
3. O app marca automaticamente o que tem.
4. Se ja tinha, vira repetida.
5. O usuario ve faltantes/repetidas.
6. Compartilha lista no WhatsApp ou compara com outro colecionador.

## Referencias funcionais

Ideias a considerar, sem copiar marca ou assets:

- Faltan: acompanhamento de progresso, offline, leitura por camera.
- Scanini: entrada por voz e colagem de lista em texto livre.
- Figuri: troca entre pessoas, mapa e comunidade.
- Menjalica: foco em troca segura e lista de faltantes/repetidas.

## O que evitar

- Nao usar logos, imagens, mascotes, nomes ou materiais oficiais protegidos.
- Nao parecer dashboard corporativo.
- Nao usar blocos enormes sem personalidade.
- Nao esconder as acoes principais.
- Nao criar layout que dependa de imagens externas.

## Arquivos principais

- `index.html`: estrutura da tela.
- `styles.css`: visual principal. Este e o arquivo mais importante para redesenhar.
- `app.js`: interacoes e renderizacao dos cards.
- `core.mjs`: dados, parser, regras de negocio e textos compartilhados.
- `manifest.webmanifest` e `service-worker.js`: PWA/offline.

## Regras tecnicas

- Manter HTML/CSS/JS puro.
- Nao adicionar dependencias pesadas sem necessidade.
- Manter app funcionando offline.
- Manter responsivo.
- Preservar ids usados pelo JS: `quickInput`, `quickAddButton`, `albumGroups`, `missingText`, `dupesText`, `friendDupesInput`, `friendMissingInput`, etc.
- Pode alterar classes, layout, CSS e markup visual, mas cuidado para nao remover elementos que o JS usa.

## Entrega esperada

Pode devolver:

1. `index.html` atualizado.
2. `styles.css` atualizado.
3. Alteracoes pontuais em `app.js`, se precisar mudar a renderizacao dos cards.

Se mexer em imports/cache, atualizar as query strings de versao no `index.html`, `app.js` e `service-worker.js`.
