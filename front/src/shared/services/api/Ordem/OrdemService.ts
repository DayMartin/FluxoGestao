import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface IOrdemServiceData {
  _id: string | number;
  ordemId: number;
  solicitante: string;
  setor: string;
  sala: number;
  forno: number;
  cabeceira: string;
  status: string;
  services: {
    name: string;
    description: string;
    status: string;
    comments: {
      usuario: string;
      description: string;
    }[];
  }[];
  comments: {
    usuario: string;
    description: string;
  }[];
  urgencia: string;
}

export interface IDetalheOrdem {
  ordemId: number;
  _id: string | number;
  solicitante: string;
  setor: string;
  sala: number;
  forno: number;
  cabeceira: string;
  status: string;
  services: {
    name: string;
    description: string;
    status: string;
    comments: {
      usuario: string;
      description: string;
    }[];
  }[];
  comments: {
    usuario: string;
    description: string;
  }[];
  urgencia: string;
}

export type TOrdemComTotalCount = {
  data: IDetalheOrdem[];
  totalCount: number;
};

const getAll = async (page = 1, filter = ''): Promise<TOrdemComTotalCount | Error> => {
  try {
    const urlRelativa = `${Environment.URL_BASE}/ordem/${filter}?page=${page}`;

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

const getById = async (id: string | number): Promise<IDetalheOrdem | Error> => {
  try {
    const { data } = await Api.get(`/ordem/${id}`);

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};

const create = async (dados: IOrdemServiceData): Promise<string | number> => {
  try {
    const { data } = await Api.post<IDetalheOrdem>('/ordem', dados);

    if (data) {
      return data._id;
    }

    throw new Error('Erro ao criar o registro.');
  } catch (error) {
    console.error(error);
    throw new Error((error as { message: string }).message || 'Erro ao criar o registro.');
  }
};

const updateById = async (id: string | number, dados: IOrdemServiceData): Promise<void | Error> => {
  try {
    await Api.put(`/ordem/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
  }
};

const deleteById = async (id: string | number): Promise<void | Error> => {
  try {
    await Api.delete(`/ordem/${id}`);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao apagar o registro.');
  }
};

export const OrdemService = {
  getAll,
  create,
  getById,
  updateById,
  deleteById,
};
