# ORST Finanças — contexto do projeto

PWA de finanças pessoais em um único `index.html` (HTML + CSS + JS puro, sem build), com Firebase Auth + Firestore.
Separado do ORST Hub (`brunahorsthb-wq/orst-hub`), sem o Planner. Publicado pelo GitHub Pages (branch `main`, raiz):
https://brunahorsthb-wq.github.io/orst-financas/

## Arquivos
- `index.html` — app inteiro: Hub (logo ORST + card Gestão de Finanças), Finanças, Assistente (IA local), Perfil, Admin
- `firebase-config.js` — config do Firebase (`window.FB_CONFIG`); não sobrescrever com valores `COLE_AQUI`
- `sw.js` — service worker; trocar a versão de `CACHE` a cada atualização
- `manifest.json`, `icon-192.png`, `icon-512.png`
- `firestore.rules` — regras (dados em `users/{uid}/{colecao}`; `role` só o admin altera)

## Padrões a manter
- Visual atual: navy `#0d2d4f`, nude `#f5f0e8`, warm `#c4a882`, Cormorant Garamond + DM Sans
- Textos no JS sem acento ou com escapes `\uXXXX`
- Não mudar os cálculos de lançamentos, metas, visão anual e gráficos
- Coleções: lancamentos, parceladas, metas-fin, contas, apagar, receber, investimentos, ativos, passivos, categorias, bancos-custom
- 47 categorias padrão em `CATS_PADRAO`; cada usuário cria as suas (coleção `categorias`)
- Banner de instalação PWA: Android (prompt nativo ou instruções) e iPhone (instruções)
- Senhas de login/cadastro com botão de olho (`togglePw`)

## Validação antes de subir
- Extrair cada `<script>` inline e rodar `node --check`
- Testar no celular (Android e iPhone) após publicar
