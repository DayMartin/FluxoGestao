import React, { useState, useEffect } from 'react';
import { OrdemService, IDetalheOrdem } from '../../services/api/Ordem/OrdemService';

function DetalhesOrdemPopup({ ordemId, onClose }: { ordemId: string, onClose: () => void }) {
  const [ordemData, setOrdemData] = useState<IDetalheOrdem | null>(null);
  const [showDadosGerais, setShowDadosGerais] = useState(true);
  const [showServicos, setShowServicos] = useState(false);
  const [botaoClicado, setBotaoClicado] = useState('');

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

  /* MUDAR A COR DO BOTÃO AO SER CLICADO */

  const handleButtonClick = (botao: string) => {
    if (botao === 'dadosGerais') {
      setShowDadosGerais(true);
      setShowServicos(false);
      setBotaoClicado('dadosGerais');
    } else if (botao === 'servicos') {
      setShowDadosGerais(false);
      setShowServicos(true);
      setBotaoClicado('servicos');
    }
  };

  return (
    <div className="div-externa-ordem-listagem">
      {ordemData ? (
        <div className="div-externa-ordem-listagem">
          <div className='alinhamento-buttons' >
          <button
          className={`botao-detalhes-os ${botaoClicado === 'dadosGerais' ? 'botao-clicado' : ''}`}
          onClick={() => handleButtonClick('dadosGerais')}
        >
          Dados OS
        </button>
        <button
          className={`botao-detalhes-os ${botaoClicado === 'servicos' ? 'botao-clicado' : ''}`}
          onClick={() => handleButtonClick('servicos')}
        >
          Serviços
        </button>
          </div>
          {showDadosGerais && (
            <div className="div-interna-detalhes-os">
              <div className="div-detalhes-os">
                <h4 className="titulos-detalhes-os"> DADOS GERAIS </h4>

                <div className="campos-detalhes-os">
                  <h5>ID da Ordem</h5>
                  <p> {ordemData._id}</p>
                </div>

                <div className = "campos-detalhes-os"> 
                <h5 >ID da Ordem</h5>
                <p> {ordemData.ordemId}</p>
                </div>

                <div className = "campos-detalhes-os"> 
                <h5 >Solicitante</h5>
                <p> {ordemData.solicitante}</p>
                </div>

                <div className = "campos-detalhes-os"> 
                <h5 >Urgência</h5>
                <p> {ordemData.urgencia}</p>
                </div>

                <div className = "campos-detalhes-os"> 
                <h5 >Data</h5>
                <p> {ordemData.createdAt}</p>
                </div>

              </div>
              <div className="div-detalhes-os">
                <p className="titulos-detalhes-os"> DADOS SALA</p>

                <div className = "campos-detalhes-os"> 
                <h5 >Sala</h5>
                <p> {ordemData.sala}</p>
                </div>

                <div className = "campos-detalhes-os"> 
                <h5 >Forno</h5>
                <p> {ordemData.forno}</p>
                </div>

                <div className = "campos-detalhes-os"> 
                <h5 >Cabeceira</h5>
                <p> {ordemData.cabeceira}</p>
                </div>

                <div className = "campos-detalhes-os"> 
                <h5 >Status</h5>
                <p> {ordemData.status}</p>
                </div>

              </div>
            </div>
          )}

          {showServicos && (
            <div className="div-interna-detalhes-os">
              <div className="div-detalhes-os">
                <h4>Serviços</h4>
                <ul>
                  {ordemData.services.map((service, index) => (
                    <li key={index}>
                      <p>Nome: {service.name}</p>
                      <p>Descrição: {service.description}</p>
                      <p>Status: {service.status}</p>
                      <button>Concluir</button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <div className=' alinhamento-buttons '>
          <button className=' botao-detalhes-os ' onClick={onClose}>Fechar</button>
          </div>
          
        </div>
      ) : (
        <p>Carregando os detalhes da ordem...</p>
      )}
    </div>
  );
}

export default DetalhesOrdemPopup;
