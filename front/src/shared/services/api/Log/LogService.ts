import { Api } from '../axios-config';

export interface ILog {
  _id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  action: 'create' | 'update' | 'delete';
  entity: 'Ordem';
  entityId: number;
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

  async getAllLogs(): Promise<ILog[] | Error> {
    try {
      const { data } = await Api.get<IApiResponse>('/log');
      return data.logs;
    } catch (error) {
      console.error(error);
      return new Error('Erro ao buscar os logs.');
    }
  },

  async getLogById(logId: string): Promise<ILog | Error> {
    try {
      const { data } = await Api.get<ILog>(`/log/${logId}`);
      return data;
    } catch (error) {
      console.error(error);
      return new Error('Erro ao buscar o log por ID.');
    }
  },

  async getLogsByEntityId(entityId: string): Promise<ILog[] | Error> {
    try {
      const { data } = await Api.get<IApiResponse>(`/log/entity/${entityId}`);
      return data.logs;
    } catch (error) {
      console.error(error);
      return new Error('Erro ao buscar os logs por Entity ID.');
    }
  },
};
