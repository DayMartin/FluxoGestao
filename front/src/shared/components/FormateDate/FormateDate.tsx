  // Função para converter data ISO para o formato brasileiro (dd/mm/aaaa hh:mm:ss)
  export const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const hora = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    const segundos = String(data.getSeconds()).padStart(2, '0');
  
    return `${dia}/${mes}/${ano} ${hora}:${minutos}:${segundos}`;
  };