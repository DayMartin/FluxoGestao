import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface IListagemSetor {
  _id: string;
  name: string;
  // equipe: {
  //   _id: string;
  //   equipeName: string;
  // }[];
}

export interface IDetalheSetor {
  _id: string;
  name: string;
  // equipe: {
  //   _id: string;
  //   equipeName: string;
  // }[];
}

type TSetorComTotalCount = {
  data: IListagemSetor[];
  totalCount: number;
};

const getAll = async (page = 1, filter = ''): Promise<TSetorComTotalCount | Error> => {
  try {
    const urlRelativa = `${Environment.URL_BASE}/setor`;

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

const getById = async (id: string): Promise<IDetalheSetor | Error> => {
  try {
    const { data } = await Api.get(`/setor/${id}`); // Adicionando a barra antes do ID

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};



const create = async (dados: Omit<IDetalheSetor, '_id'>): Promise<string> => {
  try {
    const { data } = await Api.post<IDetalheSetor>('/setor', dados);

    if (data) {
      return data._id;
    }

    throw new Error('Erro ao criar o registro.');
  } catch (error) {
    throw error;
  }
};

const updateById = async (id: string, dados: IDetalheSetor): Promise<void | Error> => {
  try {
    await Api.put(`/setor${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
  }
};

const deleteById = async (id: string): Promise<void | Error> => {
  try {
    await Api.delete(`/setor${id}`); 
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao apagar o registro.');
  }
};

export const SetorService = {
  getAll,
  create,
  getById,
  updateById,
  deleteById,
};
