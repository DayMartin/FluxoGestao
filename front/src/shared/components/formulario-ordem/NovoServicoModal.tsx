import React, { useState, useRef } from 'react';
import { OrdemService, IOrdemServiceData } from '../../services/api/Ordem/OrdemService';

const NovoServicoPopup = ({ ordemData, onClose }: { ordemData: any; onClose: () => void }) => {
  const [novoServico, setNovoServico] = useState('');
  const [novoServicoDescricao, setNovoServicoDescricao] = useState('');
  const [novoServicoStatus, setNovoServicoStatus] = useState('Pendente');
  const servicoInputRef = useRef<HTMLInputElement | null>(null);
  const statusInputRef = useRef<HTMLInputElement | null>(null);

  const adicionarNovoServicoHandler = async () => {
    try {
      const idOrdem = ordemData?._id || '';

      const novoServiceData = {
        name: novoServico,
        description: novoServicoDescricao,
        status: novoServicoStatus,
      };

      const servicesAtuais = ordemData?.services || [];
      const servicesAtualizados = [...servicesAtuais, novoServiceData];

      const dadosAtualizados: Partial<IOrdemServiceData> = {
        services: servicesAtualizados,
      };

      const resposta = await OrdemService.updateById(idOrdem, dadosAtualizados as IOrdemServiceData);
      alert('Novo serviço cadastrado com sucesso');
      
      setNovoServico('');
      setNovoServicoDescricao('');
      setNovoServicoStatus('');
      ordemData((prevData: any) => {
        if (prevData) {
          return { ...prevData, services: servicesAtualizados };
        }
        return prevData;
        
      });
    } catch (error) {
      console.error('Erro ao adicionar o comentário:', error);
    }
  };

  return (
    <div className="modal-content">
      <span className="close" onClick={onClose}>&times;</span>
      <h2>Adicionar Novo Serviço</h2>
      <form>
        <label htmlFor="servico">Serviço:</label>
        <input
          className='input1'
          id="servico"
          type="text"
          value={novoServico}
          onChange={(e) => setNovoServico(e.target.value)}
          ref={servicoInputRef}
        />
        <label htmlFor="descricao">Descrição do Serviço:</label>
        <input
          className='input1'
          id="descricao"
          type="text"
          value={novoServicoDescricao}
          onChange={(e) => setNovoServicoDescricao(e.target.value)}
          ref={servicoInputRef}
        />
        <label htmlFor="status">Status do Serviço:</label>
        <input
          className='input1'
          id="status"
          type="text"
          value={novoServicoStatus}
          onChange={(e) => setNovoServicoStatus(e.target.value)}
          ref={statusInputRef}
          disabled
        />
        <button 
          type="button"
          className='botao-detalhes-os'
          onClick={adicionarNovoServicoHandler}
        >
          Adicionar Serviço
        </button>
      </form>
    </div>
  );
};

export default NovoServicoPopup;
