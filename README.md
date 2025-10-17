# 🐃 BUFFS API - Checklist de Integração

## 1. Autenticação e Usuários
- [ ] Cadastro de usuário (Supabase Auth) → `supabase.auth.signUp()`
- [ ] Confirmação de email (se habilitado)
- [X] Login → `supabase.auth.signInWithPassword()` ou `signInWithOAuth()`
- [X] Obtenção do JWT (access_token) para todas as requisições
- [X] Renovação de token → `POST /auth/refresh`
- [X] Logout → `POST /auth/signout`
- [ ] Criação de perfil de usuário → `POST /usuarios` (após login)
- [ ] Criação de funcionários → `POST /usuarios/funcionarios` (Proprietário/Gerente)
- [ ] Definir cargos e permissões:
  - PROPRIETARIO ✅
  - GERENTE ✅
  - FUNCIONARIO ✅
  - VETERINARIO ✅

---

## 2. Gestão de Propriedade
### Propriedades (PROPRIETARIO)
- [X] Criar propriedade → `POST /propriedades`
- [] Atualizar propriedade → `PUT /propriedades/:id`
- [X] Listar propriedades → `GET /propriedades`
- [ ] Remover propriedade → `DELETE /propriedades/:id`

### Lotes / Piquetes (PROPRIETARIO)
- [ ] Criar lote → `POST /lotes`
- [ ] Atualizar lote → `PUT /lotes/:id`
- [X] Listar lotes → `GET /lotes`
- [ ] Remover lote → `DELETE /lotes/:id`

### Endereços (PROPRIETARIO)
- [X] Criar endereço → `POST /enderecos`
- [ ] Atualizar endereço → `PUT /enderecos/:id`
- [ ] Listar endereços → `GET /enderecos`
- [ ] Remover endereço → `DELETE /enderecos/:id`

---

## 3. Rebanho
### Búfalos (Todos os cargos)
- [ ] Criar búfalo → `POST /bufalos`
- [ ] Atualizar búfalo → `PUT /bufalos/:id`
- [ ] Listar búfalos → `GET /bufalos`
- [ ] Movimentação de lotes → `POST /movimentacao-lotes`, `PUT /movimentacao-lotes/:id`
- [ ] Grupos → `POST /grupos`, `PUT /grupos/:id`
- [ ] Raças → `POST /racas`, `PUT /racas/:id`

### IA / Genealogia
- [ ] Criar árvore genealógica → `POST /genealogia`
- [ ] Simulação de acasalamento → `POST /simular-acasalamento`

---

## 4. Alimentação
- [ ] Definições de alimentação → `POST /alimentacao-defs`, `PUT /alimentacao-defs/:id`
- [ ] Registro de alimentação → `POST /registros-alimentacao`, `PUT /registros-alimentacao/:id`

---

## 5. Saúde / Zootecnia
- [ ] Dados zootécnicos → `POST /dados-zootecnicos`, `PUT /dados-zootecnicos/:id`
- [ ] Medicamentos → `POST /medicacoes`, `PUT /medicacoes/:id`
- [ ] Dados sanitários → `POST /dados-sanitarios`, `PUT /dados-sanitarios/:id`
- [ ] Frequência de doenças → `GET /frequencia-doencas`

---

## 6. Reprodução
- [ ] Cobertura → `POST /coberturas`, `PUT /coberturas/:id`
- [ ] Material genético → `POST /material-genetico`, `PUT /material-genetico/:id`

---

## 7. Produção
- [ ] Lactação / Controle de leite → `POST /dados-lactacao`, `PUT /dados-lactacao/:id`
- [ ] Estoque de leite → `POST /estoques-leite`, `PUT /estoques-leite/:id`
- [ ] Coletas de leite → `POST /coletas`, `PUT /coletas/:id`
- [ ] Ciclos de lactação → `POST /ciclos-lactacao`, `PUT /ciclos-lactacao/:id`
- [ ] Indústrias → `POST /industrias`, `PUT /industrias/:id`

---

## 8. Alertas e Monitoramento
- [ ] Criar alertas → `POST /alertas`

---

## 9. Dashboard e Estatísticas
- [X] Estatísticas gerais → `GET /dashboard-stats`

---

