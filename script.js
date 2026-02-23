const frm = document.getElementById('comissaoForm');
const historicoTabela = document.getElementById('historicoTabela');
const filtroMes = document.getElementById('filtroMes');

const totalComissaoElem = document.getElementById('totalComissao');

frm.addEventListener("submit", (e) => {
    e.preventDefault();

    const valorRecebido = parseFloat(document.getElementById('inRecebido').value);
    const servicoSelecionado = document.querySelector('input[name="servico"]:checked');

    if (!servicoSelecionado) {
        alert("Selecione o serviço realizado!");
        return;
    }

    if (isNaN(valorRecebido) || valorRecebido < 0) {
        alert("Informe um valor válido (>= 0).");
        return;
    }

    const mesInput = document.getElementById('idMes').value.trim();
    
    if (!mesInput) {
        alert("Selecione um período.");
        return;
    }
    
    // Converte de YYYY-MM para MM/YYYY
    const [ano, mes_num] = mesInput.split('-');
    const mes = `${mes_num}/${ano}`;

    const viagem = servicoSelecionado.value;
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
    mostrarMensagemSucesso(`✅ Comissão de R$ ${comissao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} adicionada!`);
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
            <td>R$ ${lancamento.valorRecebido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
            <td>R$ ${lancamento.comissao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
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

// Filtra o histórico de acordo com os meses selecionados (suporta seleção múltipla)
function filtrarHistorico() {
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
            <td>R$ ${lancamento.valorRecebido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
            <td>R$ ${lancamento.comissao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
        `;
        historicoTabela.appendChild(tr);
    });

    atualizarTotais(mesesSelecionados);
}

// Exclui os lançamentos selecionados
function excluirSelecionados() {
    const checkboxes = Array.from(document.querySelectorAll('.checkbox:checked'));
    if (checkboxes.length === 0) return;

    let lancamentos = JSON.parse(localStorage.getItem("lancamentos")) || [];

    // Remover índices em ordem decrescente para não quebrar os índices restantes
    const indices = checkboxes.map(cb => Number(cb.dataset.index)).sort((a, b) => b - a);
    indices.forEach(i => lancamentos.splice(i, 1));

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
    totalComissaoElem.textContent = `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}
// Limpa os campos do formulário
function limparCampos() {
    document.getElementById('inRecebido').value = "";
    const checked = document.querySelector('input[name="servico"]:checked');
    if (checked) checked.checked = false;
    document.getElementById('idMes').value = "";
    document.getElementById('resultado').textContent = "";
}

function mostrarMensagemSucesso(mensagem) {
    const msgElement = document.getElementById('mensagemSucesso');
    msgElement.textContent = mensagem;
    msgElement.style.display = 'block';
    
    // Remove a mensagem após 3 segundos
    setTimeout(() => {
        msgElement.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            msgElement.style.display = 'none';
            msgElement.style.animation = '';
        }, 300);
    }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
    exibirLancamentos();
    atualizarTotais();
});
