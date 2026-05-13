// Configuração do seu Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBsbhLaj1_LsAkETAhzEHM5KIJWB-7Zjkw",
  authDomain: "orst-financas.firebaseapp.com",
  projectId: "orst-financas",
  storageBucket: "orst-financas.firebasestorage.app",
  messagingSenderId: "26142326621",
  appId: "1:26142326621:web:c1fd54a75aecdb3ae7b2b4"
};

// Inicialização (padrão compat para evitar erros de importação)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// MONITOR DE LOGIN (O PORTEIRO)
auth.onAuthStateChanged((user) => {
    const paginaAtual = window.location.pathname.split("/").pop();
    
    if (!user) {
        // Se não está logado, força ir para o login
        if (paginaAtual !== "login.html" && paginaAtual !== "login") {
            window.location.href = "login.html";
        }
    } else {
        // Se está logado e no login, vai para o app
        if (paginaAtual === "login.html") {
            window.location.href = "index.html";
        }
    }
});

// FUNÇÃO DE LOGIN
window.fazerLogin = (email, senha) => {
    auth.signInWithEmailAndPassword(email, senha)
        .then(() => { window.location.href = "index.html"; })
        .catch((error) => { alert("Erro: " + error.message); });
};

// FUNÇÃO DE LANÇAMENTOS
window.salvarDespesa = async (nome, valor, parcelas, data, categoria) => {
    const user = auth.currentUser;
    if (!user) return alert("Logue primeiro!");
    
    try {
        const p = parseInt(parcelas) || 1;
        const v = parseFloat(valor) / p;
        for (let i = 1; i <= p; i++) {
            await db.collection("movimentacoes").add({
                descricao: `${nome} ${i}/${p}`,
                valor: v,
                data: data,
                usuarioId: user.uid,
                status: "pendente",
                categoria: categoria,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        alert("Salvo com sucesso!");
    } catch (e) {
        alert("Erro ao salvar.");
    }
};
