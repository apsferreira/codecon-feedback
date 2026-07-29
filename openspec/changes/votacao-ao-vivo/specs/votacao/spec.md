## ADDED Requirements

### Requirement: Listagem de talks disponíveis para votação
O sistema SHALL exibir a lista de talks do evento disponíveis para votação, incluindo título e palestrante de cada uma.

#### Scenario: Usuário abre a tela inicial
- **WHEN** um usuário acessa a tela inicial da aplicação
- **THEN** o sistema exibe a lista de talks cadastradas, com título e palestrante visíveis para cada uma

### Requirement: Voto anônimo com nota obrigatória
O sistema SHALL permitir que qualquer pessoa registre um voto para uma talk com uma nota de 1 a 5, sem exigir autenticação ou identificação do votante.

#### Scenario: Envio de voto válido
- **WHEN** o usuário seleciona uma talk, escolhe uma nota entre 1 e 5 e confirma o voto
- **THEN** o sistema persiste o voto associado à talk, sem registrar qualquer identificador do votante

#### Scenario: Tentativa de voto sem nota
- **WHEN** o usuário tenta confirmar o voto sem selecionar uma nota
- **THEN** o sistema impede o envio e indica que a nota é obrigatória

#### Scenario: Tentativa de voto com nota fora do intervalo
- **WHEN** o backend recebe uma requisição de voto com rating fora do intervalo 1-5
- **THEN** o sistema rejeita a requisição com erro de validação, sem persistir o voto

### Requirement: Comentário opcional no voto
O sistema SHALL permitir que o usuário inclua um comentário de texto opcional junto com a nota ao votar.

#### Scenario: Voto com comentário
- **WHEN** o usuário preenche um comentário de texto além da nota e confirma o voto
- **THEN** o sistema persiste o comentário junto com a nota e o horário do voto

#### Scenario: Voto sem comentário
- **WHEN** o usuário confirma o voto deixando o campo de comentário em branco
- **THEN** o sistema persiste o voto normalmente, sem exigir o comentário

### Requirement: Navegação de volta na tela de votação
Toda tela do fluxo de votação SHALL oferecer uma forma clara de navegação de volta para a tela anterior.

#### Scenario: Usuário está na tela de votação de uma talk
- **WHEN** o usuário está na tela de formulário de voto de uma talk
- **THEN** o sistema exibe um controle de navegação visível que retorna à lista de talks
