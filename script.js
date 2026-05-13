// 1. Importações (Usando CDN para funcionar direto no navegador)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, addDoc, collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2. Sua Configuração (Já atualizada com suas chaves)
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

// --- FUNÇÕES DO SISTEMA ---

// Verificar se o usuário está logado e o nível de acesso
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    
    let role = "free";
    if (userSnap.exists()) {
      role = userSnap.data().role;
    } else {
      await setDoc(userRef, { email: user.email, role: "free" });
    }
    console.log("Usuário logado como:", role);
    // Aqui você pode chamar uma função para mostrar/esconder itens premium
  } else {
    console.log("Nenhum usuário logado.");
  }
});

// Função para Salvar Despesa Parcelada
async function salvarDespesa(nome, valor, parcelas, data, categoria) {
  const user = auth.currentUser;
  if (!user) return alert("Você precisa estar logado!");

  try {
    const valorParcela = valor / parcelas;
    for (let i = 1; i <= parcelas; i++) {
      await addDoc(collection(db, "movimentacoes"), {
        descricao: `${nome} (${i}/${parcelas})`,
        valor: valorParcela,
        data: data, // Ideal ajustar a data para cada mês aqui
        status: "pendente",
        categoria: categoria,
        usuarioId: user.uid
      });
    }
    alert("Dados salvos com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar:", error);
  }
}

// Exportar para usar no console se necessário
window.salvarDespesa = salvarDespesa;
