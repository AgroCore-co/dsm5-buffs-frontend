import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';

const AuthCallback = () => {
  const router = useRouter();
  const { checkUserProfile, getAccessToken } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Aguarda um pouco para garantir que a sessão foi estabelecida
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const token = await getAccessToken();
        if (!token) {
          // Se não há token, redireciona para login
          router.push('/auth/login');
          return;
        }

        // Verifica se o usuário tem perfil
        const hasProfile = await checkUserProfile(token);
        
        if (hasProfile) {
          router.push('/dashboard');
        } else {
          router.push('/complete-profile');
        }
      } catch (error) {
        console.error('Erro no callback de autenticação:', error);
        router.push('/auth/login');
      }
    };

    handleAuthCallback();
  }, [router, checkUserProfile, getAccessToken]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Finalizando login...</p>
      </div>
    </div>
  );
};

export default AuthCallback;