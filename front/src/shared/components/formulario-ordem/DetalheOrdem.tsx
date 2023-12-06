import React, { useState, useEffect, useRef} from 'react';
import { OrdemService, IDetalheOrdem, IOrdemServiceData } from '../../services/api/Ordem/OrdemService';
import PermissionComponent from '../AuthComponent/AuthComponent';
import { formatarData } from '../FormateDate/FormateDate';
import { Dialog, Icon } from '@mui/material';
import config from '../../../config';
import NovoServicoPopup from './NovoServicoModal';

function DetalhesOrdemPopup({ ordemId, onClose }: { ordemId: string, onClose: () => void }) {
  const [showDialog, setShowDialog] = useState(false); // Estado para controlar a exibição do dialog
  const [ordemData, setOrdemData] = useState<IDetalheOrdem | null>(null);
  const [showDadosGerais, setShowDadosGerais] = useState(true);
  const [showServicos, setShowServicos] = useState(false);
  const [showComentarios, setShowComentarios] = useState(false);
  const [botaoClicado, setBotaoClicado] = useState('');
  const [novoComentario, setNovoComentario] = useState('');
  const [mostrarPopupNovoServico, setMostrarPopupNovoServico] = useState(false);
  const [novoEquipe, setNovoEquipe] = useState(process.env.REACT_APP_EQUIPE_GREEN || 'NULL'); 
  const [novoSetor, setNovoSetor] = useState(process.env.REACT_APP_SETOR_PRODUCAO || 'NULL');
  const producaoId = process.env.REACT_APP_SETOR_PRODUCAO;
  const msfId = process.env.REACT_APP_SETOR_MSF;
  const equipe_producaoId = process.env.REACT_APP_EQUIPE_PRODUCAO;
  const equipe_greenId = process.env.REACT_APP_EQUIPE_GREEN;
  const servicoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchOrdemData = async () => {
      try {
        const detalhes = await OrdemService.getById(ordemId);
        if (detalhes instanceof Error) {
          console.error(detalhes);
        } else {
          setOrdemData(detalhes);
  
          if (detalhes && detalhes.services.length === 0) {
            if (servicoInputRef.current) {
              servicoInputRef.current.focus();
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchOrdemData();
  }, [ordemId, showDialog]);
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
          if (servico.id_service === idServico) {
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
        createdAt: dataAtual, 
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
  const abrirDialogNovoServico = () => {
    setShowDialog(true); // Configurar o estado para exibir o Dialog
  };

  const fecharDialog = () => {
    setShowDialog(false);
  };

  const apagarServico = async (idServico: string) => {
    try {
      if (ordemData) {
        const ordemCompleta = await OrdemService.getById(ordemData._id);
  
        if (ordemCompleta instanceof Error) {
          console.error('Erro ao buscar a ordem completa:', ordemCompleta);
          return;
        }
  
        const quantidadeDeServicos = ordemCompleta.services.length;
  
        if (quantidadeDeServicos === 1) {
          alert('É necessário ter ao menos 1 serviço.');
          return;
        }
  
        const servicosRestantes = ordemData.services.filter(
          (servico) => servico.id_service !== idServico
        );
  
        if (servicosRestantes.length >= 1) {
          const dadosAtualizados = {
            services: servicosRestantes,
          };
  
          const resposta = await OrdemService.updateById(
            ordemData._id,
            dadosAtualizados as IDetalheOrdem
          );
  
          setOrdemData({ ...ordemData, services: servicosRestantes });
  
          console.log('Serviço apagado:', idServico);
          console.log('Resposta da atualização:', resposta);
        } else {
          alert('Esse serviço foi criado no início da ordem, você não pode excluir.');
          console.log('Pelo menos um serviço deve permanecer.');
        }
      }
    } catch (error) {
      console.error('Erro ao apagar o serviço:', error);
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
                <h4 className="titulos-detalhes-os"> DADOS DA ORDEM </h4>

                <div className = "campos-detalhes-os">
                <h5 >ID da Ordem</h5>
                <p> {ordemData.ordemId}</p>
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
                  <h5>Status da ordem</h5>
                  <p> {ordemData.status}</p>
                </div>

                <div className="campos-detalhes-os">
                  <h5>Atribuído para Setor:</h5>
                  {ordemData.setor === process.env.REACT_APP_SETOR_PRODUCAO ? (
                    <p>PRODUÇÃO</p>
                  ) : ordemData.setor === process.env.REACT_APP_SETOR_MSF ? (
                    <p>MSF</p>
                  ) : (
                    <p>{ordemData.setor}</p>
                  )}
                </div>

                <div className="campos-detalhes-os">
                  <h5>Atribuído para Equipe:</h5>
                  {ordemData.equipe === process.env.REACT_APP_EQUIPE_PRODUCAO ? (
                    <p>PRODUÇÃO</p>
                  ) : ordemData.equipe === process.env.REACT_APP_EQUIPE_GREEN ? (
                    <p>GREEN</p>
                  ) : (
                    <p>{ordemData.equipe}</p>
                  )}
                </div>


                <h4 className="titulos-detalhes-os"> DADOS DO SOLICITANTE </h4>

                <div className = "campos-detalhes-os">
                <h5 >Solicitante</h5>
                <p> {ordemData.solicitante_name}</p>
                </div>

                <div className = "campos-detalhes-os">
                <h5 >Setor do Solicitante</h5>
                <p> {ordemData.name_setor_solicitante}</p>
                </div>

                <div className = "campos-detalhes-os">
                <h5 >Equipe do Solicitante</h5>
                <p> {ordemData.name_equipe_solicitante}</p>
                </div>

              </div>

              <div className="div-detalhes-os">
                <p className="titulos-detalhes-os"> DADOS DO LOCAL PARA REALIZAR O SERVIÇO</p>

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
                            <option value={producaoId}>PRODUCAO</option>
                            <option value={msfId}>MSF</option>
                          </select>
                            <div className="arrowIcon">&#9660;</div>
                          </div>

                  </div>
                  <div className = "campos-detalhes-os">
                   <p> Atribuir para qual equipe: </p>
                          <div className="selectContainer">
                          <select
                          className="selectsInfo"
                          value={novoEquipe}
                          onChange={(e) => setNovoEquipe(e.target.value)} // Atualiza o estado de novoEquipe
                        >
                          <option value={equipe_greenId}>GREEN</option>
                          <option value={equipe_producaoId}>PRODUCAO</option>
                        </select>
                            <div className="arrowIcon">&#9660;</div>
                          </div>

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

                </div>
              </div>
                  <div className='alinhamento-buttons'>
                  <button className='botao-detalhes-os' onClick={() => {
                    onClose(); // Chama a função onClose para fechar o pop-up
                    window.location.reload(); // Atualiza a página
                  }}>Fechar</button>

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
              
              <h4>Serviços <button onClick={abrirDialogNovoServico}><Icon>add_circle</Icon></button></h4>
              <div className = "campos-detalhes-os4">
              <Dialog open={showDialog} onClose={fecharDialog} maxWidth="sm">
                {showDialog && (
                  <NovoServicoPopup ordemData={ordemData} onClose={() => { fecharDialog(); }} />
                )}
               </Dialog>

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

                            atualizarServico(updatedService, service.id_service);
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
                        <button onClick={() => apagarServico(service.id_service)}><Icon>delete</Icon></button>
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
