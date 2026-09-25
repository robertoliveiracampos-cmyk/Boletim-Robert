/* ===== Variáveis de cor (fácil de mudar depois) ===== */
:root {
  --roxo: #6a3fb5;          /* cor principal */
  --roxo-escuro: #4e2d8a;   /* para hover e detalhes */
  --lilas: #ede6f7;         /* cor secundária (fundo suave) */
  --lilas-borda: #d6c7ec;   /* borda lilás */
  --texto: #2e2a35;         /* cor do texto */
  --texto-suave: #6b6577;   /* textos secundários */
  --branco: #ffffff;
  --sombra: 0 2px 8px rgba(106, 63, 181, 0.08);
  --raio: 14px;             /* cantos arredondados */
}

/* ===== Reset básico ===== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Segoe UI", Roboto, Arial, sans-serif;
  background-color: var(--lilas);
  color: var(--texto);
  line-height: 1.5;
}

/* ===== Cabeçalho ===== */
.cabecalho {
  background-color: var(--roxo);
  color: var(--branco);
  padding: 24px 20px;
  text-align: center;
}

.cabecalho h1 {
  font-size: 1.8rem;
  letter-spacing: 0.5px;
}

.subtitulo {
  margin-top: 4px;
  font-size: 1rem;
  opacity: 0.9;
}

/* ===== Conteúdo principal ===== */
.conteudo {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px 16px 40px;
}

/* ===== Cards de resumo ===== */
.cards-resumo {
  display: grid;
  /* No celular fica 1 coluna, no desktop até 3 */
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 14px;
  margin-bottom: 28px;
}

.card {
  background-color: var(--branco);
  border: 1px solid var(--lilas-borda);
  border-radius: var(--raio);
  padding: 16px;
  box-shadow: var(--sombra);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card-titulo {
  font-size: 0.85rem;
  color: var(--texto-suave);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-valor {
  font-size: 1.4rem;
  font-weight: bold;
  color: var(--roxo);
}

/* ===== Área da tabela ===== */
.area-tabela h2 {
  font-size: 1.2rem;
  margin-bottom: 12px;
  color: var(--roxo-escuro);
}

/* Permite rolar a tabela no celular sem quebrar o layout */
.tabela-rolavel {
  overflow-x: auto;
  border-radius: var(--raio);
  box-shadow: var(--sombra);
}

.tabela-boletim {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--branco);
  min-width: 640px; /* garante que a tabela não fique espremida demais */
}

.tabela-boletim th,
.tabela-boletim td {
  padding: 12px 14px;
  text-align: center;
  border-bottom: 1px solid var(--lilas-borda);
  font-size: 0.92rem;
}

/* Primeira coluna (disciplina) alinhada à esquerda */
.tabela-boletim th:first-child,
.tabela-boletim td:first-child {
  text-align: left;
  font-weight: 600;
}

.tabela-boletim thead th {
  background-color: var(--roxo);
  color: var(--branco);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

/* Linhas alternadas para facilitar a leitura */
.tabela-boletim tbody tr:nth-child(even) {
  background-color: #faf7fe;
}

/* ===== Situações (cores dos textos) ===== */
.situacao-bom {
  color: #1f8a4c;
  font-weight: 600;
}

.situacao-atencao {
  color: #c0392b;
  font-weight: 600;
}

.situacao-sem-nota {
  color: var(--texto-suave);
  font-style: italic;
}

/* ===== Ajustes para telas pequenas ===== */
@media (max-width: 480px) {
  .cabecalho h1 {
    font-size: 1.5rem;
  }

  .card-valor {
    font-size: 1.2rem;
  }

  .tabela-boletim th,
  .tabela-boletim td {
    padding: 10px;
    font-size: 0.85rem;
  }
}