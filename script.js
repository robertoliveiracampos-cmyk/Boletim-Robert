// ============================================================
// CONFIGURAÇÃO FIXA DO ALUNO
// Turma e chamada ficam fixas neste projeto e não podem ser
// alteradas pela página.
// ============================================================
const CONFIG_ALUNO = {
  turma: "8A",
  numeroChamada: 36,
  apiUrl: "https://boletim-api.profbt.com.br"
};

// ============================================================
// DADOS FICTÍCIOS PADRONIZADOS — 8º ANO
// Estes são os "dados brutos". As notas podem vir em formatos
// diferentes (82, "7,8", 8.0, null...) e serão normalizadas.
// ============================================================
const disciplinas = [
  { disciplina: "Língua Portuguesa",         tri1: 82,   tri2: "7,8", tri3: 85,   faltas: [2, 1, 1] },
  { disciplina: "Matemática",                tri1: 52,   tri2: "5,8", tri3: null, faltas: [3, 2, 1] },
  { disciplina: "Ciências",                  tri1: "8,1", tri2: 76,   tri3: 8.0,  faltas: [1, 2, 0] },
  { disciplina: "História",                  tri1: 7.0,  tri2: 84,   tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Geografia",                 tri1: 68,   tri2: 7.3,  tri3: "7,9", faltas: [0, 1, 1] },
  { disciplina: "Língua Inglesa",            tri1: 86,   tri2: "8,1", tri3: 8.7,  faltas: [1, 0, 0] },
  { disciplina: "Arte",                      tri1: 9.0,  tri2: 92,   tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Educação Física",           tri1: 95,   tri2: 9.0,  tri3: "9,4", faltas: [0, 1, 0] },
  { disciplina: "Educação Digital",          tri1: 88,   tri2: 9.1,  tri3: 93,   faltas: [1, 0, 1] },
  { disciplina: "Educação Financeira",       tri1: 74,   tri2: "7,8", tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Estudo Orientado",          tri1: 8.0,  tri2: 83,   tri3: "8,5", faltas: [0, 1, 0] },
  { disciplina: "Redação e Leitura",         tri1: 62,   tri2: "6,8", tri3: null, faltas: [2, 1, 1] },
  { disciplina: "Pensamento Lógico",         tri1: 48,   tri2: 5.6,  tri3: "6,0", faltas: [2, 2, 1] },
  { disciplina: "Literatura Arte e Movimento", tri1: "7,7", tri2: 80, tri3: null, faltas: [1, 0, 1] },
  { disciplina: "Práticas Experimentais",    tri1: 58,   tri2: "6,2", tri3: 6.4,  faltas: [1, 1, 1] }
];

// Média mínima de referência
const MEDIA_MINIMA = 6.0;

// ============================================================
// ESTADO DA SESSÃO (somente em memória)
// ============================================================
let pinSessao = null;         // PIN digitado — nunca persistido
let dadosAtuais = null;       // dados exibidos/editados na sessão
let modoEdicao = false;

// ============================================================
// FUNÇÃO: normalizarNota(valor)
// Regra ANTIGA, usada apenas para os dados fictícios originais.
// Recebe uma nota em qualquer formato e devolve:
//   - null  → se a nota ainda não foi lançada ou é inválida
//   - um número de 0 a 10 → se for válida
// ============================================================
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  let numero;
  if (typeof valor === "string") {
    numero = parseFloat(valor.replace(",", "."));
  } else {
    numero = valor;
  }

  if (isNaN(numero)) {
    return null;
  }

  if (numero >= 0 && numero <= 10) {
    return numero;
  } else if (numero > 10 && numero <= 100) {
    return numero / 10;
  }

  return null;
}

// ============================================================
// FUNÇÃO: validarNotaDigitada(texto)
// Regra NOVA, usada apenas para o que o aluno digita no editor.
// Aceita somente número de 0 a 10, ponto ou vírgula decimal,
// ou vazio (que vira null). Qualquer outra coisa → inválido.
// Retorna { valido: true, valor: número|null }
// ou      { valido: false }
// ============================================================
function validarNotaDigitada(texto) {
  const limpo = String(texto).trim();

  if (limpo === "") {
    return { valido: true, valor: null };
  }

  // Só aceita algo como: 7, 7.5, 7,5, 10, 0, 10.0
  if (!/^\d{1,2}([.,]\d{1,2})?$/.test(limpo)) {
    return { valido: false };
  }

  const numero = parseFloat(limpo.replace(",", "."));

  if (isNaN(numero) || numero < 0 || numero > 10) {
    return { valido: false };
  }

  return { valido: true, valor: numero };
}

// ============================================================
// FUNÇÃO: validarFaltaDigitada(texto)
// Aceita somente inteiro >= 0. Vazio ou inválido → inválido.
// ============================================================
function validarFaltaDigitada(texto) {
  const limpo = String(texto).trim();

  if (!/^\d+$/.test(limpo)) {
    return { valido: false };
  }

  const numero = parseInt(limpo, 10);

  if (isNaN(numero) || numero < 0) {
    return { valido: false };
  }

  return { valido: true, valor: numero };
}

// ============================================================
// FUNÇÃO: formatarNota(nota)
// ============================================================
function formatarNota(nota) {
  if (nota === null) {
    return "—";
  }
  return nota.toFixed(1).replace(".", ",");
}

// ============================================================
// FUNÇÃO: calcularMedia(notas)
// ============================================================
function calcularMedia(notas) {
  const validas = notas.filter(function (n) {
    return n !== null;
  });

  if (validas.length === 0) {
    return null;
  }

  let soma = 0;
  validas.forEach(function (n) {
    soma = soma + n;
  });

  return soma / validas.length;
}

// ============================================================
// FUNÇÃO: somarFaltas(listaDeFaltas)
// ============================================================
function somarFaltas(listaDeFaltas) {
  let total = 0;
  listaDeFaltas.forEach(function (f) {
    total = total + f;
  });
  return total;
}

// ============================================================
// FUNÇÃO: definirSituacao(media)
// ============================================================
function definirSituacao(media) {
  if (media === null) {
    return "Nota ainda não disponível";
  }
  if (media >= MEDIA_MINIMA) {
    return "Bom desempenho";
  }
  return "Atenção";
}

// ============================================================
// FUNÇÃO: classeSituacao(situacao)
// ============================================================
function classeSituacao(situacao) {
  if (situacao === "Bom desempenho") return "situacao-bom";
  if (situacao === "Atenção") return "situacao-atencao";
  return "situacao-sem-nota";
}

// ============================================================
// FUNÇÃO: converterDadosLocais()
// Converte as disciplinas fictícias originais para o formato
// usado pela tela: notas normalizadas + faltas em lista.
// ============================================================
function converterDadosLocais() {
  return disciplinas.map(function (d) {
    return {
      disciplina: d.disciplina,
      notas: [normalizarNota(d.tri1), normalizarNota(d.tri2), normalizarNota(d.tri3)],
      faltas: [d.faltas[0], d.faltas[1], d.faltas[2]]
    };
  });
}

// ============================================================
// FUNÇÃO: obterDadosDaApi(dadosApi)
// Garante que os dados recebidos da API sejam usados exatamente
// como vieram (sem completar com dados locais).
// Retorna uma lista no formato { disciplina, notas[3], faltas[3] }.
// ============================================================
function obterDadosDaApi(dadosApi) {
  if (!dadosApi || !Array.isArray(dadosApi.disciplinas)) {
    return null;
  }

  return dadosApi.disciplinas.map(function (d) {
    const notas = [d.tri1, d.tri2, d.tri3].map(function (n) {
      // Dados da API já vêm como número (ou null). Normaliza por segurança.
      if (n === null || n === undefined) return null;
      const num = typeof n === "string" ? parseFloat(n.replace(",", ".")) : n;
      return isNaN(num) ? null : num;
    });
    const faltas = [d.f1, d.f2, d.f3].map(function (f) {
      return f === null || f === undefined || isNaN(f) ? 0 : Number(f);
    });
    return { disciplina: d.disciplina, notas: notas, faltas: faltas };
  });
}

// ============================================================
// FUNÇÃO: montarPayloadApi()
// Converte dadosAtuais para o formato que a API espera.
// ============================================================
function montarPayloadApi() {
  return {
    disciplinas: dadosAtuais.map(function (d) {
      return {
        disciplina: d.disciplina,
        tri1: d.notas[0],
        tri2: d.notas[1],
        tri3: d.notas[2],
        f1: d.faltas[0],
        f2: d.faltas[1],
        f3: d.faltas[2]
      };
    })
  };
}

// ============================================================
// FUNÇÃO: limparTabela()
// ============================================================
function limparTabela() {
  const corpo = document.getElementById("corpo-tabela");
  while (corpo.firstChild) {
    corpo.removeChild(corpo.firstChild);
  }
}

// ============================================================
// FUNÇÃO: criarCelula(texto, classe)
// Cria um <td> com textContent seguro.
// ============================================================
function criarCelula(texto, classe) {
  const td = document.createElement("td");
  if (classe) td.className = classe;
  td.textContent = texto;
  return td;
}

// ============================================================
// FUNÇÃO: criarCampoEdicao(tipo, valorInicial, indiceDisc, indiceTri)
// Cria um input de edição para nota ou falta.
// ============================================================
function criarCampoEdicao(tipo, valorInicial, indiceDisc, indiceTri) {
  const input = document.createElement("input");
  input.type = "text";
  input.className = "campo-edicao";
  input.setAttribute("data-tipo", tipo);
  input.setAttribute("data-disc", String(indiceDisc));
  input.setAttribute("data-tri", String(indiceTri));
  input.value = valorInicial;
  input.addEventListener("input", function () {
    input.classList.remove("invalido");
  });
  return input;
}

// ============================================================
// FUNÇÃO: renderizarTabela()
// Limpa e reconstrói a tabela com base em dadosAtuais.
// ============================================================
function renderizarTabela() {
  limparTabela();
  const corpo = document.getElementById("corpo-tabela");

  dadosAtuais.forEach(function (d, indiceDisc) {
    const n1 = d.notas[0];
    const n2 = d.notas[1];
    const n3 = d.notas[2];
    const media = calcularMedia([n1, n2, n3]);
    const faltas = somarFaltas(d.faltas);
    const situacao = definirSituacao(media);

    const linha = document.createElement("tr");

    // Disciplina (nunca editável)
    const tdDisc = document.createElement("td");
    tdDisc.textContent = d.disciplina;
    linha.appendChild(tdDisc);

    // Trimestres de nota
    for (let i = 0; i < 3; i++) {
      const td = document.createElement("td");
      if (modoEdicao) {
        const valorInicial = d.notas[i] === null ? "" : formatarNota(d.notas[i]);
        td.appendChild(criarCampoEdicao("nota", valorInicial, indiceDisc, i));
      } else {
        td.textContent = formatarNota(d.notas[i]);
      }
      linha.appendChild(td);
    }

    // Média (sempre calculada, nunca editável)
    linha.appendChild(criarCelula(formatarNota(media)));

    // Faltas
    if (modoEdicao) {
      const tdFaltas = document.createElement("td");
      // Em modo de edição mostra 3 campos de faltas
      d.faltas.forEach(function (f, i) {
        tdFaltas.appendChild(criarCampoEdicao("falta", String(f), indiceDisc, i));
      });
      linha.appendChild(tdFaltas);
    } else {
      linha.appendChild(criarCelula(String(faltas)));
    }

    // Situação
    linha.appendChild(criarCelula(situacao, classeSituacao(situacao)));

    corpo.appendChild(linha);
  });
}

// ============================================================
// FUNÇÃO: renderizarCards()
// ============================================================
function renderizarCards() {
  const resultados = dadosAtuais.map(function (d) {
    const media = calcularMedia(d.notas);
    return {
      media: media,
      faltas: somarFaltas(d.faltas),
      situacao: definirSituacao(media)
    };
  });

  const mediasValidas = resultados
    .map(function (r) { return r.media; })
    .filter(function (m) { return m !== null; });

  let mediaGeral = null;
  if (mediasValidas.length > 0) {
    let soma = 0;
    mediasValidas.forEach(function (m) { soma = soma + m; });
    mediaGeral = soma / mediasValidas.length;
  }

  document.getElementById("media-geral").textContent =
    mediaGeral === null ? "—" : formatarNota(mediaGeral);

  let totalFaltas = 0;
  resultados.forEach(function (r) { totalFaltas = totalFaltas + r.faltas; });
  document.getElementById("total-faltas").textContent = totalFaltas;

  const qtdBom = resultados.filter(function (r) {
    return r.situacao === "Bom desempenho";
  }).length;
  document.getElementById("qtd-bom").textContent = qtdBom;

  const qtdAtencao = resultados.filter(function (r) {
    return r.situacao === "Atenção";
  }).length;
  document.getElementById("qtd-atencao").textContent = qtdAtencao;

  const frequenciaDemonstrativa = 92;
  document.getElementById("frequencia").textContent =
    frequenciaDemonstrativa + "% — Frequência adequada";
}

// ============================================================
// FUNÇÃO: renderizarTudo()
// ============================================================
function renderizarTudo() {
  renderizarTabela();
  renderizarCards();
}

// ============================================================
// FUNÇÃO: mostrarMensagem(elementoId, texto, sucesso)
// ============================================================
function mostrarMensagem(elementoId, texto, sucesso) {
  const el = document.getElementById(elementoId);
  el.textContent = texto;
  if (sucesso) {
    el.classList.add("sucesso");
  } else {
    el.classList.remove("sucesso");
  }
}

// ============================================================
// LOGIN POR PIN
// ============================================================
async function entrarComPin() {
  const campoPin = document.getElementById("campo-pin");
  const btnEntrar = document.getElementById("btn-entrar");
  const pin = campoPin.value.trim();

  if (pin === "") {
    mostrarMensagem("pin-mensagem", "Digite o PIN.", false);
    return;
  }

  btnEntrar.disabled = true;
  mostrarMensagem("pin-mensagem", "Conectando...", false);

  try {
    const resposta = await fetch(CONFIG_ALUNO.apiUrl + "/api/v1/boletins/abrir", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pin
      })
    });

    if (resposta.status === 401) {
      mostrarMensagem("pin-mensagem", "Turma, chamada ou PIN inválidos.", false);
      btnEntrar.disabled = false;
      return;
    }

    if (resposta.status === 429) {
      mostrarMensagem("pin-mensagem", "Muitas tentativas. Aguarde um minuto e tente novamente.", false);
      btnEntrar.disabled = false;
      return;
    }

    if (!resposta.ok) {
      mostrarMensagem("pin-mensagem", "Não foi possível conectar ao servidor. Tente novamente.", false);
      btnEntrar.disabled = false;
      return;
    }

    const json = await resposta.json();

    // Guarda o PIN apenas em memória
    pinSessao = pin;

    // Decide a origem dos dados
    let dadosRecebidos = null;
    if (json && json.dados !== null && json.dados !== undefined) {
      dadosRecebidos = obterDadosDaApi(json.dados);
    }

    if (dadosRecebidos !== null) {
      dadosAtuais = dadosRecebidos;
    } else {
      dadosAtuais = converterDadosLocais();
    }

    // Limpa o campo do PIN após login
    campoPin.value = "";
    mostrarMensagem("pin-mensagem", "", false);

    // Mostra o boletim
    document.getElementById("area-pin").hidden = true;
    document.getElementById("area-boletim").hidden = false;

    modoEdicao = false;
    renderizarTudo();
    atualizarGraficos();
  } catch (erro) {
    mostrarMensagem("pin-mensagem", "Não foi possível conectar ao servidor. Tente novamente.", false);
    btnEntrar.disabled = false;
  }
}

