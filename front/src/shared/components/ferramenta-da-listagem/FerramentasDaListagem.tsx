
import { Box, Button, Icon, Paper, TextField, useTheme } from "@mui/material"

interface IFerramentasDaListagemProps {
    textoDabusca?: string;
    mostrarInputBusca?: boolean;
    aoMudarTextoDeBusca?: (novoTexto: string) => void;
    textoBotaoNovo?: string;
    mostrarBotaoNovo?: boolean;
    aoClicarEmNovo?: () => void;
}
export const BarraDeFerramentas: React.FC<IFerramentasDaListagemProps> = ({
    textoDabusca = '',
    mostrarInputBusca = false,
    aoMudarTextoDeBusca,
    textoBotaoNovo = 'Novo',
    mostrarBotaoNovo = 'true',
    aoClicarEmNovo ,
    
}) => {

    const theme = useTheme();

    return (
        <Box height={theme.spacing(5)} 
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
                    placeholder="Pesquisar..."
                    onChange={(e) => aoMudarTextoDeBusca?.(e.target.value)}
                />
            )}



            <Box flex={1} display={"flex"} justifyContent="end" >
                {mostrarBotaoNovo && (
                <Button
                    variant='contained'
                    color="primary"
                    disableElevation
                    onClick={aoClicarEmNovo}
                    endIcon={<Icon>add</Icon>}
                >{textoBotaoNovo}</Button>
                )}
            </Box>
        </Box>

    );
};  