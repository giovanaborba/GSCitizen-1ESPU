import EspacoIcone from "@/components/ui/EspacoIcone";

/*
  ErroCampo — mensagem de erro curta, com ícone + texto (a cor nunca
  carrega a informação sozinha, seção 3, item 7).

  Usada junto de cada campo do formulário (ligada por aria-describedby,
  pelo "id"), junto do botão "Salvar registro" e dentro do diálogo de
  exclusão. Com papel="alert", o leitor de tela anuncia na hora.
*/
export default function ErroCampo({ id, papel, className = "", children }) {
  return (
    <p id={id} role={papel} className={`flex items-start gap-2 font-bold text-erro ${className}`}>
      {/* ICONE-WarningCircle-AQUI */}
      <EspacoIcone nome="WarningCircle" />
      <span>{children}</span>
    </p>
  );
}
