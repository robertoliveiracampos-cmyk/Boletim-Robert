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
// FUNÇÃO: normalizarNota(valor)
// Recebe uma nota em qualquer formato e devolve:
//   - null  → se a nota ainda não foi lançada ou é inválida
//   - um número de 0 a 10 → se for válida
// Regras:
//   - vazio / null / undefined        → null
//   - 0 a 10                          → mantém
//   - maior que 10 e até 100          → divide por 10
//   - aceita ponto ou vírgula decimal
// ============================================================
function normalizarNota(valor) {
  // Nota ausente
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  // Se for texto, troca vírgula por ponto antes de converter
  let numero;
  if (typeof valor === "string") {
    numero = parseFloat(valor.replace(",", "."));
  } else {
    numero = valor;
  }

  // Se não virou número válido, retorna null
  if (isNaN(numero)) {
    return null;
  }

  // Aplica as regras de escala
  if (numero >= 0 && numero <= 10) {
    return numero;
  } else if (numero > 10 && numero <= 100) {
    return numero / 10;
  }

  // Fora das regras → inválida
  return null;
}

// ============================================================
// FUNÇÃO: formatarNota(nota)
// Devolve o texto que vai aparecer na tabela.
// Se a nota for null, mostra o aviso de "ainda não lançada".
// ============================================================
function formatarNota(nota) {
  if (nota === null) {
    return "—";
  }
  return nota.toFixed(1).replace(".", ","); // ex.: 8.2 → "8,2"
}

// ============================================================
// FUNÇÃO: calcularMedia(notas)
// Recebe uma lista de notas (podendo ter null) e devolve a
// média considerando APENAS as notas válidas.
// Se nenhuma nota for válida, devolve null.
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
// Soma todos os números inteiros de faltas de uma disciplina.
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
// Devolve a situação da disciplina conforme a média.
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
// Devolve a classe CSS usada para colorir a situação.
// ============================================================
function classeSituacao(situacao) {
  if (situacao === "Bom desempenho") return "situacao-bom";
  if (situacao === "Atenção") return "situacao-atencao";
  return "situacao-sem-nota";
}

// ============================================================
// PREENCHER A TABELA
// Percorre cada disciplina, normaliza as notas, calcula média,
// soma faltas e insere uma linha <tr> no corpo da tabela.
// ============================================================
const corpoTabela = document.getElementById("corpo-tabela");

// Aqui guardamos resultados para usar nos cards depois
const resultados = [];

disciplinas.forEach(function (d) {
  // Normaliza cada trimestre
  const n1 = normalizarNota(d.tri1);
  const n2 = normalizarNota(d.tri2);
  const n3 = normalizarNota(d.tri3);

  // Média apenas com notas válidas
  const media = calcularMedia([n1, n2, n3]);

  // Soma das faltas
  const faltas = somarFaltas(d.faltas);

  // Situação da disciplina
  const situacao = definirSituacao(media);

  // Guarda o resultado para os cards
  resultados.push({
    disciplina: d.disciplina,
    media: media,
    faltas: faltas,
    situacao: situacao
  });

  // Cria a linha <tr>
  const linha = document.createElement("tr");

  linha.innerHTML =
    "<td>" + d.disciplina + "</td>" +
    "<td>" + formatarNota(n1) + "</td>" +
    "<td>" + formatarNota(n2) + "</td>" +
    "<td>" + formatarNota(n3) + "</td>" +
    "<td>" + formatarNota(media) + "</td>" +
    "<td>" + faltas + "</td>" +
    '<td class="' + classeSituacao(situacao) + '">' + situacao + "</td>";

  corpoTabela.appendChild(linha);
});

// ============================================================
// PREENCHER OS CARDS DE RESUMO
// ============================================================

// 1) Média geral = média das médias válidas de todas as disciplinas
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

// 2) Total de faltas (soma das faltas de todas as disciplinas)
let totalFaltas = 0;
resultados.forEach(function (r) { totalFaltas = totalFaltas + r.faltas; });
document.getElementById("total-faltas").textContent = totalFaltas;

// 3) Quantidade de disciplinas com bom desempenho
const qtdBom = resultados.filter(function (r) {
  return r.situacao === "Bom desempenho";
}).length;
document.getElementById("qtd-bom").textContent = qtdBom;

// 4) Quantidade de disciplinas que precisam de atenção
const qtdAtencao = resultados.filter(function (r) {
  return r.situacao === "Atenção";
}).length;
document.getElementById("qtd-atencao").textContent = qtdAtencao;

// 5) Frequência — ATENÇÃO:
// Este valor é APENAS DEMONSTRATIVO nesta primeira versão.
// Ele NÃO é calculado a partir das faltas.
// No futuro, a frequência será tratada de outra forma.
const frequenciaDemonstrativa = 92;
document.getElementById("frequencia").textContent =
  frequenciaDemonstrativa + "% — Frequência adequada";