# Sistema de Gestão Escolar - Banco de Dados

## Sobre o Projeto

Este projeto consiste na modelagem e implementação de um banco de dados relacional para um Sistema de Gestão Escolar.

O objetivo é centralizar e gerenciar informações acadêmicas e administrativas de uma instituição de ensino, permitindo o controle de alunos, professores, turmas, disciplinas, matrículas, notas, frequência e usuários do sistema.

---

# Tecnologias Utilizadas

* PostgreSQL
* Modelo Relacional

---

# Funcionalidades

* Cadastro de Alunos
* Cadastro de Professores
* Cadastro de Matérias
* Cadastro de Turmas
* Matrícula de Alunos
* Associação de Professores às Matérias
* Registro de Aulas
* Controle de Frequência
* Lançamento de Notas
* Controle de Usuários e Permissões

---

# Estrutura do Banco de Dados

O banco é composto pelas seguintes tabelas:

| Tabela        | Descrição                                |
| ------------- | ---------------------------------------- |
| Aluno         | Armazena os dados dos estudantes         |
| Professor     | Armazena os dados dos docentes           |
| Materia       | Cadastro das disciplinas                 |
| Turma         | Cadastro das turmas                      |
| Matricula     | Relaciona alunos e turmas                |
| Turma_Materia | Relaciona turmas, matérias e professores |
| Aula          | Registro das aulas ministradas           |
| Nota          | Controle de notas dos alunos             |
| Frequencia    | Controle de presença                     |
| Usuario       | Controle de acesso ao sistema            |

---

# Modelo de Relacionamento

```text
Aluno
  │
  └── Matricula ── Turma
                       │
                       └── Turma_Materia
                              │
                ┌─────────────┴─────────────┐
                │                           │
            Materia                    Professor
                │
                └── Aula
                       │
                  Frequencia

Matricula
    │
    ├── Nota
    └── Frequencia
```

---

# Regras de Negócio

- RN01
  - Cada aluno possui um identificador único.
- RN02
  - CPF de alunos e professores não pode ser duplicado.
- RN03
  - Um aluno pode estar matriculado em várias turmas ao longo dos anos.
- RN04
  - Uma turma pode possuir várias matérias.
- RN05
  - Cada matéria ministrada em uma turma deve possuir um professor responsável.
- RN06
  - As notas são vinculadas à matrícula do aluno.
- RN07
  - A frequência é registrada por aula.
- RN08
  - Cada usuário possui um perfil de acesso.
---

# Estrutura das Tabelas

## Aluno

| Campo           | Tipo         |
| --------------- | ------------ |
| id_aluno        | SERIAL       |
| nome            | VARCHAR(100) |
| cpf             | VARCHAR(14)  |
| data_nascimento | DATE         |
| email           | VARCHAR(100) |
| telefone        | VARCHAR(20)  |
| data_cadastro   | TIMESTAMP    |

---

## Professor

| Campo         | Tipo          |
| ------------- | ------------- |
| id_professor  | SERIAL        |
| nome          | VARCHAR(100)  |
| cpf           | VARCHAR(14)   |
| email         | VARCHAR(100)  |
| especialidade | VARCHAR(100)  |
| salario       | NUMERIC(10,2) |

---

## Materia

| Campo         | Tipo         |
| ------------- | ------------ |
| id_materia    | SERIAL       |
| nome          | VARCHAR(100) |
| carga_horaria | INTEGER      |
| descricao     | TEXT         |

---

## Turma

| Campo    | Tipo        |
| -------- | ----------- |
| id_turma | SERIAL      |
| nome     | VARCHAR(50) |
| ano      | INTEGER     |
| semestre | INTEGER     |
| turno    | VARCHAR(20) |

---

## Matricula

Relaciona alunos e turmas.

| Campo          | Tipo        |
| -------------- | ----------- |
| id_matricula   | SERIAL      |
| id_aluno       | INTEGER     |
| id_turma       | INTEGER     |
| data_matricula | DATE        |
| status         | VARCHAR(20) |

---

## Turma_Materia

Relaciona turma, matéria e professor.

| Campo            | Tipo    |
| ---------------- | ------- |
| id_turma_materia | SERIAL  |
| id_turma         | INTEGER |
| id_materia       | INTEGER |
| id_professor     | INTEGER |

---

## Aula

| Campo            | Tipo    |
| ---------------- | ------- |
| id_aula          | SERIAL  |
| id_turma_materia | INTEGER |
| data_aula        | DATE    |
| conteudo         | TEXT    |

---

## Nota

| Campo        | Tipo         |
| ------------ | ------------ |
| id_nota      | SERIAL       |
| id_matricula | INTEGER      |
| id_materia   | INTEGER      |
| nota         | NUMERIC(4,2) |

---

## Frequencia

| Campo         | Tipo    |
| ------------- | ------- |
| id_frequencia | SERIAL  |
| id_aula       | INTEGER |
| id_matricula  | INTEGER |
| presente      | BOOLEAN |

---

## Usuario

| Campo      | Tipo         |
| ---------- | ------------ |
| id_usuario | SERIAL       |
| login      | VARCHAR(50)  |
| senha      | VARCHAR(255) |
| perfil     | VARCHAR(20)  |

---

# Perfis de Usuário

| Perfil      | Permissões                |
| ----------- | ------------------------- |
| ADMIN       | Controle total do sistema |
| SECRETARIA  | Cadastros e matrículas    |
| PROFESSOR   | Notas e frequência        |
| COORDENADOR | Consultas e relatórios    |

---

# Autores

Gabriel Rodolfo Rabello
Eduardo Samuel Barbosa de Moraes
Paulocesar Galdino Darosa
Miguel Machado Gomes