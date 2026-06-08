# Publicação

Este projeto é um PWA estático. Para a fase atual, o caminho mais simples é publicar
os arquivos da raiz em uma CDN estática. Assim o app continua funcionando mesmo com
muita gente acessando ao mesmo tempo, porque não existe servidor de aplicação para
processar cada clique.

## Recomendação prática

1. Vercel: bom para deploy por Git, preview automático e domínio rápido.
2. Netlify: bom para deploy manual por pasta e deploy contínuo por Git.
3. GitHub Pages: bom quando o código já estiver em um repositório GitHub.

## Estado atual

- Build command: nenhum.
- Publish directory: raiz do projeto.
- Arquivo principal: `index.html`.
- PWA/offline: `service-worker.js`.
- Configs incluídas: `vercel.json`, `netlify.toml`, `_headers`, `.nojekyll`.

## Limite importante

Esta versão não tem cadastro nem sincronização em nuvem. Os dados ficam no aparelho
da pessoa. Isso é intencional para publicar rápido e evitar coleta de dados sensíveis.
Quando entrar perfil, encontros e lista de pessoas próximas, será necessário backend,
login, moderação e regras de segurança.
