import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface IListagemEquipe {
  _id: string;
  equipeName: string;

}

export interface IDetalheEquipe {
  _id: string;
  equipeName: string;

}

type TEquipeComTotalCount = {
  data: IListagemEquipe[];
  totalCount: number;
};

const getAll = async (page = 1, filter = ''): Promise<TEquipeComTotalCount | Error> => {
  try {
    const urlRelativa = `${Environment.URL_BASE}/equipe`;

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

const getById = async (id: string): Promise<IDetalheEquipe | Error> => {
  try {
    const { data } = await Api.get(`/equipe/${id}`); // Adicionando a barra antes do ID

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};



const create = async (dados: Omit<IDetalheEquipe, '_id'>): Promise<string> => {
  try {
    const { data } = await Api.post<IDetalheEquipe>('/equipe', dados);

    if (data) {
      return data._id;
    }

    throw new Error('Erro ao criar o registro.');
  } catch (error) {
    throw error;
  }
};

const updateById = async (id: string, dados: IDetalheEquipe): Promise<void | Error> => {
  try {
    await Api.put(`/equipe${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
  }
};

const deleteById = async (id: string): Promise<void | Error> => {
  try {
    await Api.delete(`/equipe${id}`); 
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao apagar o registro.');
  }
};

export const EquipeService = {
  getAll,
  create,
  getById,
  updateById,
  deleteById,
};
