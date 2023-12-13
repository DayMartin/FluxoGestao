# conecta
Aplicação para criação de ordem de serviços e gerencimamento


INSTALAÇÕES GLOBAIS

npm install uuid --save

nvm install v18.17.1

npm install -g npm@latestcl

install axios

npm install axios


# INSTALAÇOES FRONT

Para iniciar o projeto é necessário instalar o nvm e o react

npm install -g react-scripts

npm install --save-dev typescript

npm start

OBS: Por enquanto o eslint está desativado

### BACK

npm start

npm install bcrypt

npm install jsonwebtoken

npm install dotenv

# OU EM BACK E FRONT 

npm install 


# PARA CRIAR UM NOVO SETOR 

NO BACK 

Criar Setor na colletion Setor

.env / Incluir variável de ambiente para Setor com o ID criado no banco de dados  / EXEMPLO: REACT_APP_SETOR_PRODUCAO='655be3fd08346d6f62ae7a56'

# controllers/ordemController.js 
    # Criar variável para acomodar a variavel criada no .env / exemplo : const equipe_greenId = process.env.REACT_APP_EQUIPE_GREEN;
    # Na linha 91 você terá  // Aplicar filtro para o setor "MSF" ou "PRODUCAO", inclua abaixo disso a variavel com o novo setor nesta linha:
            if (setor === msfId || setor === producaoId) {
          query.where({ setor });
        }
    # Na linha 111 a mesma coisa:
            if (setor === msfId || setor === producaoId) {
          totalCountQuery.where({ setor });
        }    

FRONT

crie uma variavel de ambiente para o novo setor / EXEMPLO: REACT_APP_SETOR_PRODUCAO='655be3fd08346d6f62ae7a56'

deve haver inclusão em: 
# OrdemEncerradas: 
    # Criar variável para acomodar a variavel criada no .env / exemplo : const equipe_greenId = process.env.REACT_APP_EQUIPE_GREEN;
    # Deve haver inclusão da variavel na linha 242: 
                            <TableCell>
                      {row.setor === process.env.REACT_APP_SETOR_PRODUCAO ? (
                        <p>PRODUÇÃO</p>
                      ) : row.setor === process.env.REACT_APP_SETOR_MSF ? (
                        <p>MSF</p>
                      ) : (
                        <p>{row.setor}</p>
                      )}
                    </TableCell>

    # NO INICIO DO CODIGO INCLUIR MAIS OPÇÃO 

    const filterOptions: IFilterOption[] = [
    { label: 'MSF', value: 'opcao1' },
    { label: 'Produção', value: 'opcao2' },
    { label: 'Todos', value: 'reset' },
  ];

  # LINHA 152

          const handleFiltrarEncerradoProd = async () => {
    await handleFiltrar(producaoId, 'Encerrado');
  };

  # LINHA 166

      const filtroFunctions: Record<string, () => void> = {
      opcao1: () => {
        handleFiltrarEncerradoMec();
      },
      opcao2: () => {
        handleFiltrarEncerradoProd();
      },
      reset: () => {
        handleReset();
      },
    };

# OrdemProd
    # Criar variável para acomodar a variavel criada no .env / exemplo : const equipe_greenId = process.env.REACT_APP_EQUIPE_GREEN;
   #                    <TableCell>
                      {row.setor === process.env.REACT_APP_SETOR_PRODUCAO ? (
                        <p>PRODUÇÃO</p>
                      ) : row.setor === process.env.REACT_APP_SETOR_MSF ? (
                        <p>MSF</p>
                      ) : (
                        <p>{row.setor}</p>
                      )}
                    </TableCell>

#### DetalheOrdem
    # Criar variável para acomodar a variavel criada no .env / exemplo : const equipe_greenId = process.env.REACT_APP_EQUIPE_GREEN;
    # Aproximadamente deve haver inclusão na linha 278
        # 
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


#### OrdemForms
    # Criar variável para acomodar a variavel criada no .env / exemplo : const equipe_greenId = process.env.REACT_APP_EQUIPE_GREEN;

    # Linha 540

            <p> Atribuir para qual setor: </p>
         <div className="selectContainer">
          <select
            className="selectsInfo"
            value={ordemData?.setor || ''}
            onChange={(e) => handleChange(e, "setor")}
            >
            <option value={msfId}>MSF</option>
            <option value={producaoId}>PRODUCAO</option>

          </select>

        <div className="arrowIcon">&#9660;</div>
        </div>
        </div>



# PARA CRIAR UMA NOVA EQUIPE DEVE-SE SEGUIR OS MESMOS PASSOS DO CRIAR SETOR MAS EM LINHAS DIFERENTES, NORMALMENTE LOGO ABAIXO
