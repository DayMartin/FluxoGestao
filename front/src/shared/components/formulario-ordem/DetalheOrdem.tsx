import React, { useState, useEffect } from 'react';
import { OrdemService, IDetalheOrdem, IOrdemServiceData } from '../../services/api/Ordem/OrdemService';
import PermissionComponent from '../AuthComponent/AuthComponent';
import { formatarData } from '../FormateDate/FormateDate';
import { Icon } from '@mui/material';
import config from '../../../config';

function DetalhesOrdemPopup({ ordemId, onClose }: { ordemId: string, onClose: () => void }) {
  const [ordemData, setOrdemData] = useState<IDetalheOrdem | null>(null);
  const [showDadosGerais, setShowDadosGerais] = useState(true);
  const [showServicos, setShowServicos] = useState(false);
  const [showComentarios, setShowComentarios] = useState(false);
  const [botaoClicado, setBotaoClicado] = useState('');
  const [novoComentario, setNovoComentario] = useState('');
  const [novoServico, setNovoServico] = useState('');
  const [novoServicoDescricao, setNovoServicoDescricao] = useState('');
  const [novoServicoStatus, setNovoServicoStatus] = useState('Pendente');
  const [mostrarPopupNovoServico, setMostrarPopupNovoServico] = useState(false);
  const [novoEquipe, setNovoEquipe] = useState('655bece8f2da4148eba30981'); 
  const [novoSetor, setNovoSetor] = useState('655be3fd08346d6f62ae7a56');
  const producaoId = process.env.REACT_APP_PRODUCAO_ID;
  const msfId = process.env.REACT_APP_MSF_ID;
  const equipe_producaoId = process.env.REACT_APP_EQUIPE_PRODUCAO;
  const equipe_greenId = process.env.REACT_APP_EQUIPE_GREEN;

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
  const atualizarEquipe = async (novoEquipe: string, idOrdem: string) => {
    try {
      const dadosAtualizados: Partial<IOrdemServiceData> = {
        equipe: novoEquipe
      };

      const resposta = await OrdemService.updateById(idOrdem, dadosAtualizados as IOrdemServiceData);

      console.log('Resposta da atualização:', resposta);
    } catch (error) {
      console.error('Erro ao atualizar a equipe:', error);
    }
  };

  const atualizarSetor = async (novoSetor: string, idOrdem: string) => {
      try {
        const dadosAtualizados: Partial<IOrdemServiceData> = {
          setor: novoSetor
        };
  
        const resposta = await OrdemService.updateById(idOrdem, dadosAtualizados as IOrdemServiceData);
  
        console.log('Resposta da atualização:', resposta);
      } catch (error) {
        console.error('Erro ao atualizar a equipe:', error);
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

  const adicionarNovoComentario = async () => {
    try {
      const idOrdem = ordemData?._id || '';
      const nomeUsuario = localStorage.getItem('APP_ACCESS_USER') || 'Nome de Usuário Padrão';

      // Obter a data atual e formatar para o formato desejado (exemplo: "2023-11-21T12:00:00")
      const dataAtual = new Date().toISOString();

      const novoComentarioData = {
        usuario: nomeUsuario,
        description: novoComentario,
        createdAt: dataAtual, // Inserir a data atual no comentário
      };

      const comentariosAtuais = ordemData?.comments || [];
      const comentariosAtualizados = [...comentariosAtuais, novoComentarioData];

      const dadosAtualizados: Partial<IOrdemServiceData> = {
        comments: comentariosAtualizados,
      };

      const resposta = await OrdemService.updateById(idOrdem, dadosAtualizados as IOrdemServiceData);

      setNovoComentario('');
      setOrdemData(prevData => {
        if (prevData) {
          return { ...prevData, comments: comentariosAtualizados };
        }
        return prevData;
      });
    } catch (error) {
      console.error('Erro ao adicionar o comentário:', error);
    }
  };

  interface NovoServicoPopupProps {
    adicionarNovoServico: any; // Substitua 'any' pelo tipo correto, se possível
    onClose: any; // Substitua 'any' pelo tipo correto, se possível
  }

  function NovoServicoPopup({ adicionarNovoServico, onClose }: NovoServicoPopupProps) {
    const [mostrarModal, setMostrarModal] = useState(false);
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

        setNovoServico('');
        setNovoServicoDescricao('');
        setNovoServicoStatus('');
        setOrdemData(prevData => {
          if (prevData) {
            return { ...prevData, services: servicesAtualizados };
          }
          return prevData;
        });
      } catch (error) {
        console.error('Erro ao adicionar o comentário:', error);
      }
    };

      // Se mostrarModal for verdadeiro, renderizamos o modal
  if (mostrarModal) {
    // Aqui, atualizei o retorno do componente para exibir o popup sobre todo o conteúdo
    return mostrarModal ? (
      <div className="modal" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999 }}>
        {/* Conteúdo do modal */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '20px', borderRadius: '5px' }}>
          <h2>Adicionar Novo Serviço</h2>
          {/* ... (restante do código do popup) */}
        </div>
      </div>
    ) : null;
  }

    return (
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Adicionar Novo Serviço</h2>
        <label>Serviço:</label>
        <input type="text" value={novoServico} onChange={(e) => setNovoServico(e.target.value)} />
        <label>Descrição do Serviço:</label>
        <input
          type="text"
          value={novoServicoDescricao}
          onChange={(e) => setNovoServicoDescricao(e.target.value)}
        />
        <label>Status do Serviço:</label>
        <input
          type="text"
          value={novoServicoStatus}
          onChange={(e) => setNovoServicoStatus(e.target.value)}
        />
        <button onClick={adicionarNovoServicoHandler}>Adicionar Serviço</button>
      </div>
    );
  }

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
                <h5 >Data da criação</h5>
                <p>{formatarData(ordemData.createdAt)}</p>
                </div>

                <div className="campos-detalhes-os">
                  <h5>Setor atual:</h5>
                  {ordemData.setor === process.env.REACT_APP_SETOR_PRODUCAO ? (
                    <p>PRODUÇÃO</p>
                  ) : ordemData.setor === process.env.REACT_APP_SETOR_MSF ? (
                    <p>MSF</p>
                  ) : (
                    <p>{ordemData.setor}</p>
                  )}
                </div>


              </div>

              <div className="div-detalhes-os">
                <p className="titulos-detalhes-os"> DADOS SALA</p>

                <div className = "campos-detalhes-os">
                <h5 >Sala</h5>
                <p> {ordemData.sala }</p>
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
                <div className = "campos-detalhes-os">
                   <p> Atribuir para qual setor: </p>
                          <div className="selectContainer">
                          <select
                            className="selectsInfo"
                            value={novoSetor}
                            onChange={(e) => setNovoSetor(e.target.value)} // Atualiza o estado de novoSetor
                          >
                            <option value="655be3fd08346d6f62ae7a56">PRODUCAO</option>
                            <option value="655be5c6585d76b1ab1ca7e5">MSF</option>
                          </select>
                            <div className="arrowIcon">&#9660;</div>
                          </div>

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
                  <div className = "campos-detalhes-os">
                   <p> Atribuir para qual equipe: </p>
                          <div className="selectContainer">
                          <select
                          className="selectsInfo"
                          value={novoEquipe}
                          onChange={(e) => setNovoEquipe(e.target.value)} // Atualiza o estado de novoEquipe
                        >
                          <option value="655bece8f2da4148eba30981">GREEN</option>
                          <option value="6569783744abf5a3198e2de0">PRODUCAO</option>
                        </select>
                            <div className="arrowIcon">&#9660;</div>
                          </div>

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

                  <div className = "campos-detalhes-os">
                  <p >Definir status da OS: </p>
                  <div className="selectContainer">
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
                        // atualizarStatus(novoStatus, idOrdem);
                      }}
                    >
                    <option value="Aguardando atendimento">Aguardando atendimento</option>
                    <option value="Encerrado">Encerrado</option>
                    <option value="Em andamento">Em andamento</option>
                    <option value="Concluido">Concluído</option>
                    <option value="Dever de recusa">Dever de recusa</option>

                  </select>
                  <div className="arrowIcon">&#9660;</div>
                  </div>
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

                  // Dentro do seu código
                  <button
                    className='botao-detalhes-os'
                    onClick={(e) => {
                      const novoStatus = 'novo status';
                      const idOrdem = ordemData?._id || '';

                      atualizarStatus(novoStatus, idOrdem);

                      atualizarSetor(novoSetor, idOrdem);
                      atualizarEquipe(novoEquipe, idOrdem);
            
                      onClose(); // Chama a função onClose para fechar o pop-up
                  
                      window.location.reload(); // Atualiza a página
                    }}
                  >
                    Atualizar
                  </button>

                </div>
              </div>
          )}

          {showServicos && (
            <div className="div-interna-detalhes-os">
              <div className="div-detalhes-os">

                      {mostrarPopupNovoServico && (
                        <NovoServicoPopup
                          onClose={() => setMostrarPopupNovoServico(false)}
                          adicionarNovoServico={NovoServicoPopup}
                        />
                      )}
              <h4>Serviços <button onClick={() => setMostrarPopupNovoServico(true)}><Icon>add_circle</Icon></button></h4>
              <div className = "campos-detalhes-os4">

                <ul>
                  {ordemData.services.map((service, index) => (
                    <div key={index} className="comments-container">
                      <p>Nome: {service.name}</p>
                      <p>Descrição: {service.description}</p>
                      <p>Status: {service.status}</p>
                      <div className = "campos-detalhes-os">
                      <p>Atualize o status do serviço</p>
                      <div className="selectContainer">
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
                        <div className="arrowIcon">&#9660;</div>
                        </div>
                      </div>
                      </div>
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
                <div className = "campos-detalhes-os4">
                <div className="comments-container">
                  {ordemData.comments.map((comment, index) => (
                    <div key={index} className="comment-box">
                      <p>Usuário: {comment.usuario}</p>
                      <p>Data: {formatarData(comment.createdAt)}</p>
                      <p>Descrição: {comment.description}</p>
                    </div>
                  ))}
                </div>
                </div>
                <textarea
                  value={novoComentario}
                  onChange={(e) => setNovoComentario(e.target.value)}
                  className="comment-input"
                  placeholder="Adicionar novo comentário..."
                ></textarea>

              <button className='botao-detalhes-os' onClick={adicionarNovoComentario}>Adicionar novo comentário</button>
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
