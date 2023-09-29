import { Api } from '../axios-config';

interface IAuth {
  token: string; // Alterar para 'token' em vez de 'accessToken'
}

const auth = async (email: string, senha: string): Promise<IAuth | Error> => {
  try {
    const { data } = await Api.post('/auth/login', { email, senha }); // Remova a chave 'data'

    if (data && data.token) { // Verifique se 'token' está presente na resposta
      return { token: data.token }; // Retorna a resposta com 'token'
    }

    return new Error('Erro no login.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro no login.');
  }
};

export const AuthService = {
  auth,
};
