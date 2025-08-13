// Configurações de segurança para autenticação
export const AUTH_CONFIG = {
  // Tempo de expiração do token (em segundos)
  TOKEN_EXPIRY: 3600, // 1 hora
  
  // Rotas públicas que não precisam de autenticação
  PUBLIC_ROUTES: [
    '/auth/login',
    '/auth/register', 
    '/auth/forgot-password',
    '/auth/reset-password',
    '/suporte',
    '/500',
    '/404',
    '/_error',
    '/test-error'
  ],
  
  // Rotas que redirecionam para dashboard se já autenticado
  AUTH_REDIRECT_ROUTES: [
    '/auth/login',
    '/auth/register'
  ],
  
  // Headers de segurança para requisições autenticadas
  SECURITY_HEADERS: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json'
  }
};

// Função para verificar se uma rota é pública
export const isPublicRoute = (pathname) => {
  return AUTH_CONFIG.PUBLIC_ROUTES.some(route => 
    pathname.startsWith(route)
  );
};

// Função para verificar se uma rota deve redirecionar se autenticado
export const shouldRedirectIfAuthenticated = (pathname) => {
  return AUTH_CONFIG.AUTH_REDIRECT_ROUTES.some(route => 
    pathname.startsWith(route)
  );
};
