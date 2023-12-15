  // Função para converter data ISO para o formato brasileiro (dd/mm/aaaa hh:mm:ss)
  export const formatarData = (data: string | Date) => {
    const dataObj = data instanceof Date ? data : new Date(data);
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
    const ano = dataObj.getFullYear();
    const hora = String(dataObj.getHours()).padStart(2, '0');
    const minutos = String(dataObj.getMinutes()).padStart(2, '0');
    const segundos = String(dataObj.getSeconds()).padStart(2, '0');
  
    return `${dia}/${mes}/${ano} ${hora}:${minutos}:${segundos}`;
  };
  