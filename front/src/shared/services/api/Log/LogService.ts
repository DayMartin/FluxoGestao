import { Api } from '../axios-config';

export interface ILog {
  _id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  action: 'create' | 'update' | 'delete';
  entity: 'Ordem';
  entityId: string;
  details: string;
}

export interface IApiResponse {
  logs: ILog[];
  totalCount: number;
}

export const LogService = {
  async createLog(logData: Omit<ILog, '_id' | 'timestamp'>): Promise<ILog | Error> {
    try {
      const { data } = await Api.post<ILog>('/log', logData);
      return data;
    } catch (error) {
      console.error(error);
      return new Error('Erro ao criar o log.');
    }
  },

  async getAll(): Promise<ILog[] | Error> {
    try {
      const { data } = await Api.get<IApiResponse>('/log');
      return data.logs;
    } catch (error) {
      console.error(error);
      return new Error('Erro ao buscar os logs.');
    }
  },

  async getById(logId: string): Promise<ILog | Error> {
    try {
      const { data } = await Api.get<ILog>(`/log/${logId}`);
      return data;
    } catch (error) {
      console.error(error);
      return new Error('Erro ao buscar o log por ID.');
    }
  },

  async getByEntityId(entityId: string): Promise<ILog[] | Error> {
    try {
      const { data } = await Api.get<IApiResponse>(`/log/entity/${entityId}`);
      if (data && Array.isArray(data)) {
        return data;
      } else {
        console.error('Resposta inválida ao buscar os logs por Entity ID:', data);
        return new Error('Resposta inválida ao buscar os logs por Entity ID.');
      }
    } catch (error) {
      console.error(error);
      return new Error('Erro ao buscar os logs por Entity ID.');
    }
  }
  
};
