export const formatCPF = (value: string) => {
  const cpfClean = value.replace(/\D/g, "");
  const cpfMax = cpfClean.slice(0, 11);
  let formatted = cpfMax;
  if (cpfMax.length > 3) {
    formatted = `${cpfMax.slice(0, 3)}.${cpfMax.slice(3)}`;
  }
  if (cpfMax.length > 6) {
    formatted = `${formatted.slice(0, 7)}.${cpfMax.slice(6)}`;
  }
  if (cpfMax.length > 9) {
    formatted = `${formatted.slice(0, 11)}-${cpfMax.slice(9)}`;
  }
  return formatted;
};
export const formatTelefone = (value: string) => {
  const telefoneClean = value.replace(/\D/g, "");
  const telefoneMax = telefoneClean.slice(0, 11);
  let formatted = telefoneMax;
  if (telefoneMax.length > 2) {
    formatted = `(${telefoneMax.slice(0, 2)})`;
    if (telefoneMax.length > 2) {
      formatted += ` ${telefoneMax.slice(2)}`;
    }
    if (telefoneMax.length > 7) {
      formatted = `(${telefoneMax.slice(0, 2)}) ${telefoneMax.slice(2, 7)}-${telefoneMax.slice(7)}`;
    }
  }
  return formatted;
};