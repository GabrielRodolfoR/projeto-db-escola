import { useEffect, useMemo, useState } from "react";
import "./App.css";
import {
  atualizarRegistro,
  criarRegistro,
  deletarRegistro,
  listarTodos,
} from "./services/api";

function dataHoje() {
  return new Date().toISOString().slice(0, 10);
}

const telas = {
  alunos: {
    titulo: "Alunos",
    tabela: "Aluno",
    descricao: "Cadastro completo dos alunos da escola.",
    icone: "🎓",
    pk: "id_aluno",
    campos: [
      { nome: "nome", label: "Nome", type: "text", required: true },
      { nome: "cpf", label: "CPF", type: "text", required: true },
      { nome: "data_nascimento", label: "Data de nascimento", type: "date" },
      { nome: "email", label: "E-mail", type: "email" },
      { nome: "telefone", label: "Telefone", type: "text" },
    ],
    extrasTabela: ["data_cadastro"],
  },

  professores: {
    titulo: "Professores",
    tabela: "Professor",
    descricao: "Cadastro de professores, especialidades e salários.",
    icone: "👨‍🏫",
    pk: "id_professor",
    campos: [
      { nome: "nome", label: "Nome", type: "text", required: true },
      { nome: "cpf", label: "CPF", type: "text", required: true },
      { nome: "email", label: "E-mail", type: "email" },
      { nome: "especialidade", label: "Especialidade", type: "text" },
      { nome: "salario", label: "Salário", type: "number", step: "0.01" },
    ],
  },

  materias: {
    titulo: "Matérias",
    tabela: "Materia",
    descricao: "Cadastro das matérias e suas cargas horárias.",
    icone: "📚",
    pk: "id_materia",
    campos: [
      { nome: "nome", label: "Nome", type: "text", required: true },
      { nome: "carga_horaria", label: "Carga horária", type: "number" },
      { nome: "descricao", label: "Descrição", type: "textarea" },
    ],
  },

  turmas: {
    titulo: "Turmas",
    tabela: "Turma",
    descricao: "Organização das turmas por ano, semestre e turno.",
    icone: "🏫",
    pk: "id_turma",
    campos: [
      { nome: "nome", label: "Nome", type: "text", required: true },
      { nome: "ano", label: "Ano", type: "number" },
      { nome: "semestre", label: "Semestre", type: "number" },
      {
        nome: "turno",
        label: "Turno",
        type: "select",
        options: ["Matutino", "Vespertino", "Noturno"],
      },
    ],
  },

  matriculas: {
    titulo: "Matrículas",
    tabela: "Matricula",
    descricao: "Relacionamento entre alunos e turmas.",
    icone: "📝",
    pk: "id_matricula",
    campos: [
      {
        nome: "id_aluno",
        label: "Aluno",
        type: "foreign",
        source: "alunos",
        sourcePk: "id_aluno",
        sourceLabel: "nome",
        required: true,
      },
      {
        nome: "id_turma",
        label: "Turma",
        type: "foreign",
        source: "turmas",
        sourcePk: "id_turma",
        sourceLabel: "nome",
        required: true,
      },
      { nome: "data_matricula", label: "Data da matrícula", type: "date" },
      {
        nome: "status",
        label: "Status",
        type: "select",
        options: ["Ativa", "Trancada", "Cancelada", "Concluída"],
      },
    ],
  },

  turmaMaterias: {
    titulo: "Turma x Matéria",
    tabela: "Turma_Materia",
    descricao: "Vínculo entre turma, matéria e professor.",
    icone: "🔗",
    pk: "id_turma_materia",
    campos: [
      {
        nome: "id_turma",
        label: "Turma",
        type: "foreign",
        source: "turmas",
        sourcePk: "id_turma",
        sourceLabel: "nome",
        required: true,
      },
      {
        nome: "id_materia",
        label: "Matéria",
        type: "foreign",
        source: "materias",
        sourcePk: "id_materia",
        sourceLabel: "nome",
        required: true,
      },
      {
        nome: "id_professor",
        label: "Professor",
        type: "foreign",
        source: "professores",
        sourcePk: "id_professor",
        sourceLabel: "nome",
        required: true,
      },
    ],
  },

  aulas: {
    titulo: "Aulas",
    tabela: "Aula",
    descricao: "Registro das aulas aplicadas em cada turma e matéria.",
    icone: "📅",
    pk: "id_aula",
    campos: [
      {
        nome: "id_turma_materia",
        label: "Turma / Matéria / Professor",
        type: "foreign",
        source: "turmaMaterias",
        sourcePk: "id_turma_materia",
        customLabel: true,
        required: true,
      },
      { nome: "data_aula", label: "Data da aula", type: "date" },
      { nome: "conteudo", label: "Conteúdo", type: "textarea" },
    ],
  },

  notas: {
    titulo: "Notas",
    tabela: "Nota",
    descricao: "Lançamento de notas por matrícula e matéria.",
    icone: "⭐",
    pk: "id_nota",
    campos: [
      {
        nome: "id_matricula",
        label: "Matrícula",
        type: "foreign",
        source: "matriculas",
        sourcePk: "id_matricula",
        customLabel: true,
        required: true,
      },
      {
        nome: "id_materia",
        label: "Matéria",
        type: "foreign",
        source: "materias",
        sourcePk: "id_materia",
        sourceLabel: "nome",
        required: true,
      },
      { nome: "nota", label: "Nota", type: "number", step: "0.01" },
    ],
  },

  frequencias: {
    titulo: "Frequência",
    tabela: "Frequencia",
    descricao: "Controle de presença e falta dos alunos.",
    icone: "✅",
    pk: "id_frequencia",
    campos: [
      {
        nome: "id_aula",
        label: "Aula",
        type: "foreign",
        source: "aulas",
        sourcePk: "id_aula",
        customLabel: true,
        required: true,
      },
      {
        nome: "id_matricula",
        label: "Matrícula",
        type: "foreign",
        source: "matriculas",
        sourcePk: "id_matricula",
        customLabel: true,
        required: true,
      },
      {
        nome: "presente",
        label: "Presente?",
        type: "select",
        options: ["Sim", "Não"],
      },
    ],
  },

  usuarios: {
    titulo: "Usuários",
    tabela: "Usuario",
    descricao: "Usuários responsáveis pelo acesso ao sistema.",
    icone: "🔐",
    pk: "id_usuario",
    campos: [
      { nome: "login", label: "Login", type: "text", required: true },
      { nome: "senha", label: "Senha", type: "password", required: true },
      {
        nome: "perfil",
        label: "Perfil",
        type: "select",
        options: ["admin", "professor", "aluno"],
      },
    ],
  },

  relatorios: {
    titulo: "Relatórios",
    tabela: "Views",
    descricao: "Consultas baseadas em views e informações consolidadas.",
    icone: "📊",
    tipo: "relatorio",
  },
};