// ============================================================
// ALTERAR DADOS
// ============================================================
function ativarEdicao() {
  modoEdicao = true;
  document.getElementById("btn-alterar").hidden = true;
  document.getElementById("btn-salvar").hidden = false;
  document.getElementById("btn-cancelar").hidden = false;
  mostrarMensagem("acao-mensagem", "", false);
  renderizarTabela();
}

// ============================================================
// CANCELAR EDIÇÃO
// ============================================================
function cancelarEdicao() {
  modoEdicao = false;
  document.getElementById("btn-alterar").hidden = false;
  document.getElementById("btn-salvar").hidden = true;
  document.getElementById("btn-cancelar").hidden = true;
  mostrarMensagem("acao-mensagem", "", false);
  renderizarTudo();
  atualizarGraficos();
}

// ============================================================
// COLETAR EDIÇÕES
// Lê os campos, valida cada um e atualiza dadosAtuais.
// Retorna true se tudo válido, false se houver erro.
// ============================================================
function coletarEdicoes() {
  const campos = document.querySelectorAll("#corpo-tabela input.campo-edicao");
  let tudoValido = true;

  // Zera marcação de erro
  campos.forEach(function (c) { c.classList.remove("invalido"); });

  // Cria cópia de trabalho para não modificar antes de validar tudo
  const copia = dadosAtuais.map(function (d) {
    return {
      disciplina: d.disciplina,
      notas: [d.notas[0], d.notas[1], d.notas[2]],
      faltas: [d.faltas[0], d.faltas[1], d.faltas[2]]
    };
  });

  campos.forEach(function (campo) {
    const tipo = campo.getAttribute("data-tipo");
    const indiceDisc = parseInt(campo.getAttribute("data-disc"), 10);
    const indiceTri = parseInt(campo.getAttribute("data-tri"), 10);

    if (tipo === "nota") {
      const r = validarNotaDigitada(campo.value);
      if (!r.valido) {
        campo.classList.add("invalido");
        tudoValido = false;
      } else {
        copia[indiceDisc].notas[indiceTri] = r.valor;
      }
    } else if (tipo === "falta") {
      const r = validarFaltaDigitada(campo.value);
      if (!r.valido) {
        campo.classList.add("invalido");
        tudoValido = false;
      } else {
        copia[indiceDisc].faltas[indiceTri] = r.valor;
      }
    }
  });

  if (!tudoValido) {
    return false;
  }

  dadosAtuais = copia;
  return true;
}

