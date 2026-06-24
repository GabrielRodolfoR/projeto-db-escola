const API_URL = "http://127.0.0.1:8001";

export const endpoints = {
  alunos: "/students/",
  professores: "/teachers/",
  materias: "/subjects/",
  turmas: "/class_groups/",
  matriculas: "/enrollments/",
  turmaMaterias: "/class_subjects/",
  aulas: "/lessons/",
  notas: "/grades/",
  frequencias: "/attendances/",
  usuarios: "/users/",
};
//React → api.js → FastAPI → View SQL → PostgreSQL
//Quando o usuário abre a tela de relatórios no React, o front chama a função listarRelatorio, que acessa uma rota da API, por exemplo /reports/boletim-aluno. No backend, o FastAPI recebe esse nome do relatório, identifica qual view corresponde a ele, como vw_boletim_aluno, executa um SELECT * FROM vw_boletim_aluno no PostgreSQL e transforma o resultado em JSON. Esse JSON volta para o React, que apenas exibe os dados em uma tabela.

export const endpointsRelatorios = {
  "boletim-aluno": "/reports/boletim-aluno",
  "existencia-aluno": "/reports/existencia-aluno",
  "frequencia-aluno": "/reports/frequencia-aluno",
  "grade-turma": "/reports/grade-turma",
  "media-aluno-materia": "/reports/media-aluno-materia",
  "professor-disciplinas": "/reports/professor-disciplinas",
  "frequencia-menor-media": "/reports/frequencia-menor-media",
};

async function request(endpoint, options = {}) {
  if (!endpoint) {
    throw new Error("Endpoint não encontrado.");
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    console.error("Erro da API:", error);

    throw new Error(error?.detail || "Erro ao comunicar com a API");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function listarTodos(chave) {
  return request(endpoints[chave]);
}

export function criarRegistro(chave, dados) {
  return request(endpoints[chave], {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

export function atualizarRegistro(chave, id, dados) {
  return request(`${endpoints[chave]}${id}`, {
    method: "PUT",
    body: JSON.stringify(dados),
  });
}

export function deletarRegistro(chave, id) {
  return request(`${endpoints[chave]}${id}`, {
    method: "DELETE",
  });
}

export function listarRelatorio(tipo) {
  return request(endpointsRelatorios[tipo]);
}