const relatorios = {
  "alunos-por-turma": {
    titulo: "Alunos por turma",
    descricao: "Mostra a quantidade de alunos com matrícula ativa em cada turma.",
  },
  "boletim-alunos": {
    titulo: "Boletim dos alunos",
    descricao: "Mostra aluno, turma, matéria, nota e situação.",
  },
  "frequencia-alunos": {
    titulo: "Frequência dos alunos",
    descricao: "Mostra presenças, faltas e percentual de presença.",
  },
  "aulas-professores": {
    titulo: "Aulas por professor",
    descricao: "Mostra aulas vinculadas a professores, matérias e turmas.",
  },
};

const estadoInicial = {
  alunos: [],
  professores: [],
  materias: [],
  turmas: [],
  matriculas: [],
  turmaMaterias: [],
  aulas: [],
  notas: [],
  frequencias: [],
  usuarios: [],
};

function App() {
  const [telaAtiva, setTelaAtiva] = useState("alunos");
  const [dados, setDados] = useState(estadoInicial);
  const [formulario, setFormulario] = useState({});
  const [editandoId, setEditandoId] = useState(null);
  const [relatorioAtivo, setRelatorioAtivo] = useState("alunos-por-turma");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const tela = telas[telaAtiva];

  useEffect(() => {
    carregarTudo();
  }, []);

  const metricas = useMemo(() => calcularMetricas(dados), [dados]);

  const dadosRelatorio = useMemo(() => {
    return gerarRelatorio(relatorioAtivo, dados);
  }, [relatorioAtivo, dados]);

  async function carregarTudo() {
    setCarregando(true);
    setErro("");

    try {
      const [
        alunos,
        professores,
        materias,
        turmas,
        matriculas,
        turmaMaterias,
        aulas,
        notas,
        frequencias,
        usuarios,
      ] = await Promise.all([
        listarTodos("alunos"),
        listarTodos("professores"),
        listarTodos("materias"),
        listarTodos("turmas"),
        listarTodos("matriculas"),
        listarTodos("turmaMaterias"),
        listarTodos("aulas"),
        listarTodos("notas"),
        listarTodos("frequencias"),
        listarTodos("usuarios"),
      ]);

      setDados({
        alunos,
        professores,
        materias,
        turmas,
        matriculas,
        turmaMaterias,
        aulas,
        notas,
        frequencias,
        usuarios,
      });
    } catch (error) {
      console.error(error);
      setErro("Não foi possível carregar os dados. Verifique se o backend está rodando.");
    } finally {
      setCarregando(false);
    }
  }

  function alterarCampo(campo, valor) {
    setFormulario({
      ...formulario,
      [campo]: valor,
    });
  }

  function prepararPayload() {
    const payload = {};

    tela.campos.forEach((campo) => {
      let valor = formulario[campo.nome];

      if (valor === "" || valor === undefined) {
        valor = null;
      }

      if (telaAtiva === "matriculas" && campo.nome === "data_matricula" && !valor) {
        valor = dataHoje();
      }

      if (telaAtiva === "aulas" && campo.nome === "data_aula" && !valor) {
        valor = dataHoje();
      }

      if (campo.type === "number" || campo.type === "foreign") {
        valor = valor === null ? null : Number(valor);
      }

      if (campo.nome === "presente") {
        valor = valor === "Sim";
      }

      payload[campo.nome] = valor;
    });

    return payload;
  }

  async function salvarRegistro(e) {
    e.preventDefault();

    if (tela.tipo === "relatorio") return;

    setErro("");

    try {
      const payload = prepararPayload();

      if (editandoId) {
        const atualizado = await atualizarRegistro(telaAtiva, editandoId, payload);

        setDados((prev) => ({
          ...prev,
          [telaAtiva]: prev[telaAtiva].map((item) =>
            item[tela.pk] === editandoId ? atualizado : item
          ),
        }));

        setFormulario({});
        setEditandoId(null);
        return;
      }

      const criado = await criarRegistro(telaAtiva, payload);

      setDados((prev) => ({
        ...prev,
        [telaAtiva]: [...prev[telaAtiva], criado],
      }));

      setFormulario({});
    } catch (error) {
      console.error(error);
      setErro(error.message || "Erro ao salvar registro.");
    }
  }

  function prepararFormulario(registro) {
    const copia = { ...registro };

    if (telaAtiva === "frequencias") {
      copia.presente = registro.presente === true ? "Sim" : "Não";
    }

    return copia;
  }

  function editarRegistro(registro) {
    setFormulario(prepararFormulario(registro));
    setEditandoId(registro[tela.pk]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function excluirRegistro(id) {
    const confirmar = window.confirm("Tem certeza que deseja excluir este registro?");

    if (!confirmar) return;

    setErro("");

    try {
      await deletarRegistro(telaAtiva, id);

      setDados((prev) => ({
        ...prev,
        [telaAtiva]: prev[telaAtiva].filter((item) => item[tela.pk] !== id),
      }));
    } catch (error) {
      console.error(error);
      setErro(error.message || "Erro ao excluir registro.");
    }
  }

  function cancelarEdicao() {
    setFormulario({});
    setEditandoId(null);
  }

  function buscarRegistro(source, sourcePk, id) {
    return dados[source]?.find((item) => String(item[sourcePk]) === String(id));
  }

  function labelTurmaMateria(registro) {
    if (!registro) return "-";

    const turma = buscarRegistro("turmas", "id_turma", registro.id_turma);
    const materia = buscarRegistro("materias", "id_materia", registro.id_materia);
    const professor = buscarRegistro(
      "professores",
      "id_professor",
      registro.id_professor
    );

    return `${turma?.nome || "Turma"} / ${materia?.nome || "Matéria"} / ${
      professor?.nome || "Professor"
    }`;
  }

  function labelMatricula(registro) {
    if (!registro) return "-";

    const aluno = buscarRegistro("alunos", "id_aluno", registro.id_aluno);
    const turma = buscarRegistro("turmas", "id_turma", registro.id_turma);

    return `${aluno?.nome || "Aluno"} - ${turma?.nome || "Turma"}`;
  }

  function labelAula(registro) {
    if (!registro) return "-";

    const turmaMateria = buscarRegistro(
      "turmaMaterias",
      "id_turma_materia",
      registro.id_turma_materia
    );

    return `${registro.data_aula || "Sem data"} - ${labelTurmaMateria(
      turmaMateria
    )}`;
  }

  function getCustomLabel(source, registro) {
    if (source === "turmaMaterias") return labelTurmaMateria(registro);
    if (source === "matriculas") return labelMatricula(registro);
    if (source === "aulas") return labelAula(registro);

    return "-";
  }

  function getColunas() {
    const campos = tela.campos.map((campo) => campo.nome);
    const extras = tela.extrasTabela || [];

    return [tela.pk, ...campos, ...extras];
  }

  function getLabelColuna(coluna) {
    const campoEncontrado = tela.campos?.find((campo) => campo.nome === coluna);

    if (campoEncontrado) return campoEncontrado.label;

    const labels = {
      id_aluno: "ID",
      id_professor: "ID",
      id_materia: "ID",
      id_turma: "ID",
      id_matricula: "ID",
      id_turma_materia: "ID",
      id_aula: "ID",
      id_nota: "ID",
      id_frequencia: "ID",
      id_usuario: "ID",
      data_cadastro: "Data de cadastro",
    };

    return labels[coluna] || coluna;
  }

  function formatarValor(coluna, valor) {
    if (valor === "" || valor === undefined || valor === null) return "-";

    const campo = tela.campos?.find((item) => item.nome === coluna);

    if (campo?.type === "foreign") {
      const registro = buscarRegistro(campo.source, campo.sourcePk, valor);

      if (campo.customLabel) {
        return getCustomLabel(campo.source, registro);
      }

      return registro?.[campo.sourceLabel] || `ID ${valor}`;
    }

    if (coluna === "senha") return "••••••••";

    if (coluna === "presente") {
      const presente = valor === true || valor === "Sim";

      return (
        <span className={presente ? "pill success" : "pill danger"}>
          {presente ? "Sim" : "Não"}
        </span>
      );
    }

    if (coluna === "status") {
      const ativa = matriculaEstaAtiva({ status: valor });

      return (
        <span className={ativa ? "pill success" : "pill neutral"}>
          {String(valor)}
        </span>
      );
    }

    return String(valor);
  }

  function renderCampo(campo) {
    if (campo.type === "textarea") {
      return (
        <textarea
          value={formulario[campo.nome] || ""}
          onChange={(e) => alterarCampo(campo.nome, e.target.value)}
          required={campo.required}
          placeholder={`Digite ${campo.label.toLowerCase()}`}
        />
      );
    }

    if (campo.type === "select") {
      return (
        <select
          value={formulario[campo.nome] || ""}
          onChange={(e) => alterarCampo(campo.nome, e.target.value)}
          required={campo.required}
        >
          <option value="">Selecione</option>

          {campo.options.map((opcao) => (
            <option key={opcao} value={opcao}>
              {opcao}
            </option>
          ))}
        </select>
      );
    }

    if (campo.type === "foreign") {
      const lista = dados[campo.source] || [];

      return (
        <select
          value={formulario[campo.nome] || ""}
          onChange={(e) => alterarCampo(campo.nome, e.target.value)}
          required={campo.required}
        >
          <option value="">
            {lista.length === 0 ? "Cadastre dados relacionados primeiro" : "Selecione"}
          </option>

          {lista.map((item) => (
            <option key={item[campo.sourcePk]} value={item[campo.sourcePk]}>
              {campo.customLabel
                ? getCustomLabel(campo.source, item)
                : item[campo.sourceLabel]}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={campo.type}
        step={campo.step || undefined}
        value={formulario[campo.nome] || ""}
        onChange={(e) => alterarCampo(campo.nome, e.target.value)}
        required={campo.required}
        placeholder={`Digite ${campo.label.toLowerCase()}`}
      />
    );
  }

  function renderTabela() {
    if (carregando) {
      return (
        <div className="empty">
          <strong>Carregando dados...</strong>
        </div>
      );
    }

    if (dados[telaAtiva].length === 0) {
      return (
        <div className="empty">
          <span>{tela.icone}</span>
          <strong>Nenhum registro cadastrado</strong>
          <p>Cadastre o primeiro registro usando o formulário.</p>
        </div>
      );
    }

    return (
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {getColunas().map((coluna) => (
                <th key={coluna}>{getLabelColuna(coluna)}</th>
              ))}
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {dados[telaAtiva].map((registro) => (
              <tr key={registro[tela.pk]}>
                {getColunas().map((coluna) => (
                  <td key={coluna}>{formatarValor(coluna, registro[coluna])}</td>
                ))}

                <td>
                  <div className="actions">
                    <button
                      className="btn-edit"
                      onClick={() => editarRegistro(registro)}
                    >
                      Editar
                    </button>

                    <button
                      className="btn-delete"
                      onClick={() => excluirRegistro(registro[tela.pk])}
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function renderRelatorio() {
    return (
      <section className="reports-page">
        <div className="kpi-grid">
          <div className="kpi-card">
            <span>📝</span>
            <div>
              <strong>{metricas.matriculasAtivas}</strong>
              <p>Matrículas ativas</p>
            </div>
          </div>

          <div className="kpi-card">
            <span>⭐</span>
            <div>
              <strong>{metricas.mediaGeral}</strong>
              <p>Média geral</p>
            </div>
          </div>

          <div className="kpi-card">
            <span>✅</span>
            <div>
              <strong>{metricas.percentualPresenca}%</strong>
              <p>Presença geral</p>
            </div>
          </div>

          <div className="kpi-card">
            <span>📅</span>
            <div>
              <strong>{dados.aulas.length}</strong>
              <p>Aulas registradas</p>
            </div>
          </div>
        </div>

        <div className="reports-layout">
          <aside className="reports-menu">
            {Object.keys(relatorios).map((chave) => (
              <button
                key={chave}
                className={
                  relatorioAtivo === chave
                    ? "report-button active"
                    : "report-button"
                }
                onClick={() => setRelatorioAtivo(chave)}
              >
                <strong>{relatorios[chave].titulo}</strong>
                <span>{relatorios[chave].descricao}</span>
              </button>
            ))}
          </aside>

          <section className="panel report-panel">
            <div className="panel-title">
              <div>
                <h3>{relatorios[relatorioAtivo].titulo}</h3>
                <p>{relatorios[relatorioAtivo].descricao}</p>
              </div>
            </div>

            {dadosRelatorio.length === 0 ? (
              <div className="empty">
                <span>📊</span>
                <strong>Nenhum dado encontrado</strong>
                <p>Cadastre dados relacionados para visualizar este relatório.</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      {Object.keys(dadosRelatorio[0]).map((coluna) => (
                        <th key={coluna}>{formatarCabecalho(coluna)}</th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {dadosRelatorio.map((linha, index) => (
                      <tr key={index}>
                        {Object.keys(linha).map((coluna) => (
                          <td key={coluna}>{linha[coluna]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </section>
    );
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">DB</div>
          <div>
            <h1>Escola DB</h1>
            <p>Painel Administrativo</p>
          </div>
        </div>

        <nav className="menu">
          {Object.keys(telas).map((chave) => (
            <button
              key={chave}
              onClick={() => {
                setTelaAtiva(chave);
                setFormulario({});
                setEditandoId(null);
                setErro("");
              }}
              className={telaAtiva === chave ? "menu-item ativo" : "menu-item"}
            >
              <span>{telas[chave].icone}</span>
              {telas[chave].titulo}
            </button>
          ))}
        </nav>

        <button className="clear-button" onClick={carregarTudo}>
          Recarregar dados
        </button>
      </aside>

      <main className="main">
        <header className="header">
          <div>
            <span className="badge">{tela.tabela}</span>
            <h2>{tela.titulo}</h2>
            <p>{tela.descricao}</p>
          </div>

          <div className="header-card">
            <strong>
              {tela.tipo === "relatorio" ? "Views" : dados[telaAtiva].length}
            </strong>
            <span>{tela.tipo === "relatorio" ? "relatórios" : "registros"}</span>
          </div>
        </header>

        {erro && (
          <section className="panel" style={{ marginBottom: "20px" }}>
            <strong style={{ color: "#dc2626" }}>{erro}</strong>
          </section>
        )}

        {tela.tipo === "relatorio" ? (
          renderRelatorio()
        ) : (
          <div className="content-grid">
            <section className="panel form-panel">
              <div className="panel-title">
                <div>
                  <h3>{editandoId ? "Editar registro" : "Novo registro"}</h3>
                  <p>Preencha os campos para salvar no sistema.</p>
                </div>
              </div>

              <form onSubmit={salvarRegistro}>
                <div className="form-grid">
                  {tela.campos.map((campo) => (
                    <div
                      className={campo.type === "textarea" ? "field field-full" : "field"}
                      key={campo.nome}
                    >
                      <label>{campo.label}</label>
                      {renderCampo(campo)}
                    </div>
                  ))}
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    {editandoId ? "Salvar alterações" : "Cadastrar"}
                  </button>

                  {editandoId && (
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={cancelarEdicao}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </section>

            <section className="panel table-panel">
              <div className="panel-title">
                <div>
                  <h3>Registros cadastrados</h3>
                  <p>Dados vindos diretamente da API.</p>
                </div>
              </div>

              {renderTabela()}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

function normalizarTexto(valor) {
  return String(valor || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function matriculaEstaAtiva(matricula) {
  const status = normalizarTexto(matricula?.status);

  return status === "ativa" || status === "ativo" || status === "active";
}

function calcularMetricas(dados) {
  const matriculasAtivas = dados.matriculas.filter(matriculaEstaAtiva).length;

  const notasValidas = dados.notas
    .map((item) => Number(item.nota))
    .filter((nota) => !Number.isNaN(nota));

  const mediaGeral =
    notasValidas.length === 0
      ? "0.0"
      : (
          notasValidas.reduce((total, nota) => total + nota, 0) /
          notasValidas.length
        ).toFixed(1);

  const totalFrequencias = dados.frequencias.length;

  const presencas = dados.frequencias.filter(
    (item) => item.presente === true || item.presente === "Sim"
  ).length;

  const percentualPresenca =
    totalFrequencias === 0
      ? 0
      : Math.round((presencas / totalFrequencias) * 100);

  return {
    matriculasAtivas,
    mediaGeral,
    percentualPresenca,
  };
}

function gerarRelatorio(tipo, dados) {
  if (tipo === "alunos-por-turma") {
    return dados.turmas.map((turma) => {
      const matriculasAtivas = dados.matriculas.filter(
        (matricula) =>
          String(matricula.id_turma) === String(turma.id_turma) &&
          matriculaEstaAtiva(matricula)
      );

      return {
        turma: turma.nome || "-",
        ano: turma.ano || "-",
        semestre: turma.semestre || "-",
        turno: turma.turno || "-",
        total_alunos_ativos: matriculasAtivas.length,
      };
    });
  }

  if (tipo === "boletim-alunos") {
    return dados.notas.map((nota) => {
      const matricula = dados.matriculas.find(
        (item) => String(item.id_matricula) === String(nota.id_matricula)
      );

      const aluno = dados.alunos.find(
        (item) => String(item.id_aluno) === String(matricula?.id_aluno)
      );

      const turma = dados.turmas.find(
        (item) => String(item.id_turma) === String(matricula?.id_turma)
      );

      const materia = dados.materias.find(
        (item) => String(item.id_materia) === String(nota.id_materia)
      );

      const valorNota = Number(nota.nota);

      let situacao = "-";

      if (!Number.isNaN(valorNota)) {
        if (valorNota >= 7) situacao = "Aprovado";
        else if (valorNota >= 5) situacao = "Recuperação";
        else situacao = "Reprovado";
      }

      return {
        aluno: aluno?.nome || "-",
        turma: turma?.nome || "-",
        materia: materia?.nome || "-",
        nota: nota.nota || "-",
        situacao,
      };
    });
  }

  if (tipo === "frequencia-alunos") {
    return dados.matriculas.map((matricula) => {
      const aluno = dados.alunos.find(
        (item) => String(item.id_aluno) === String(matricula.id_aluno)
      );

      const turma = dados.turmas.find(
        (item) => String(item.id_turma) === String(matricula.id_turma)
      );

      const frequencias = dados.frequencias.filter(
        (freq) => String(freq.id_matricula) === String(matricula.id_matricula)
      );

      const presencas = frequencias.filter(
        (freq) => freq.presente === true || freq.presente === "Sim"
      ).length;

      const faltas = frequencias.filter(
        (freq) => freq.presente === false || freq.presente === "Não"
      ).length;

      const percentual =
        frequencias.length === 0
          ? 0
          : Math.round((presencas / frequencias.length) * 100);

      return {
        aluno: aluno?.nome || "-",
        turma: turma?.nome || "-",
        status_matricula: matricula.status || "-",
        aulas_registradas: frequencias.length,
        presencas,
        faltas,
        percentual_presenca: `${percentual}%`,
      };
    });
  }

  if (tipo === "aulas-professores") {
    return dados.aulas.map((aula) => {
      const turmaMateria = dados.turmaMaterias.find(
        (item) =>
          String(item.id_turma_materia) === String(aula.id_turma_materia)
      );

      const turma = dados.turmas.find(
        (item) => String(item.id_turma) === String(turmaMateria?.id_turma)
      );

      const materia = dados.materias.find(
        (item) => String(item.id_materia) === String(turmaMateria?.id_materia)
      );

      const professor = dados.professores.find(
        (item) =>
          String(item.id_professor) === String(turmaMateria?.id_professor)
      );

      return {
        data_aula: aula.data_aula || "-",
        professor: professor?.nome || "-",
        materia: materia?.nome || "-",
        turma: turma?.nome || "-",
        conteudo: aula.conteudo || "-",
      };
    });
  }

  return [];
}

function formatarCabecalho(texto) {
  return texto.replaceAll("_", " ");
}

export default App;