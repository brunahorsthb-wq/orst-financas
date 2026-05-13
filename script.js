import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
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
const db = getFirestore(app);

// Função simples de salvar que você disse que funcionava
window.salvarDespesa = async (nome, valor, parcelas, data, categoria) => {
    try {
        const p = parseInt(parcelas) || 1;
        const v = parseFloat(valor) / p;
        for (let i = 1; i <= p; i++) {
            await addDoc(collection(db, "movimentacoes"), {
                descricao: `${nome} ${i}/${p}`,
                valor: v,
                data: data,
                status: "pendente",
                categoria: categoria,
                createdAt: new Date()
            });
        }
        alert("Lançamento realizado com sucesso!");
    } catch (e) {
        console.error(e);
        alert("Erro ao salvar. Verifique o console.");
    }
};
