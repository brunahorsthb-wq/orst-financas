// Configuração do seu Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBsbhLaj1_LsAkETAhzEHM5KIJWB-7Zjkw",
  authDomain: "orst-financas.firebaseapp.com",
  projectId: "orst-financas",
  storageBucket: "orst-financas.firebasestorage.app",
  messagingSenderId: "26142326621",
  appId: "1:26142326621:web:c1fd54a75aecdb3ae7b2b4"
};

// Inicializa o Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// Função de lançamentos
window.salvarDespesa = async (nome, valor, parcelas, data, categoria) => {
    try {
        const p = parseInt(parcelas) || 1;
        const v = parseFloat(valor) / p;
        
        for (let i = 1; i <= p; i++) {
            await db.collection("movimentacoes").add({
                descricao: p > 1 ? `${nome} (${i}/${p})` : nome,
                valor: v,
                data: data,
                status: "pendente",
                categoria: categoria,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        alert("Lançamento realizado com sucesso!");
    } catch (e) {
        console.error(e);
        alert("Erro ao salvar: " + e.message);
    }
};
