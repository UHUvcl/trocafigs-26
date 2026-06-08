#!/bin/zsh
cd "$(dirname "$0")"

PORT=5173
URL="http://localhost:${PORT}"

if ! command -v python3 >/dev/null 2>&1; then
  echo "Python 3 nao encontrado. Instale o Python 3 ou abra com outro servidor local."
  read -r "?Pressione Enter para sair..."
  exit 1
fi

if lsof -iTCP:${PORT} -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Servidor ja esta rodando em ${URL}"
else
  echo "Abrindo TrocaFigs 26 em ${URL}"
  python3 -m http.server "${PORT}" >/tmp/trocafigs-26.log 2>&1 &
  sleep 1
fi

open "${URL}"
echo "Pode fechar esta janela depois que o navegador abrir."
