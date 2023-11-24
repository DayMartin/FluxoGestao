
import { Box, Button, Icon, Paper, TextField, useTheme } from "@mui/material"
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Environment } from "../../environment";

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
    quantidadeAguardando = 0,
    quantidadeConcluido = 0,
    quantidadeAndamento = 0,
    
    
    
}) => {

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
        </Box>

    );
};  