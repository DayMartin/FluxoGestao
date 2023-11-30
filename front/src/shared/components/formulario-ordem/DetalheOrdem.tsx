import React, { useState, useEffect } from 'react';
import { OrdemService, IDetalheOrdem, IOrdemServiceData } from '../../services/api/Ordem/OrdemService';
import PermissionComponent from '../AuthComponent/AuthComponent';

function DetalhesOrdemPopup({ ordemId, onClose }: { ordemId: string, onClose: () => void }) {
  const [ordemData, setOrdemData] = useState<IDetalheOrdem | null>(null);
  const [showDadosGerais, setShowDadosGerais] = useState(true);
  const [showServicos, setShowServicos] = useState(false);
  const [showComentarios, setShowComentarios] = useState(false);
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
      setShowComentarios(false);
      setBotaoClicado('dadosGerais');
    } else if (botao === 'servicos') {
      setShowDadosGerais(false);
      setShowServicos(true);
      setShowComentarios(false);
      setBotaoClicado('servicos');
    }  else if (botao === 'comentarios') {
      setShowDadosGerais(false);
      setShowServicos(false);
      setShowComentarios(true);
      setBotaoClicado('comentarios');
    }
    
  };

  const atualizarStatus = async (novoStatus: string, idOrdem: string) => {
    try {
      const dadosAtualizados: Partial<IOrdemServiceData> = {
        status: novoStatus
      };
  
      // Adicione os valores apenas se eles existirem em ordemData
      if (ordemData?.status) dadosAtualizados.status = ordemData.status;
  
      const resposta = await OrdemService.updateById(idOrdem, dadosAtualizados as IOrdemServiceData);
  
      // Verifique se os dados foram atualizados corretamente
      console.log('Resposta da atualização:', resposta);
  
      // Lógica adicional, como atualizar o estado local, mensagens, etc.
    } catch (error) {
      console.error('Erro ao atualizar o status:', error);
    }
  };

  const atualizarSetor = async (novoSetor: string, idOrdem: string) => {
    try {
      const dadosAtualizados: Partial<IOrdemServiceData> = {
        setor: novoSetor
      };
  
      // Adicione os valores apenas se eles existirem em ordemData
      if (ordemData?.setor) dadosAtualizados.setor = ordemData.setor;
  
      const resposta = await OrdemService.updateById(idOrdem, dadosAtualizados as IOrdemServiceData);
  
      // Verifique se os dados foram atualizados corretamente
      console.log('Resposta da atualização:', resposta);
  
      // Lógica adicional, como atualizar o estado local, mensagens, etc.
    } catch (error) {
      console.error('Erro ao atualizar o status:', error);
    }
  };


  const atualizarServico = async (servicoAtualizado: any, idServico: string) => {
    try {
      if (ordemData) {
        const servicosAtualizados = ordemData.services.map((servico) => {
          if (servico.name === idServico) {
            return { ...servico, ...servicoAtualizado };
          }
          return servico;
        });
  
        const ordemAtualizada = { ...ordemData, services: servicosAtualizados };
  
        // Atualize o estado local com a ordem atualizada
        setOrdemData(ordemAtualizada);
  
        // Faça a chamada para atualizar a ordem na API
        const resposta = await OrdemService.updateById(ordemAtualizada._id, ordemAtualizada);
        console.log('Serviços atualizados:', ordemAtualizada.services);
        // Verifique se a resposta foi bem-sucedida
        console.log('Resposta da atualização do serviço:', resposta);
      }
    } catch (error) {
      console.error('Erro ao atualizar o serviço:', error);
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
        <button
          className={`botao-detalhes-os ${botaoClicado === 'comentarios' ? 'botao-clicado' : ''}`}
          onClick={() => handleButtonClick('comentarios')}
        >
          Comentários
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
                <p> {ordemData.solicitante?.name}</p>
                </div>

                <div className = "campos-detalhes-os"> 
                <h5 >Urgência</h5>
                <p> {ordemData.urgencia}</p>
                </div>

                <div className = "campos-detalhes-os"> 
                <h5 >Data</h5>
                <p> {ordemData.createdAt}</p>
                </div>

                <div className="campos-detalhes-os">
                  <h5>Setor atual:</h5>
                  <p>{ordemData.setor}</p>
                </div>

              </div>

              <div className="div-detalhes-os2">
                <p className="titulos-detalhes-os"> DADOS SALA</p>

                <div className = "campos-detalhes-os"> 
                <h5 >Sala</h5>
                <p> {ordemData.sala?.salaNumber}</p>
                </div>

                <div className = "campos-detalhes-os"> 
                <h5 >Forno</h5>
                <p> {ordemData.forno}</p>
                </div>

                <div className = "campos-detalhes-os"> 
                <h5 >Cabeceira</h5>
                <p> {ordemData.cabeceira}</p>
                </div>

                <div className="campos-detalhes-os">
                  <h5>Status</h5>
                  <p> {ordemData.status}</p>
                </div>
              </div>  

              <div className="div-detalhes-os3">        
                <div className = "campos-detalhes-os3">
                  <p> Atribuir para: </p>
              
                  {showDadosGerais ? (
                        <div>
                          <div>
                            <select
                            className='selectsInfo'
                              value={ordemData?.setor || ''}
                              onChange={(e) => {
                                const novoSetor = e.target.value;
                                const idOrdem = ordemData?._id || '';

                                // Atualize o estado local após a mudança no select
                                const updatedOrdemData = {
                                  ...ordemData,
                                  setor: novoSetor,
                                };
                                setOrdemData(updatedOrdemData);

                                // Chame a função para atualizar o setor
                                // atualizarSetor(novoSetor, idOrdem);
                              }}
                            >
                              <option value="mecânica">Mecânica</option>
                              <option value="produção">Produção</option>
                            </select>
                            {/* <button
                            onClick={() => {
                              const novoSetor = 'novo setor'; // Defina o novo setor aqui se necessário
                              const idOrdem = ordemData?._id || ''; // Obtém o ID da ordem
                              atualizarSetor(novoSetor, idOrdem);
                            }}
                          >
                            Atualizar Setor
                          </button> */}
                          </div>

                        </div>
                      ) : (
                        <p>Detalhes do setor</p>
                      )}
                  </div>

                  <div className = "campos-detalhes-os3"> 
                  <p >Definir status da OS: </p>
                  <select
                      className="selectsInfo"
                      value={ordemData?.status || ''}
                      onChange={(e) => {
                        const novoStatus = e.target.value;
                        const idOrdem = ordemData?._id || '';

                        // Atualize o estado local após a mudança no select
                        const updatedOrdemData = {
                          ...ordemData,
                          status: novoStatus,
                        };
                        setOrdemData(updatedOrdemData);

                        // Chame a função de atualização de status
                        atualizarStatus(novoStatus, idOrdem);
                      }}
                    >
                    <option value="Aguardando atendimento">Aguardando atendimento</option>
                    <option value="Encerrado">Encerrado</option>
                    <option value="Em andamento">Em andamento</option>
                    <option value="Concluido">Concluído</option>
                    <option value="Dever de recusa">Dever de recusa</option>
                   
                  </select>
                  {/* <button
                    onClick={() => {
                      const novoStatus = 'novo status'; 
                      const idOrdem = ordemData?._id || ''; 

                      atualizarStatus(novoStatus, idOrdem);
                    }}
                  >
                    Atualizar Status
                  </button> */}
                
                </div>
              </div>
                  <div className='alinhamento-buttons'>
                  <button className='botao-detalhes-os' onClick={() => {
                    onClose(); // Chama a função onClose para fechar o pop-up
                    window.location.reload(); // Atualiza a página
                  }}>Fechar</button>

                  <button className='botao-detalhes-os' onClick={() => {
                    const novoStatus = 'novo status'; 
                    const idOrdem = ordemData?._id || ''; 
                    atualizarStatus(novoStatus, idOrdem);

                    const novoSetor = 'novo setor'; // Defina o novo setor aqui se necessário
                    atualizarSetor(novoSetor, idOrdem);


                    onClose(); // Chama a função onClose para fechar o pop-up
                  
                    window.location.reload(); // Atualiza a página
                  }}>Atualizar</button>
                </div>
              </div>
          )}

          {showServicos && (
            <div className="div-interna-detalhes-os">
              <div className="div-detalhes-os">
              <div className = "campos-detalhes-os4"> 
              <h4>Serviços</h4>
                <ul>
                  {ordemData.services.map((service, index) => (
                    <li key={index}>
                      <p>Nome: {service.name}</p>
                      <p>Descrição: {service.description}</p>
                      <p>Status: {service.status}</p>
                      <div>
                      <p>Atualize o status do serviço abaixo:</p>
                        <select
                         className="selectsInfo"
                          value={service.status}
                          onChange={(e) => {
                            const novoStatus = e.target.value;

                            const updatedService = {
                              ...service,
                              status: novoStatus,
                            };

                            const updatedServices = [...ordemData.services];
                            updatedServices[index] = updatedService;

                            const updatedOrdemData = {
                              ...ordemData,
                              services: updatedServices,
                            };

                            setOrdemData(updatedOrdemData);

                            atualizarServico(updatedService, service.name);
                          }}
                        >
                          <option value="Em andamento">Em andamento</option>
                          <option value="Concluído">Concluído</option>
                          <option value="Pendente">Pendente</option>
                          <option value="Dever de recusa">Dever de recusa</option>
                          {/* Adicione outras opções conforme necessário */}
                        </select>

                      </div>
                            </li>
                          ))}
                        </ul>
                        </div>
                      </div>
                    </div>
                  )}

          {showComentarios && (
            <div className="div-interna-detalhes-os">
              <div className="div-detalhes-os">
                <h4>Comentários</h4>
                <ul>
                  {ordemData.comments.map((comments, index) => (
                    <li key={index}>
                      <p>Usuário: {comments.usuario}</p>
                      <p>Descrição: {comments.description}</p>
                    </li>
                  ))}
                </ul>
                <br></br>
                <textarea></textarea>
                <button>Adicionar novo comentário</button>
              </div>
            </div>
          )}

        </div>
      ) : (
        <p>Carregando os detalhes da ordem...</p>
      )}
    </div>
  );
}

export default DetalhesOrdemPopup;
