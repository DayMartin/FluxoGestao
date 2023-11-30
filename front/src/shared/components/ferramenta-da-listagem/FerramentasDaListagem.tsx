
import { Box, Button, Dialog, Icon, List, ListItem, ListItemText, Paper, TextField, useTheme } from "@mui/material"
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Environment } from "../../environment";
import { useState } from "react";


export interface IFilterOption {
    label: string;
    value: string;
  }

interface IFerramentasDaListagemProps {
    textoDabusca?: string;
    mostrarInputBusca?: boolean;
    aoMudarTextoDeBusca?: (novoTexto: string) => void;
    textoBotaoNovo?: string;
    textoBotaoConcluido?: string;
    textoBotaoAguardando?: string;
    textoBotaoAndamento?: string;
    mostrarBotaoNovo?: boolean;
    mostrarBotaoConcluido?: boolean;
    mostrarBotaoAguardando?: boolean;
    mostrarBotaoAndamento?: boolean;
    aoClicarEmNovo?: () => void;
    aoClicarEmConcl?: () => void;
    aoClicarEmAguardando?: () => void;
    aoClicarEmAndamento?: () => void;
    quantidadeAguardando?: number;
    quantidadeConcluido?: number;
    quantidadeAndamento?: number;
    filterOptions?: IFilterOption[];
    aoSelecionarFiltro?: (filtro: string) => void;
}
export const BarraDeFerramentas: React.FC<IFerramentasDaListagemProps> = ({
    textoDabusca = '',
    mostrarInputBusca = false,
    aoMudarTextoDeBusca,
    textoBotaoNovo = 'Novo',
    textoBotaoConcluido = 'Concluídas',
    textoBotaoAguardando = 'Aguardando',
    textoBotaoAndamento = 'Andamento',
    mostrarBotaoConcluido = false,
    mostrarBotaoAguardando = false,
    mostrarBotaoAndamento = false,
    mostrarBotaoNovo = true,
    aoClicarEmNovo ,
    aoClicarEmConcl,
    aoClicarEmAguardando,
    aoClicarEmAndamento,
    aoSelecionarFiltro,
    filterOptions,
    quantidadeAguardando = 0,
    quantidadeConcluido = 0,
    quantidadeAndamento = 0,
}) => {
    const [filtroAberto, setFiltroAberto] = useState(false);
    const theme = useTheme();

    return (
        <Box 
            height={theme.spacing(5)} 
            marginX={1} 
            padding={1} 
            paddingX={2} 
            display={"flex"} 
            gap={1} 
            alignItems={"center"} 
            component={Paper}
        >  
            {mostrarInputBusca && (
                <TextField 
                    size="small"
                    value={textoDabusca}
                    placeholder={Environment.INPUT_DE_BUSCA}
                    onChange={(e) => aoMudarTextoDeBusca?.(e.target.value)}
                />
            )}

            <Box flex={1} display={"flex"} justifyContent="end">
                {mostrarBotaoConcluido && (
                    <Button
                    variant='contained'
                    color="primary"
                    disableElevation
                    onClick={aoClicarEmConcl}
                    style={{ position: 'relative', paddingRight: '40px' }} 
                    >
                    {textoBotaoConcluido}
                    {/* Exibir a quantidade ao lado do botão */}
                    {quantidadeConcluido > 0 && (
                        <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>{`(${quantidadeConcluido})`}</span>
                    )}
                    </Button>
                )}
                </Box>

                <Box flex={1} display={"flex"} justifyContent="start">
                {mostrarBotaoAguardando && (
                    <Button
                    variant='contained'
                    color="primary"
                    disableElevation
                    onClick={aoClicarEmAguardando}
                    style={{ position: 'relative', paddingRight: '40px' }} 
                    >
                    {textoBotaoAguardando}
                    {/* Exibir a quantidade ao lado do botão */}
                    {quantidadeAguardando > 0 && (
                        <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>{`(${quantidadeAguardando})`}</span>
                    )}
                    </Button>
                )}
                </Box>

                <Box flex={1} display={"flex"} justifyContent="end">
                {mostrarBotaoAndamento && (
                    <Button
                    variant='contained'
                    color="primary"
                    disableElevation
                    onClick={aoClicarEmAndamento}
                    style={{ position: 'relative', paddingRight: '40px' }} 
                    >
                    {textoBotaoAndamento}
                    {/* Exibir a quantidade ao lado do botão */}
                    {quantidadeAndamento > 0 && (
                        <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>{`(${quantidadeAndamento})`}</span>
                    )}
                    </Button>
                )}
                </Box>


            <Box flex={1} display={"flex"} justifyContent="end" >
                {mostrarBotaoNovo && (
                <Button
                    variant='contained'
                    color="primary"
                    disableElevation
                    onClick={aoClicarEmNovo}
                    startIcon={<Icon>add</Icon>}
                >{textoBotaoNovo}</Button>
                )}
            </Box>

            {/* Adicionar um botão para abrir o filtro */}
            <Box flex={1} display={'flex'} justifyContent={'start'}>
                <Button
                variant="contained"
                color="primary"
                disableElevation
                onClick={() => setFiltroAberto(true)}
                startIcon={<Icon>filter_list</Icon>} 
                >
                Filtrar
                </Button>
            </Box>

            {/* Diálogo de filtro */}
            <Dialog open={filtroAberto} onClose={() => setFiltroAberto(false)}>
                <List>
                    {filterOptions?.map((option, index) => (
                    <ListItem
                        key={index}
                        button
                        onClick={() => aoSelecionarFiltro?.(option.value)}
                        sx={{ border: '1px solid #ccc', padding: '10px', width: '200px', margin: '10px' }} // Adicionando uma borda inferior
                    >
                        <ListItemText primary={option.label} />
                    </ListItem>
                    ))}
                </List>
            </Dialog>
        </Box>

    );
};  