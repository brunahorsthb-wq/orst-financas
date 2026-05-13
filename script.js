// 1. Importações dos módulos do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, addDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2. Configuração do teu Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBsbhLaj1_LsAkETAhzEHM5KIJWB-7Zjkw",
  authDomain: "orst-financas.firebaseapp.com",
  projectId: "orst-financas",
  storageBucket: "orst-financas.firebasestorage.app",
  messagingSenderId: "26142326621",
  appId: "1:26142326621:web:c1fd54a75aecdb3ae7b2b4"
};
// Esconde o conteúdo da página até verificar o login
document.body.style.display = "none";

onAuthStateChanged(auth, (user) => {
  if (user) {
    // Se está logado, mostra a página
    document.body.style.display = "block";
  } else {
    // Se não está logado, manda para o login imediatamente
    window.location.href = "login.html";
  }
});
// 3. Inicialização
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- LÓGICA DE ACESSO (O PORTEIRO) ---

onAuthStateChanged(auth, async (user) => {
    const path = window.location.pathname;
    const paginaAtual = path.split("/").pop();

    if (!user) {
        // Se NÃO está logado e NÃO está na página de login, manda para o login
        if (paginaAtual !== "login.html" && paginaAtual !== "") {
            window.location.href = "login.html";
        }
    } else {
        // Se ESTÁ logado e está na página de login, manda para a principal
        if (paginaAtual === "login.html") {
            window.location.href = "index.html";
        }
        console.log("Usuário logado:", user.email);
        
        // Verifica se é Admin
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists() && userSnap.data().role === 'admin') {
            console.log("Acesso de Administrador confirmado.");
            // Aqui podes mostrar botões que só o admin vê
        }
    }
});

// --- FUNÇÃO DE LOGIN ---
window.fazerLogin = async (email, senha) => {
    try {
        await signInWithEmailAndPassword(auth, email, senha);
        window.location.href = "index.html";
    } catch (error) {
        alert("Erro ao entrar: Verifique e-mail e senha.");
        console.error(error);
    }
};

// --- FUNÇÃO DE LOGOUT (SAIR) ---
window.logout = () => {
    signOut(auth).then(() => {
        window.location.href = "login.html";
    });
};

// --- FUNÇÃO DE LANÇAMENTOS (O que já tinhas) ---
window.salvarDespesa = async (nome, valor, parcelas, data, categoria) => {
    const user = auth.currentUser;
    if (!user) return alert("Sessão expirada. Faça login novamente.");

    try {
        const valorParcela = parseFloat(valor) / parseInt(parcelas);
        for (let i = 1; i <= parcelas; i++) {
            await addDoc(collection(db, "movimentacoes"), {
                descricao: `${nome} (${i}/${parcelas})`,
                valor: valorParcela,
                data: data,
                status: "pendente",
                categoria: categoria,
                usuarioId: user.uid,
                createdAt: new Date()
            });
        }
        alert("Lançamento efetuado com sucesso!");
    } catch (error) {
        alert("Erro ao salvar no banco de dados.");
        console.error(error);
    }
};