// ============================================================
// SALVAR ALTERAÇÕES
// ============================================================
async function salvarAlteracoes() {
  const btnSalvar = document.getElementById("btn-salvar");

  const valido = coletarEdicoes();
  if (!valido) {
    mostrarMensagem("acao-mensagem", "Verifique os campos em destaque. Notas devem estar entre 0 e 10 e faltas devem ser inteiros maiores ou iguais a zero.", false);
    return;
  }

  btnSalvar.disabled = true;
  mostrarMensagem("acao-mensagem", "Salvando...", false);

  try {
    const resposta = await fetch(CONFIG_ALUNO.apiUrl + "/api/v1/boletins/salvar", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinSessao,
        dados: montarPayloadApi()
      })
    });

    if (!resposta.ok) {
      mostrarMensagem("acao-mensagem", "Não foi possível salvar. Tente novamente.", false);
      btnSalvar.disabled = false;
      return;
    }

    // Sucesso: sai do modo edição e atualiza a tela
    modoEdicao = false;
    document.getElementById("btn-alterar").hidden = false;
    document.getElementById("btn-salvar").hidden = true;
    document.getElementById("btn-cancelar").hidden = true;
    btnSalvar.disabled = false;

    renderizarTudo();
    atualizarGraficos();
    mostrarMensagem("acao-mensagem", "Dados salvos com sucesso.", true);
  } catch (erro) {
    mostrarMensagem("acao-mensagem", "Não foi possível salvar. Tente novamente.", false);
    btnSalvar.disabled = false;
  }
}

