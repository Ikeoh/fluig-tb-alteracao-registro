var beforeSendValidate = function (numState, nextState) {
   let mode = getMode();
   let state = getState();
   let msgErro = "";

   if (mode == "ADD" || mode == "MOD") {
      if ($("#acPericulosidade").is(":checked") && campoVazio("percentualPericulosidade")) {
         msgErro += "<li style='margin-bottom: 5px;'>O campo <strong>Percentual de Periculosidade</strong> é de preenchimento obrigatório.</li>";
      }

      if ($("#acInsalubridade").is(":checked") && campoVazio("percentualInsalubridade")) {
         msgErro += "<li style='margin-bottom: 5px;'>O campo <strong>Percentual de Insalubridade</strong> é de preenchimento obrigatório.</li>";
      }
   }

   if (mode == "MOD") {
      if (state == AP_RH_VERIFICACAO) {
         if (campoVazio("regraDestino")) {
            msgErro += "<li style='margin-bottom: 5px;'>O campo <strong>Regra de Apontamento</strong> é de preenchimento obrigatório.</li>";
         }
      }
   }

   if (msgErro !== "") {
      msgErro = "<ul style='padding-left: 17px;color: red;list-style: disc;'>" + msgErro + "</ul><br/>";
      exibirMensagem(msgErro);
      return false; // Impede a movimentação da atividade
   }

   return true; // Permite a movimentação se não houver erros
};

// Função para verificar se o campo está vazio usando jQuery
function campoVazio(fieldname) {
   let value = $.trim($('[name="' + fieldname + '"]').val());
   return value === null || value === undefined || value === "";
}

// Função para exibir a mensagem de erro sem lançar exceção
function exibirMensagem(mensagem) {
   FLUIGC.modal({
      title: "ATENÇÃO!",
      content: mensagem,
      id: "fluig-modal",
      actions: [
         {
            label: "Ok",
            bind: 'data-dismiss="modal"',
         },
      ],
   });
}