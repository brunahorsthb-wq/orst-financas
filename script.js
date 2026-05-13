// 1. Importações dos módulos do Firebase (Versão Modular v10)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, addDoc, collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2. Configuração do seu Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBsbhLaj1_LsAkETAhzEHM5KIJWB-7Zjkw",
  authDomain: "orst-financas.firebaseapp.com",
  projectId: "orst-financas",
  storageBucket: "orst-financas.firebasestorage.app",
  messagingSenderId: "26142326621",
  appId: "1:26142326621:web:c1fd54a75aecdb3ae7b2b4"
};

// 3. Inicialização
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- LÓGICA DE ACESSO (O PORTEIRO) ---
onAuthStateChanged(auth, async (user) => {
    // Pega apenas o nome do arquivo atual (ex: index.html ou login.html)
    const paginaAtual = window.location.pathname.split("/").pop();

    if (!user) {
        // Se NÃO está logado e NÃO está na página de login, manda para o login
        // O "./" ajuda o GitHub a encontrar o arquivo na mesma pasta
        if (paginaAtual !== "login.html" && paginaAtual !== "") {
            window.location.href = "./login.html";
        }
    } else {
        console.log("Usuário logado:", user.email);
        
        // Se estiver logado e tentar entrar no login, volta para a principal
        if (paginaAtual === "login.html") {
            window.location.href = "./index.html";
        }

        // Verifica se é Admin (Opcional para travar funções na tela)
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists() && userSnap.data().role === 'admin') {
            console.log("Modo Administrador Ativo");
        }
    }
});

// --- FUNÇÃO DE LOGIN (Chamada pelo botão no login.html) ---
window.fazerLogin = async (email, senha) => {
    if (!email || !senha) return alert("Preencha todos os campos!");
    
    try {
        await signInWithEmailAndPassword(auth, email, senha);
        window.location.href = "./index.html";
    } catch (error) {
        console.error("Erro de login:", error.code);
        alert("E-mail ou senha incorretos.");
    }
};

// --- FUNÇÃO DE LOGOUT (Chamada pelo seu botão de Sair) ---
window.logout = () => {
    signOut(auth).then(() => {
        window.location.href = "./login.html";
    });
};

// --- FUNÇÃO DE LANÇAMENTOS ---
window.salvarDespesa = async (nome, valor, parcelas, data, categoria) => {
    const user = auth.currentUser;
    if (!user) return alert("Você precisa estar logado!");

    try {
        const totalParcelas = parseInt(parcelas) || 1;
        const valorParcela = parseFloat(valor) / totalParcelas;
