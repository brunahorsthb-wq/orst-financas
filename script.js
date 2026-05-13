import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, addDoc, collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBsbhLaj1_LsAkETAhzEHM5KIJWB-7Zjkw",
  authDomain: "orst-financas.firebaseapp.com",
  projectId: "orst-financas",
  storageBucket: "orst-financas.firebasestorage.app",
  messagingSenderId: "26142326621",
  appId: "1:26142326621:web:c1fd54a75aecdb3ae7b2b4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// MONITOR DE LOGIN
onAuthStateChanged(auth, (user) => {
    const paginaAtual = window.location.pathname.split("/").pop();
    console.log("Página atual:", paginaAtual);

    if (!user) {
        // Se não está logado e não está na página de login, vai para o login
        if (paginaAtual !== "login.html" && paginaAtual !== "login") {
            window.location.href = "login.html";
        }
    } else {
        // Se está logado e tenta entrar no login, vai para o index
        if (paginaAtual === "login.html") {
            window.location.href = "index.html";
        }
    }
});

// LOGIN
window.fazerLogin = async (email, senha) => {
    try {
        await signInWithEmailAndPassword(auth, email, senha);
        window.location.href = "index.html";
    } catch (error) {
        alert("Erro no login. Verifique e-mail e senha.");
    }
};

// LANÇAMENTOS
window.salvarDespesa = async (nome, valor, parcelas, data, categoria) => {
    const user = auth.currentUser;
    if (!user) return alert("Logue primeiro!");
    try {
        const p = parseInt(parcelas) || 1;
        const v = parseFloat(valor) / p;
        for (let i = 1; i <= p; i++) {
            await addDoc(collection(db, "movimentacoes"), {
                descricao: `${nome} ${i}/${p}`,
                valor: v,
                data: data,
                usuarioId: user.uid,
                status: "pendente",
                categoria: categoria
            });
        }
        alert("Lançamento salvo!");
    } catch (e) {
        alert("Erro ao salvar.");
    }
};
