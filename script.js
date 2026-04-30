// CONFIGURAÇÃO DO FIREBASE (Substitua pelos seus dados do Console Firebase)
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "seu-id",
  appId: "seu-app-id"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// 1. CONTROLE DE AUTENTICAÇÃO E NÍVEIS (ROLES)
auth.onAuthStateChanged(user => {
  if (user) {
    db.collection("users").doc(user.uid).get().then(doc => {
      let role = "free"; 
      if (doc.exists) {
        role = doc.data().role;
      } else {
        db.collection("users").doc(user.uid).set({ email: user.email, role: "free" });
      }
      configurarInterface(role);
    });
  } else {
    // Se não estiver na página de login e não estiver logado, redireciona
    if(!window.location.pathname.includes("login.html")) {
        console.log("Usuário não autenticado");
        // window.location.href = "login.html"; // Descomente quando criar o login.html
    }
  }
});

function configurarInterface(role) {
  console.log("Nível de acesso:", role);
  if (role === "free") {
    // Esconde Investimentos e Metas para usuários Free
    const itensPremium = document.querySelectorAll('.premium-only');
    itensPremium.forEach(el => el.style.display = 'none');
  }
}

// 2. LÓGICA DE CONTAS PARCELADAS
async function salvarDespesaParcelada(nome, valorTotal, numParcelas, dataInicial, categoria) {
  const user = auth.currentUser;
  if (!user) return alert("Faça login primeiro!");

  const valorCadaParcela = valorTotal / numParcelas;
  const idAgrupamento = Date.now().toString(); // ID para identificar o grupo de parcelas

  for (let i = 1; i <= numParcelas; i++) {
    let dataVencimento = new Date(dataInicial);
    dataVencimento.setMonth(dataVencimento.getMonth() + (i - 1));

    await db.collection("movimentacoes").add({
      descricao: `${nome} (${i}/${numParcelas})`,
      valor: valorCadaParcela,
      data: dataVencimento.toISOString().split('T')[0],
      status: "pendente",
      categoria: categoria,
      usuarioId: user.uid,
      idParcelamento: idAgrupamento
    });
  }
  alert("Parcelas geradas com sucesso!");
}