// ============================================================
// LIGAR OS BOTÕES
// ============================================================
document.getElementById("btn-entrar").addEventListener("click", entrarComPin);
document.getElementById("campo-pin").addEventListener("keydown", function (e) {
  if (e.key === "Enter") entrarComPin();
});
document.getElementById("btn-alterar").addEventListener("click", ativarEdicao);
document.getElementById("btn-salvar").addEventListener("click", salvarAlteracoes);
document.getElementById("btn-cancelar").addEventListener("click", cancelarEdicao);

// ============================================================
// ÁREA DE GRÁFICOS — SOMENTE LEITURA
// Estes gráficos apenas LÊEM dadosAtuais e desenham.
// Não alteram notas, faltas, disciplinas, nem o payload da API.
// ============================================================

// Referência interna de risco (nunca exibida na interface).
// Usada apenas para decidir se o badge "Perigo" aparece.
const LIMITE_FALTAS_PERIGO = 350;

// Instâncias do Chart.js (para destruir antes de recriar)
let graficoMedias = null;
let graficoEvolucao = null;
let graficoFaltas = null;

// Cores derivadas do tema existente (roxo / lilás)
const CORES_GRAFICOS = {
  roxo: "#6a3fb5",
  roxoEscuro: "#4e2d8a",
  lilasBorda: "#d6c7ec",
  texto: "#2e2a35",
  textoSuave: "#6b6577",
  perigo: "#c0392b"
};

