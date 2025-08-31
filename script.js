const frm = document.getElementById('comissaoForm');
const historicoTabela = document.getElementById('historicoTabela');
const filtroMes = document.getElementById('filtroMes');



const totalComissaoElem = document.getElementById('totalComissao');

const totalComissao1Elem = document.getElementById('totalComissao1');
const excluirSelecionadosBtn = document.getElementById('excluirSelecionados');

frm.addEventListener("submit", (e) => {
    e.preventDefault();

    const valorRecebido = parseFloat(frm.inRecebido.value);
    const viagem = frm.inViagem.value;
    const mes = frm.idMes.value;

    const comissao = valorRecebido * 0.40;

    const lancamento = {
        valorRecebido,
        viagem,
        mes,
        comissao
    };

    let lancamentos = JSON.parse(localStorage.getItem("lancamentos")) || [];
    lancamentos.push(lancamento);
    localStorage.setItem("lancamentos", JSON.stringify(lancamentos));

    exibirLancamentos();
    atualizarTotais();
    limparCampos(); 
});


function exibirLancamentos() {
    historicoTabela.innerHTML = "";
    let lancamentos = JSON.parse(localStorage.getItem("lancamentos")) || [];

    lancamentos.forEach((lancamento, index) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td><input type="checkbox" class="checkbox" data-index="${index}"></td>
            <td>${lancamento.mes}</td>
            <td>${lancamento.viagem}</td>
            <td>R$ ${lancamento.valorRecebido.toFixed(2)}</td>
            <td>R$ ${lancamento.comissao.toFixed(2)}</td>
        `;

        historicoTabela.appendChild(tr);
    });

    preencherFiltroMeses();
}

// Preenche as opções de meses no filtro
function preencherFiltroMeses() {
    let lancamentos = JSON.parse(localStorage.getItem("lancamentos")) || [];
    let meses = [...new Set(lancamentos.map(l => l.mes))];

    filtroMes.innerHTML = "";
    meses.forEach(mes => {
        const option = document.createElement("option");
        option.value = mes;
        option.textContent = mes;
        filtroMes.appendChild(option);
    });
}

// Filtra o histórico de acordo com o mês selecionado
function filtrarHistorico() {
    const mesSelecionado = filtroMes.value;
    let lancamentos = JSON.parse(localStorage.getItem("lancamentos")) || [];

    if (mesSelecionado) {
        lancamentos = lancamentos.filter(l => l.mes === mesSelecionado);
    }

    historicoTabela.innerHTML = "";

    lancamentos.forEach((lancamento, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><input type="checkbox" class="checkbox" data-index="${index}"></td>
            <td>${lancamento.mes}</td>
            <td>${lancamento.viagem}</td>
            <td>R$ ${lancamento.valorRecebido.toFixed(2)}</td>
            <td>R$ ${lancamento.comissao.toFixed(2)}</td>
        `;
        historicoTabela.appendChild(tr);
    });

    atualizarTotais(mesSelecionado);
}function filtrarHistorico() {
    const mesesSelecionados = Array.from(filtroMes.selectedOptions).map(option => option.value);
    let lancamentos = JSON.parse(localStorage.getItem("lancamentos")) || [];

    if (mesesSelecionados.length > 0) {
        lancamentos = lancamentos.filter(l => mesesSelecionados.includes(l.mes));
    }

    historicoTabela.innerHTML = "";

    lancamentos.forEach((lancamento, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><input type="checkbox" class="checkbox" data-index="${index}"></td>
            <td>${lancamento.mes}</td>
            <td>${lancamento.viagem}</td>
            <td>R$ ${lancamento.valorRecebido.toFixed(2)}</td>
            <td>R$ ${lancamento.comissao.toFixed(2)}</td>
        `;
        historicoTabela.appendChild(tr);
    });

    atualizarTotais(mesesSelecionados);
}

// Exclui os lançamentos selecionados
function excluirSelecionados() {
    const checkboxes = document.querySelectorAll('.checkbox:checked');
    let lancamentos = JSON.parse(localStorage.getItem("lancamentos")) || [];

    checkboxes.forEach(checkbox => {
        const index = checkbox.dataset.index;
        lancamentos.splice(index, 1);
    });

    localStorage.setItem("lancamentos", JSON.stringify(lancamentos));
    exibirLancamentos();
    atualizarTotais();
}

function atualizarTotais(mesesSelecionados = []) {
    let lancamentos = JSON.parse(localStorage.getItem("lancamentos")) || [];

    // Se houver meses selecionados, filtra os lançamentos desses meses
    if (mesesSelecionados.length > 0) {
        lancamentos = lancamentos.filter(l => mesesSelecionados.includes(l.mes));
    }

    // Calcula o total da comissão dos meses filtrados
    let total = lancamentos.reduce((acc, lancamento) => acc + lancamento.comissao, 0);
    totalComissaoElem.textContent = `R$ ${total.toFixed(2)}`;

    //Calculta o total recebido de comissões(independe do período)
    let total1 = lancamentos.reduce((acc, lancamento) => acc + lancamento.comissao, 0);
    totalComissao1Elem.textContent = `R$ ${total.toFixed(2)}`;
}
// Limpa os campos do formulário
function limparCampos() {
    frm.inRecebido.value = "";
    frm.inViagem.value = "";
    frm.idMes.value = "";
}

document.addEventListener("DOMContentLoaded", () => {
    exibirLancamentos();
    atualizarTotais();
});
