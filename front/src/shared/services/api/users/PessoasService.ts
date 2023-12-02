import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface IListagemPessoa {
    name: string;
  matricula: string;
  setor: string;
  turno: string;
  equipe: string;
  email: string;
  senha: string;
  situacao: string;
  roles: string[];
}

export interface IDetalhePessoa {
  _id: string;
  name: string;
  matricula: string;
  setor: string;
  turno: string;
  equipe: string;
  email: string;
  senha: string;
  roles: string[];
}

type TPessoasComTotalCount = {
  data: IListagemPessoa[];
  totalCount: number;
};

const getAll = async (page = 1, filter = ''): Promise<TPessoasComTotalCount | Error> => {
  try {
    const urlRelativa = `${Environment.URL_BASE}/auth/register/${filter}?page=${page}`;

    const { data } = await Api.get(urlRelativa);

    if (data) {
      return data;
    }

    return new Error('Erro ao listar os registros.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
  }
};

const getById = async (id: string): Promise<IDetalhePessoa | Error> => {
  try {
    const { data } = await Api.get(`/auth/register/${id}`); 

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};

const getByEmail = async (email: string): Promise<IDetalhePessoa | Error> => {
  try {
    const { data } = await Api.get(`/auth/register/email?email=${email}`); 

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};

const create = async (dados: Omit<IDetalhePessoa, '_id'>): Promise<string> => {
  try {
    const { data } = await Api.post<IDetalhePessoa>('/auth/register', dados);

    if (data) {
      return data._id;
    }

    throw new Error('Erro ao criar o registro.');
  } catch (error) {
    throw error;
  }
};

const updateById = async (id: string, dados: IDetalhePessoa): Promise<void | Error> => {
  try {
    await Api.put(`/auth/register/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
  }
};

const deleteById = async (id: string): Promise<void | Error> => {
  try {
    await Api.delete(`/auth/register/${id}`); 
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao apagar o registro.');
  }
};

export const PessoasService = {
  getAll,
  create,
  getById,
  updateById,
  deleteById,
  getByEmail,
};
