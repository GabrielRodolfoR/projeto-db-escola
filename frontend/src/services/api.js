const API_URL = "http://127.0.0.1:8000";

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

async function request(endpoint, options = {}) {
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