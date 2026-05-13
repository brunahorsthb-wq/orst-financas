import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, addDoc, collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// Proteção para não travar a página
onAuthStateChanged(auth, (user) => {
    const path = window.location.pathname;
    const paginaAtual = path.split("/").pop();

    if (!user) {
        if (paginaAtual !== "login.html" && paginaAtual !== "") {
            window.location.href = "login.html";
        }
    } else {
        if (paginaAtual === "login.html") {
            window.location.href = "index.html";
        }
    }
});

// Funções globais para os botões do HTML funcionarem
window.fazerLogin = async (email, senha) => {
    try {
        await signInWithEmailAndPassword(auth, email, senha);
        window.location.href = "index.html";
    } catch (error) {
        alert("E-mail ou senha incorretos!");
        console.error(error);
    }
};

window.salvarDespesa = async (nome, valor, parcelas, data, categoria) => {
    const user = auth.currentUser;
    if (!user) return alert("Logue novamente");
    try {
        const p = parseInt(parcelas) || 1;
        const v = parseFloat(valor) / p;
        for (let i = 1; i <= p; i++) {
            await addDoc(collection(db, "movimentacoes"), {
                descricao: `${nome} ${i}/${p}`,
                valor: v,
                data: data,
                usuarioId: user.uid,
                status: "pendente"
            });
        }
        alert("Salvo!");
    } catch (e) {
        alert("Erro ao salvar");
    }
};