// ------------------------------------------------------------
// GRÁFICO 1 — Média por disciplina (barras horizontais)
// ------------------------------------------------------------
function atualizarGraficoMedias() {
  const canvas = document.getElementById("graficoMediasDisciplinas");
  if (!canvas || !dadosAtuais) return;

  if (graficoMedias) {
    graficoMedias.destroy();
  }

  // Cópia de leitura: NÃO altera dadosAtuais
  const rotulos = [];
  const valores = [];

  dadosAtuais.forEach(function (d) {
    const media = calcularMedia([d.notas[0], d.notas[1], d.notas[2]]);
    rotulos.push(d.disciplina);
    valores.push(media === null ? null : Number(media.toFixed(2)));
  });

  graficoMedias = new Chart(canvas, {
    type: "bar",
    data: {
      labels: rotulos,
      datasets: [{
        label: "Média",
        data: valores,
        backgroundColor: CORES_GRAFICOS.roxo,
        borderColor: CORES_GRAFICOS.roxoEscuro,
        borderWidth: 1,
        borderRadius: 4,
        barThickness: 14
      }]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 300 },
      scales: {
        x: {
          beginAtZero: true,
          max: 10,
          ticks: {
            color: CORES_GRAFICOS.textoSuave,
            stepSize: 2
          },
          grid: { color: CORES_GRAFICOS.lilasBorda }
        },
        y: {
          ticks: {
            color: CORES_GRAFICOS.texto,
            font: { size: 11 },
            autoSkip: false
          },
          grid: { display: false }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              const v = ctx.parsed.x;
              if (v === null || v === undefined) return "Sem nota";
              return "Média: " + Number(v).toFixed(1).replace(".", ",");
            }
          }
        }
      }
    }
  });
}

