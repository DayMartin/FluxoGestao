import { Environment } from '../../../environment';
import { IDetalheSala, IListagemSala, SalaService } from '../Sala/SalaService';
import { IDetalheSetor } from '../Setor/SetorService';
import { Api } from '../axios-config';
import { IDetalhePessoa, PessoasService } from '../users/PessoasService';

export interface IOrdemServiceData {
  _id: string;
  ordemId: number;
  solicitante?: string;
  // solicitante?: IDetalhePessoa;
  solicitante_name: string; 
  setor_solicitante: string;
  name_setor_solicitante: string;
  equipe_solicitante: string;
  name_equipe_solicitante: string;
  equipe: string;
  setor: string;
  sala: number;
  // sala: {
  //   _id: string;
  //   salaNumber: number;
  //   };
  forno: number;
  cabeceira: string;
  status: string;
  services: {
    name: string;
    description: string;
    status: string;
    solicitante_servico: string;

  }[];
  comments: {
    usuario: string;
    description: string;
    createdAt: string;
  }[];
  urgencia: string;
  createdAt: string;
  [key: string]: any;
}

export interface IDetalheOrdem {
  _id: string;
  ordemId: number;
  // solicitante?: IDetalhePessoa;
  solicitante?: string;
  solicitante_name: string; 
  setor_solicitante: string;
  name_setor_solicitante: string;
  equipe_solicitante: string;
  name_equipe_solicitante: string;
  equipe: string;
  setor: string;
  sala: number;
  // sala: {
  //   _id: string;
  //   salaNumber: number;
  // };
  forno: number;
  cabeceira: string;
  status: string;
  services: {
    name: string;
    description: string;
    status: string;
    solicitante_servico: string;
  }[];
  comments: {
    usuario: string;
    description: string;
    createdAt: string;
  }[];
  urgencia: string;
  createdAt: string;
  [key: string]: any;

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
  sala?: string | string[];
  equipe?: string;
  solicitante?: string;
}


const getAll = async (options: { page?: number; limit?: number; filter?: string; ordemId?: string; setor?: string; status?: string; equipe?: string; }): Promise<IApiResponse | Error> => {
  try {
    const urlRelativa = `${Environment.URL_BASE}/ordem?page=${options.page || 1}&limit=${options.limit || Environment.LIMITE_DE_LINHAS}&filter=${options.filter || ''}&ordemId=${options.ordemId || ''}&setor=${options.setor || ''}&status=${options.status || ''}&equipe=${options.equipe || ''}`;
    const { data } = await Api.get<IApiResponse>(urlRelativa);

    if (data && data.ordem) {
      const promises = data.ordem.map(async (ordem) => {
        try {
          // if (ordem.solicitante?._id) {
          //   const detalhesSolicitante = await PessoasService.getById(ordem.solicitante._id);
          //   if (!(detalhesSolicitante instanceof Error)) {
          //     ordem.solicitante = detalhesSolicitante;
          //   } else {
          //     console.error(`Erro ao obter detalhes do solicitante para a ordem ${ordem.ordemId}:`, detalhesSolicitante);
          //     ordem.solicitante = {
          //       _id: 'Solicitante não encontrado',
          //       name: 'Nome não encontrado',
          //       matricula: 'Matrícula não encontrada',
          //       setor: 'Setor não encontrado',
          //       turno: 'Turno não encontrado',
          //       equipe: 'Equipe não encontrada',
          //       email: 'Email não encontrado',
          //       senha: 'Senha não encontrada',
          //       roles: ['Roles não encontrada'],
          //     };
          //   }
          // }

          // if (ordem.sala?._id) {
          //   const detalhesSala = await SalaService.getById(ordem.sala._id);
          //   if (!(detalhesSala instanceof Error)) {
          //     ordem.sala = detalhesSala;
          //   } else {
          //     console.error(`Erro ao obter detalhes da sala para a ordem ${ordem.ordemId}:`, detalhesSala);
          //     ordem.sala = {
          //       _id: 'Sala não encontrada',
          //       salaNumber: 0,
          //       // setor: {
          //       //   _id: '',
          //       //   name: '',
          //       //   equipe: [{
          //       //     _id: '',
          //       //     equipeName: '',

          //       //   }],
          //       // },
          //     };
          //   }
          // }
        } catch (error) {
          console.error(`Erro ao processar ordem ${ordem.ordemId}:`, error);
        }
      });

      await Promise.all(promises);
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