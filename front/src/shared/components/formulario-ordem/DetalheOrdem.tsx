import React, { useState, useEffect } from 'react';
import { OrdemService, IDetalheOrdem } from '../../services/api/Ordem/OrdemService';

function DetalhesOrdemPopup({ ordemId, onClose }: { ordemId: string, onClose: () => void }) {
    const [ordemData, setOrdemData] = useState<IDetalheOrdem | null>(null);
  
    useEffect(() => {
      const fetchOrdemData = async () => {
        try {
          const detalhes = await OrdemService.getById(ordemId);
          if (detalhes instanceof Error) {
            console.error(detalhes);
          } else {
            setOrdemData(detalhes);
          }
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchOrdemData();
    }, [ordemId]);
  
    return (
        <div>
        {ordemData ? (
          <div>
            <p>ID da Ordem: {ordemData._id}</p>
            <p>ID da Ordem: {ordemData.ordemId}</p>
            <p>Solicitante: {ordemData.solicitante}</p>
            <p>Sala: {ordemData.sala}</p>
            <p>Forno: {ordemData.forno}</p>
            <p>Cabeceira: {ordemData.cabeceira}</p>
            <p>Status: {ordemData.status}</p>
            <p>Urgência: {ordemData.urgencia}</p>
            <h4>Serviços</h4>
            <ul>
              {ordemData.services.map((service, index) => (
                <li key={index}>
                  <p>Nome: {service.name}</p>
                  <p>Descrição: {service.description}</p>
                  <p>Status: {service.status}</p>
                  <h5>Comentários</h5>
                  <ul>
                    {service.comments.map((comment, commentIndex) => (
                      <li key={commentIndex}>
                        <p>Usuário: {comment.usuario}</p>
                        <p>Descrição: {comment.description}</p>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            <button onClick={onClose}>Fechar</button>
          </div>
        ) : (
          <p>Carregando os detalhes da ordem...</p>
        )}
      </div>
    );
  }
  
  export default DetalhesOrdemPopup;
  