// ------------------------------------------------------------
// GRÁFICO 2 — Evolução da média geral (linha, 3 trimestres)
// ------------------------------------------------------------
function atualizarGraficoEvolucao() {
  const canvas = document.getElementById("graficoEvolucaoTrimestres");
  if (!canvas || !dadosAtuais) return;

  if (graficoEvolucao) {
    graficoEvolucao.destroy();
  }

  // Para cada trimestre (0,1,2), calcula a média das notas válidas.
  // Notas null NÃO entram. Trimestre sem nenhuma nota → null.
  function mediaDoTrimestre(indiceTri) {
    const notasDoTri = [];
    dadosAtuais.forEach(function (d) {
      const n = d.notas[indiceTri];
      if (n !== null && n !== undefined) {
        notasDoTri.push(n);
      }
    });
    if (notasDoTri.length === 0) return null;
    return calcularMedia(notasDoTri);
  }

  const medias = [mediaDoTrimestre(0), mediaDoTrimestre(1), mediaDoTrimestre(2)];

  graficoEvolucao = new Chart(canvas, {
    type: "line",
    data: {
      labels: ["1º Tri", "2º Tri", "3º Tri"],
      datasets: [{
        label: "Média geral",
        data: medias,
        borderColor: CORES_GRAFICOS.roxo,
        backgroundColor: "rgba(106, 63, 181, 0.15)",
        pointBackgroundColor: CORES_GRAFICOS.roxoEscuro,
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 5,
        tension: 0.3,
        spanGaps: false,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 300 },
      scales: {
        y: {
          beginAtZero: true,
          max: 10,
          ticks: {
            color: CORES_GRAFICOS.textoSuave,
            stepSize: 2
          },
          grid: { color: CORES_GRAFICOS.lilasBorda }
        },
        x: {
          ticks: { color: CORES_GRAFICOS.texto },
          grid: { display: false }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              const v = ctx.parsed.y;
              if (v === null || v === undefined) return "Sem nota neste trimestre";
              return "Média: " + Number(v).toFixed(1).replace(".", ",");
            }
          }
        }
      }
    }
  });
}

