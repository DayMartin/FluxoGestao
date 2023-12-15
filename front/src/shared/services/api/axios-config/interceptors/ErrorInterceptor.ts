import { AxiosError } from "axios";

export const errorInterceptor = (error: AxiosError) => {
  if (error.message === 'Network Error') {
    // Trate o erro de conexão aqui
    console.error("Erro de conexão:", error.message);
    // Retorne uma promessa rejeitada com uma mensagem personalizada
    return Promise.reject(new Error('Erro de conexão.'));
  }

  if (error.response?.status === 401) {
    // Trate o erro 401 aqui
    console.error("Erro 401:", error.response.data);
    // Retorne uma promessa rejeitada com uma mensagem personalizada
    return Promise.reject(new Error('Erro 401: Não autorizado.'));
  }

  if (error.response?.status === 404) {
    // Trate o erro 404 aqui
    alert("E-mail ou senha incorretos'");
    // Retorne uma promessa rejeitada com uma mensagem personalizada
    return Promise.reject(new Error('Erro 404: Não encontrado no banco de dados.'));
  }

  if (error.response?.status === 422) {
    // Trate o erro 422 aqui
    alert("Erro 422: Por favor, utilize outro e-mail!'");
    // Retorne uma promessa rejeitada com uma mensagem personalizada
    return Promise.reject(new Error('Erro 422: Por favor, utilize outro e-mail!'));
  }

  if (error.response?.status === 501) {
    // Trate o erro 501 aqui
    alert("Erro 501: Não encontrado Log para essa ordem de serviço!'");
    // Retorne uma promessa rejeitada com uma mensagem personalizada
    return Promise.reject(new Error('Erro 501: Não encontrado Log!!'));
  }

  // Se nenhum tratamento específico foi aplicado, apenas rejeite o erro original
  return Promise.reject(error);
};
