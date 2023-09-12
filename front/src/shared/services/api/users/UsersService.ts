import { Environment } from '../../../environment';
import { Api } from '../axios-config';


export interface IListagemUsers {
    name: string;
    matricula: string;
    setor: string;
    supervisor: string;
    turno: string;
  }

export interface IDetalheUsers {
    id: number;
    email: string;
    cidadeId: number;
    nomeCompleto: string;
  }

type TUsersComTotalCount = {
    data: IListagemUsers[];
    totalCount: number;
  }

const getAll = async (page = 1, filter = ''): Promise<TUsersComTotalCount | Error > => {
    try {

        const urlRelativa = `/users?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&id=${filter}`;
        const { data, headers } = await Api.get(urlRelativa);
        
        if (data) {
            return {
              data,
              totalCount: Number(headers['x-total-count'] || Environment.LIMITE_DE_LINHAS),
            };
          }
      return new Error('Erro ao listar os usuários.'); 
    } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao listar os usuários.');
    }
};

const getById = async (): Promise<any> => {};

const create = async (): Promise<any> => {};

const updateById = async (): Promise<any> => {};

const deleteById = async (): Promise<any> => {};

export const UsersService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
};