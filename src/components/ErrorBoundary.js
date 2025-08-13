import React from 'react';
import { ServerError } from './errors';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Atualiza o estado para que a próxima renderização mostre a UI de fallback
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log do erro para console ou serviço de monitoramento
    console.error('Erro capturado pelo ErrorBoundary:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Aqui você pode enviar o erro para um serviço de monitoramento
    // como Sentry, LogRocket, etc.
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // UI de fallback personalizada
      return (
        <ServerError
          message="Ocorreu um erro inesperado na aplicação. Tente recarregar a página ou entre em contato com o suporte."
          showRetryButton={true}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
