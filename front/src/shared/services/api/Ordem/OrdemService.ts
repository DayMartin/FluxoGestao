import { Environment } from '../../../environment';
import { Api } from '../axios-config';



export interface IOrdemServiceData {
  _id: string;
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
  }[];
  comments: {
    usuario: string;
    description: string;
  }[];
  urgencia: string;
}



export interface IDetalheOrdem {
  ordemId: number;
  _id: string;
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
    _id:string;
  }[];
  comments: {
    usuario: string;
    description: string;
  }[];
  urgencia: string;
  createdAt: string;
  
}

export type TOrdemComTotalCount = {
  data: IDetalheOrdem[];
  totalCount: number;
};


export interface IApiResponse {
  ordem: IOrdemServiceData[]; 
  pagination: {
    totalOrdem: number;
    pageCount: number;
    next?: { page: number };
    prev?: { page: number };
  };
  setor?: string;
  status?: string | string[];
}


const getAll = async (options: { page?: number; limit?: number; filter?: string; ordemId?: string; setor?: string; status?: string }): Promise<IApiResponse | Error> => {
  try {
const urlRelativa = `${Environment.URL_BASE}/ordem?page=${options.page || 1}&limit=${options.limit || Environment.LIMITE_DE_LINHAS}&filter=${options.filter || ''}&ordemId=${options.ordemId || ''}&\
setor=${options.setor || ''}&status=${options.status || ''}`;
    const { data } = await Api.get<IApiResponse>(urlRelativa);

    if (data) {
      return data;
    }

    return new Error('Erro ao listar os registros.');
  } catch (error) {
    return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
  }
};


const getById = async (identifier: string): Promise<IDetalheOrdem | Error> => {
  try {
    const url = isMongoId(identifier)
      ? `/ordem/${identifier}` // Se for um ID do MongoDB, busque por _id
      : `/ordem?busca=${identifier}`; // Caso contrário, busque por ordemId

    const { data } = await Api.get(url);

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};

// Função para verificar se uma string é um ID do MongoDB
const isMongoId = (str: string) => /^[0-9a-fA-F]{24}$/.test(str);


const create = async (dados: IOrdemServiceData): Promise<string> => {
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

const updateById = async (_id: string, dados: IOrdemServiceData): Promise<void | Error> => {
  try {
    await Api.put(`/ordem/${_id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
  }
};

const deleteById = async (id: string): Promise<void | Error> => {
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
