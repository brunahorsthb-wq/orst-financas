// 1. Importações modulares (usando CDN para facilitar no seu caso)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  collection 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2. Sua configuração (Mantenha seus dados reais aqui)
const firebaseConfig = {
  apiKey: "AIzaSyDpYoAcRC_TfI87wbWzfug3KOxa0EOdHZ0",
  authDomain: "orst-gestao.firebaseapp.com",
  projectId: "orst-gestao",
  storageBucket: "orst-gestao.firebasestorage.app",
  messagingSenderId: "237695688518",
  appId: "1:237695688518:web:c42a9fbae193900e280f47",
  measurementId: "G-LRLR5HC4SZ"
};

// 3. Inicialização dos serviços
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 4. Lógica de Autenticação e Roles
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Referência ao documento do usuário: db -> coleção 'users' -> id do usuário
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    let role = "free"; 
    if (userSnap.exists()) {
      role = userSnap.data().role;
    } else {
      // Cria o documento se não existir (Primeiro acesso)
      await setDoc(userRef, { email: user.email, role: "free" });
    }
    configurarInterface(role);
  } else {
    if(!window.location.pathname.includes("login.html")) {
        console.log("Usuário não autenticado");
        // window.location.href = "login.html"; 
    }
  }
});

// 5. Função de Interface
function configurarInterface(role) {
  console.log("Nível de acesso:", role);
  const itensPremium = document.querySelectorAll('.premium-only');
  itensPremium.forEach(el => {
    el.style.display = (role === "free") ? 'none' : 'block';
  });
}

// 6. Lógica de Parcelamento (Refatorada para Modular)
async function salvarDespesaParcelada(nome, valorTotal, numParcelas, dataInicial, categoria) {
  const user = auth.currentUser;
  if (!user) return alert("Faça login primeiro!");

  const valorCadaParcela = valorTotal / numParcelas;
  const idAgrupamento = Date.now().toString();

  try {
    for (let i = 1; i <= numParcelas; i++) {
      let dataVencimento = new Date(dataInicial);
      dataVencimento.setMonth(dataVencimento.getMonth() + (i - 1));

      // Uso do addDoc e collection em vez de .collection().add()
      await addDoc(collection(db, "movimentacoes"), {
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
  } catch (error) {
    console.error("Erro ao salvar parcelas:", error);
  }
}