// ------------------------------------------------------------
// GRÁFICO 3 — Faltas por trimestre (3 barras: 1º, 2º, 3º)
// ------------------------------------------------------------
function atualizarGraficoFaltas() {
  const canvas = document.getElementById("graficoFaltasTrimestres");
  if (!canvas || !dadosAtuais) return;

  if (graficoFaltas) {
    graficoFaltas.destroy();
  }

  // Soma faltas[0], faltas[1], faltas[2] de TODAS as disciplinas
  let faltasTri1 = 0;
  let faltasTri2 = 0;
  let faltasTri3 = 0;

  dadosAtuais.forEach(function (d) {
    faltasTri1 += Number(d.faltas[0]) || 0;
    faltasTri2 += Number(d.faltas[1]) || 0;
    faltasTri3 += Number(d.faltas[2]) || 0;
  });

  const totalFaltas = faltasTri1 + faltasTri2 + faltasTri3;

  // Badge "Perigo" (só aparece; nada sobre 350 é exibido)
  const badge = document.getElementById("estadoFaltas");
  const card = document.getElementById("card-grafico-faltas");
  if (badge) {
    badge.hidden = totalFaltas < LIMITE_FALTAS_PERIGO;
  }
  if (card) {
    if (totalFaltas >= LIMITE_FALTAS_PERIGO) {
      card.classList.add("perigo");
    } else {
      card.classList.remove("perigo");
    }
  }

  graficoFaltas = new Chart(canvas, {
    type: "bar",
    data: {
      labels: ["1º Tri", "2º Tri", "3º Tri"],
      datasets: [{
        label: "Faltas",
        data: [faltasTri1, faltasTri2, faltasTri3],
        backgroundColor: [
          CORES_GRAFICOS.roxo,
          CORES_GRAFICOS.roxoEscuro,
          "#8b6bd1"
        ],
        borderRadius: 6,
        barThickness: 48
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 300 },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: CORES_GRAFICOS.textoSuave,
            precision: 0
          },
          grid: { color: CORES_GRAFICOS.lilasBorda }
        },
        x: {
          ticks: { color: CORES_GRAFICOS.texto },
          grid: { display: false }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              const tri = ctx.label;
              const v = ctx.parsed.y;
              return tri + ": " + v + " faltas";
            }
          }
        }
      }
    }
  });
}

// ------------------------------------------------------------
// Atualiza os três gráficos de uma vez
// ------------------------------------------------------------
function atualizar