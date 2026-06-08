# Qualidade e testes

O projeto tem testes focados nas partes que mais poderiam quebrar o uso real:

- catálogo;
- parser de códigos;
- contagem de figurinhas;
- repetidas;
- textos compartilháveis;
- assets públicos do PWA;
- deploys em produção.

## Rodar testes

```bash
npm test
```

No ambiente atual, quando `npm` não está disponível, os testes podem ser rodados
com Node diretamente:

```bash
node tests/core.test.mjs
node tests/public-smoke.test.mjs
```

## Testes principais

## `tests/core.test.mjs`

Valida regras internas:

- catálogo com 980 figurinhas;
- 48 seleções mais especiais `FWC`;
- normalização de códigos;
- entradas como `BRA 1`, `ARG10`, `USA12x2`;
- inválidos sendo ignorados;
- cálculo de repetidas;
- comparação de troca.

## `tests/public-smoke.test.mjs`

Valida produção:

- Vercel responde;
- Netlify responde;
- `index.html` usa assets versionados;
- CSS, JS, Core, Manifest, Service Worker e ícone estão acessíveis;
- PWA está configurado;
- não há dependências externas obrigatórias além do link opcional de WhatsApp.

## QA manual realizado

- abertura do app em URL pública;
- inspeção de DOM;
- console sem erros;
- fluxo principal visível;
- deploy confirmado em Vercel e Netlify.

## Riscos conhecidos

- Entrada por voz depende do suporte do navegador.
- Área de transferência depende de permissão do navegador.
- Dados locais podem ser apagados se o usuário limpar dados do navegador.
- Funcionalidades sociais futuras exigem backend e moderação.
