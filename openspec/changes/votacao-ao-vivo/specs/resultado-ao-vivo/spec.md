## ADDED Requirements

### Requirement: Estatísticas agregadas em tempo real por talk
O sistema SHALL exibir, para cada talk, estatísticas agregadas dos votos recebidos (média de nota e total de votos), atualizadas automaticamente sem exigir reload manual da página.

#### Scenario: Novo voto é registrado enquanto a tela de resultado está aberta
- **WHEN** um voto é registrado para uma talk cuja tela de resultado está aberta em outro dispositivo
- **THEN** a tela de resultado reflete a média e o total de votos atualizados em até alguns segundos, sem que o usuário precise recarregar a página

#### Scenario: Talk ainda sem votos
- **WHEN** o usuário abre a tela de resultado de uma talk que ainda não recebeu nenhum voto
- **THEN** o sistema exibe um estado indicando ausência de votos, sem erro

### Requirement: Feed de comentários visível na tela de resultado
O sistema SHALL exibir na tela de resultado uma lista visível de comentários recebidos, cada um mostrando a nota, o texto do comentário e o horário do voto, ordenada do mais recente para o mais antigo.

#### Scenario: Talk com múltiplos comentários
- **WHEN** o usuário abre a tela de resultado de uma talk que recebeu vários votos com comentário
- **THEN** o sistema exibe a lista de comentários com nota, texto e horário, ordenada do voto mais recente para o mais antigo

#### Scenario: Voto sem comentário não aparece no feed
- **WHEN** um voto é registrado sem comentário
- **THEN** esse voto não aparece na lista de comentários da tela de resultado, mas é contabilizado nas estatísticas agregadas

#### Scenario: Novo comentário chega enquanto a tela está aberta
- **WHEN** um novo voto com comentário é registrado para a talk exibida na tela de resultado
- **THEN** o comentário aparece no topo da lista em até alguns segundos, sem reload manual

### Requirement: Navegação de volta na tela de resultado
A tela de resultado ao vivo SHALL oferecer uma forma clara de navegação de volta para a tela anterior.

#### Scenario: Usuário está na tela de resultado de uma talk
- **WHEN** o usuário está na tela de resultado ao vivo de uma talk
- **THEN** o sistema exibe um controle de navegação visível que retorna à lista de talks
