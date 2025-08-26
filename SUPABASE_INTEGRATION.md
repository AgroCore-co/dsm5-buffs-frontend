# Integração com Supabase - DSM5 Buffs Frontend

Este documento explica como usar a integração com o Supabase implementada no projeto.

## 🚀 Configuração Inicial

### 1. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com suas credenciais do Supabase:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://snvnrhebdsrgoknsmrnp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNudm5yaGViZHNyZ29rbnNtcm5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MDUxMjAsImV4cCI6MjA3MDE4MTEyMH0.RQoWORwLRRSmsbszWYr38d7aRsbHG-u2mHwc5iIIkug
```

**⚠️ Importante:** Renomeie o arquivo `env.local` para `.env.local` para que o Next.js o reconheça.

### 2. Credenciais de Teste

Use estas credenciais para testar a integração:
- **Email:** teste@email.com
- **Senha:** 123456

## 🔐 Autenticação

### Hook useAuth

O hook `useAuth` foi atualizado para usar o Supabase real:

```javascript
import { useAuth } from '@/hooks/useAuth';

const { 
  user, 
  isAuthenticated, 
  isLoading, 
  login, 
  logout, 
  getAccessToken 
} = useAuth();
```

#### Funcionalidades disponíveis:

- **`user`**: Objeto com dados do usuário autenticado
- **`isAuthenticated`**: Boolean indicando se o usuário está logado
- **`isLoading`**: Boolean indicando estado de carregamento
- **`login(email, password)`**: Função para fazer login
- **`logout()`**: Função para fazer logout
- **`getAccessToken()`**: Função para obter o token JWT atual

### Exemplo de uso:

```javascript
const handleLogin = async () => {
  const result = await login(email, password);
  
  if (result.success) {
    console.log('Login realizado com sucesso!');
    console.log('Usuário:', result.user);
  } else {
    console.error('Erro no login:', result.error);
  }
};
```

## 📡 APIs do Supabase

### Classe SupabaseApi

Classe utilitária para fazer requisições autenticadas:

```javascript
import { SupabaseApi } from '@/utils/supabaseApi';

// GET - Buscar dados
const result = await SupabaseApi.get('tabela', {
  select: '*, relacionamento(*)',
  eq: { column: 'status', value: 'ativo' },
  order: { column: 'created_at', ascending: false },
  limit: 50
});

// POST - Inserir dados
const result = await SupabaseApi.post('tabela', {
  nome: 'Exemplo',
  status: 'ativo'
});

// PUT - Atualizar dados
const result = await SupabaseApi.put('tabela', {
  status: 'inativo'
}, id);

// DELETE - Remover dados
const result = await SupabaseApi.delete('tabela', id);
```



## 🧪 Testando a Integração

### 1. Acesse a página de exemplo

Navegue para `/exemplo-supabase` para testar todas as funcionalidades.

### 2. Fluxo de teste

1. **Faça login** com as credenciais de teste
2. **Verifique o status** da autenticação
3. **Obtenha o token** de acesso
4. **Teste as APIs** usando os botões disponíveis
5. **Verifique o console** para logs detalhados

### 3. Verificando no console

Abra o DevTools (F12) e verifique:
- **Console**: Logs das operações
- **Network**: Requisições para o Supabase
- **Application**: Token armazenado no localStorage

## 🔧 Personalização

### Adicionando novas APIs

Para criar uma nova API específica, adicione ao arquivo `supabaseApi.js`:

```javascript
export const NovaApi = {
  async getItems() {
    return await SupabaseApi.get('nova_tabela', {
      order: { column: 'created_at', ascending: false }
    });
  },

  async createItem(data) {
    return await SupabaseApi.post('nova_tabela', data);
  },

  async updateItem(id, data) {
    return await SupabaseApi.put('nova_tabela', data, id);
  },

  async deleteItem(id) {
    return await SupabaseApi.delete('nova_tabela', id);
  }
};
```

### Configurações do cliente

Para modificar as configurações do cliente Supabase, edite `src/lib/supabaseClient.js`:

```javascript
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: "sb-auth-token",
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
    // Adicione outras configurações conforme necessário
  }
);
```

## 🚨 Solução de Problemas

### Erro: "Invalid API key"

- Verifique se as variáveis de ambiente estão corretas
- Certifique-se de que o arquivo `.env.local` está na raiz do projeto
- Reinicie o servidor de desenvolvimento após criar o arquivo

### Erro: "User not found"

- Verifique se o usuário existe no Supabase
- Use as credenciais de teste fornecidas
- Verifique se a autenticação está habilitada no projeto Supabase

### Erro: "Table does not exist"

- Verifique se as tabelas existem no banco de dados
- Confirme os nomes das tabelas no código
- Verifique as permissões RLS (Row Level Security)

### Token não está sendo armazenado

- Verifique se `persistSession: true` está configurado
- Limpe o localStorage e tente novamente
- Verifique se não há bloqueios de cookies/armazenamento

## 📚 Recursos Adicionais

- [Documentação oficial do Supabase](https://supabase.com/docs)
- [Guia de autenticação](https://supabase.com/docs/guides/auth)
- [API Reference](https://supabase.com/docs/reference/javascript)
- [Exemplos de uso](https://supabase.com/docs/guides/examples)

## 🤝 Suporte

Se encontrar problemas:

1. Verifique o console do navegador para erros
2. Confirme as configurações das variáveis de ambiente
3. Teste com as credenciais de exemplo fornecidas
4. Verifique se o projeto Supabase está ativo e acessível
