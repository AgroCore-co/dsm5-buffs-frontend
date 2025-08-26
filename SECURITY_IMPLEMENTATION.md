# 🔒 Sistema de Segurança - DSM5 Buffs Frontend

## Visão Geral
Este documento descreve o sistema de segurança implementado para proteger todas as rotas da aplicação, garantindo que apenas usuários autenticados possam acessar as funcionalidades.

## 🛡️ Camadas de Segurança

### 1. **Proteção de Rotas Global (`_app.js`)**
- Todas as rotas que não começam com `/auth` são automaticamente protegidas
- Aplica o componente `Layout` que inclui `ProtectedRoute`
- Usa o hook `useRouteProtection` para verificação global

### 2. **Componente ProtectedRoute**
- Verifica se o usuário está autenticado
- Valida se o token de acesso ainda é válido
- Redireciona para `/auth/login` se não autenticado
- Mostra componente de loading durante verificação

### 3. **Hook useRouteProtection**
- Proteção adicional em nível de aplicação
- Redireciona usuários não autenticados para login
- Redireciona usuários autenticados para dashboard se tentarem acessar rotas de auth

### 4. **Configuração de Segurança (`authConfig.js`)**
- Define rotas públicas e protegidas
- Configurações centralizadas de segurança
- Headers de segurança para requisições

## 🚫 Rotas Protegidas
Todas as seguintes rotas requerem autenticação:
- `/dashboard`
- `/rebanho`
- `/lactacao`
- `/reproducao`
- `/manejo`
- `/alimentacao`
- `/equipe`
- `/configuracoes`
- `/exemplo-supabase`

## ✅ Rotas Públicas
Apenas as seguintes rotas são acessíveis sem autenticação:
- `/auth/login`
- `/auth/register`
- `/auth/forgot-password`
- `/auth/reset-password`

## 🔄 Fluxo de Redirecionamento

### Usuário Não Autenticado:
1. Tenta acessar rota protegida
2. `ProtectedRoute` detecta falta de autenticação
3. Redireciona para `/auth/login`
4. Após login bem-sucedido, redireciona para `/dashboard`

### Usuário Autenticado:
1. Tenta acessar rota de auth (ex: `/auth/login`)
2. `useRouteProtection` detecta autenticação
3. Redireciona automaticamente para `/dashboard`

## 🛠️ Implementação Técnica

### Arquivos Principais:
- `src/components/ProtectedRoute.js` - Componente de proteção
- `src/hooks/useRouteProtection.js` - Hook de proteção global
- `src/lib/authConfig.js` - Configurações de segurança
- `src/pages/_app.js` - Aplicação da proteção global
- `src/components/Layout.js` - Layout com proteção integrada

### Verificações de Segurança:
1. **Estado de autenticação** via `useAuth`
2. **Validade do token** via `getAccessToken()`
3. **Tipo de rota** (pública vs protegida)
4. **Redirecionamento automático** para rotas apropriadas

## 🔐 Headers de Segurança
O Next.js está configurado com headers de segurança:
- `X-Frame-Options: DENY` - Previne clickjacking
- `X-Content-Type-Options: nosniff` - Previne MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin` - Controle de referrer

## 📱 Experiência do Usuário
- **Loading states** durante verificações de autenticação
- **Redirecionamento automático** sem interrupções
- **Feedback visual** através de componentes de loading
- **Navegação fluida** entre rotas protegidas

## 🚨 Cenários de Segurança

### Cenário 1: Usuário não autenticado
```
Usuário → Rota protegida → Redirecionado para /auth/login
```

### Cenário 2: Token expirado
```
Usuário → Rota protegida → Token inválido → Redirecionado para /auth/login
```

### Cenário 3: Usuário autenticado em rota de auth
```
Usuário → /auth/login → Já autenticado → Redirecionado para /dashboard
```

## 🔧 Manutenção e Atualizações

### Adicionar Nova Rota Protegida:
1. A rota será automaticamente protegida se usar o `Layout`
2. Para rotas customizadas, importe `ProtectedRoute`

### Adicionar Nova Rota Pública:
1. Adicione em `src/lib/authConfig.js` na lista `PUBLIC_ROUTES`
2. Atualize `useRouteProtection` se necessário

### Modificar Comportamento de Redirecionamento:
1. Edite `src/hooks/useRouteProtection.js`
2. Atualize configurações em `src/lib/authConfig.js`

## ✅ Status de Implementação
- [x] Proteção de rotas global
- [x] Componente ProtectedRoute
- [x] Hook useRouteProtection
- [x] Configurações centralizadas
- [x] Headers de segurança
- [x] Redirecionamento automático
- [x] Proteção de todas as páginas principais
- [x] Documentação completa

## 🎯 Próximos Passos Recomendados
1. Implementar refresh token automático
2. Adicionar logging de tentativas de acesso não autorizado
3. Implementar rate limiting para tentativas de login
4. Adicionar autenticação de dois fatores (2FA)
5. Implementar sessões múltiplas
