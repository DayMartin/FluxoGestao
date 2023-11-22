import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface IListagemSala {
  _id: string;
  salaNumber: number;
  setor: string[];
}

export interface IDetalheSala {
  _id: string;
  salaNumber: number;
  setor: string[];
}

type TSalaComTotalCount = {
  data: IListagemSala[];
  totalCount: number;
};

const getAll = async (page = 1, filter = ''): Promise<TSalaComTotalCount | Error> => {
  try {
    const urlRelativa = `${Environment.URL_BASE}/sala`;

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

const getById = async (id: string): Promise<IDetalheSala | Error> => {
  try {
    const { data } = await Api.get(`/sala/${id}`); // Adicionando a barra antes do ID

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};



const create = async (dados: Omit<IDetalheSala, '_id'>): Promise<string> => {
  try {
    const { data } = await Api.post<IDetalheSala>('/sala', dados);

    if (data) {
      return data._id;
    }

    throw new Error('Erro ao criar o registro.');
  } catch (error) {
    throw error;
  }
};

const updateById = async (id: string, dados: IDetalheSala): Promise<void | Error> => {
  try {
    await Api.put(`/sala${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
  }
};

const deleteById = async (id: string): Promise<void | Error> => {
  try {
    await Api.delete(`/sala${id}`); 
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao apagar o registro.');
  }
};

export const SalaService = {
  getAll,
  create,
  getById,
  updateById,
  deleteById,
};
