import { Api } from '../axios-config';

interface IAuth {
  token: string; 
  role: string;
  name: string;
}

const auth = async (email: string, senha: string): Promise<IAuth | Error> => {
  try {
    const { data } = await Api.post('/auth/login', { email, senha }); 

    if (data && data.token) { // Verifique se 'token' está presente na resposta
      return { token: data.token, role: data.role, name: data.name, }; // Retorna a resposta com 'token'
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
