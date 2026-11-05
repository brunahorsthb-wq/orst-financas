# ORST Finanças

App de finanças pessoais da ORST, separado do ORST Hub (sem o Planner).
PWA em um único `index.html` (HTML + CSS + JS puro) com Firebase Auth + Firestore.

## Arquivos
| Arquivo | Para que serve |
|---|---|
| `index.html` | O app completo (dashboard, lançamentos, parceladas, metas, a pagar/receber, investimentos, patrimônio, visão anual, categorias, planos, admin, IA) |
| `firebase-config.js` | **Único arquivo que você edita** — cole aqui a config do Firebase |
| `manifest.json` | Dados do app instalado (nome, ícone, cores) |
| `sw.js` | Service worker (funciona offline e libera a instalação) |
| `icon-192.png`, `icon-512.png` | Ícones do app |
| `firestore.rules` | Regras de segurança para colar no Firebase (não é usado pelo site) |

## Publicar
1. GitHub → novo repositório **orst-financas** (Public) → *Add file → Upload files* → envie todos os arquivos.
2. *Settings → Pages* → Deploy from a branch → `main` / `(root)` → Save.
3. Endereço: `https://brunahorsthb-wq.github.io/orst-financas/`

## Firebase
1. console.firebase.google.com → Adicionar projeto → **orst-financas**.
2. *Authentication* → Começar → ativar **E-mail/senha**.
3. *Authentication → Configurações → Domínios autorizados* → adicionar `brunahorsthb-wq.github.io`.
4. *Firestore Database* → Criar banco (modo produção, região `southamerica-east1`) → aba *Regras* → colar `firestore.rules` → Publicar.
5. *Configurações do projeto* → *Seus apps* → ícone `</>` (Web) → registrar → copiar o objeto `firebaseConfig` para `firebase-config.js`.
6. Criar sua conta pelo app → no Firestore, `users/{seu uid}` → mudar `role` para `admin`.

## Atualizar depois
Suba o `index.html` novo e troque `orst-financas-v1` por `v2`, `v3`... no `sw.js`, para os celulares buscarem a versão nova.
