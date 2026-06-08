# Analytics

O projeto usa o Web Analytics nativo do Netlify para acompanhar acessos sem
adicionar scripts de terceiros ao app.

## Onde acompanhar

Painel:

```text
Netlify > coruscating-biscochitos-f68126 > Logs & metrics > Web Analytics
```

Link direto:

```text
https://app.netlify.com/projects/coruscating-biscochitos-f68126/logs-and-metrics/analytics
```

## O que o painel mostra

- Pageviews: quantas visualizacoes o app recebeu.
- Unique visitors: estimativa de visitantes diferentes.
- Top pages: quais paginas foram acessadas.
- Top sources: de onde as pessoas chegaram.
- Top locations: paises de origem dos acessos.
- Bandwidth used: volume de dados trafegado.
- Resources not found: arquivos pedidos pelo navegador que deram 404.

## Estado atual

O Web Analytics foi ativado em 2026-06-08. No momento da ativacao, o painel ja
mostrava dados das ultimas 24 horas, incluindo pageviews, visitantes unicos,
origem por pais e paginas mais acessadas.

## Limites importantes

O Netlify mede acessos do site no servidor. Ele nao mede tudo que acontece dentro
do aparelho da pessoa, como:

- quantas figurinhas foram marcadas;
- quais listas foram compartilhadas;
- quantas vezes o app foi aberto offline;
- instalacoes reais em iPhone ou Android com precisao de loja de app.

Para medir eventos internos no futuro, o projeto precisaria escolher uma camada
extra, como Plausible, Google Analytics 4, Vercel Analytics ou um backend proprio.
Essa decisao deve ser feita com cuidado por causa de privacidade, LGPD e uso por
criancas e familias.

## Instalar como PWA

Instalacoes PWA nao aparecem como "downloads" de loja. O caminho mais confiavel
para a fase atual e acompanhar:

- crescimento de visitantes unicos;
- acessos recorrentes;
- origem dos acessos;
- volume de compartilhamento manual pelo WhatsApp;
- feedback recebido de quem testou.

Quando houver backend e login, sera possivel criar metricas mais ricas com
consentimento claro do usuario.
