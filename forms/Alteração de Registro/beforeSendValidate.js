var promotionWarningShown = false;

var beforeSendValidate = function (numState, nextState) {
   console.log("--- Debug: Iniciando beforeSendValidate ---");
   let mode = getMode();
   let state = getState();
   let msgErro = "";

   // Bloco de validação de campos obrigatórios (existente)
   if (mode == "ADD" || mode == "MOD") {
      if ($("#acPericulosidade").is(":checked") && campoVazio("percentualPericulosidade")) {
         msgErro += "<li style='margin-bottom: 5px;'>O campo <strong>Percentual de Periculosidade</strong> é de preenchimento obrigatório.</li>";
      }
      if ($("#acInsalubridade").is(":checked") && campoVazio("percentualInsalubridade")) {
         msgErro += "<li style='margin-bottom: 5px;'>O campo <strong>Percentual de Insalubridade</strong> é de preenchimento obrigatório.</li>";
      }
      if ($("#acDiaria").is(":checked") && campoVazio("valorDiaria")) {
         msgErro += "<li style='margin-bottom: 5px;'>O campo <strong>Valor da Diária</strong> é de preenchimento obrigatório.</li>";
      }
      if ($("#acGratificacao").is(":checked") && campoVazio("valorGratificacao")) {
         msgErro += "<li style='margin-bottom: 5px;'>O campo <strong>Valor da Gratificação</strong> é de preenchimento obrigatório.</li>";
      }
      if ($("#acValeTransporte").is(":checked")) {
         if (campoVazio("valorValeTransporte")) {
            msgErro += "<li style='margin-bottom: 5px;'>O campo <strong>Valor do Vale Transporte</strong> é de preenchimento obrigatório.</li>";
         }
         if (campoVazio("qtdValeTransporte")) {
            msgErro += "<li style='margin-bottom: 5px;'>O campo <strong>Quantidade do Vale Transporte</strong> é de preenchimento obrigatório.</li>";
         }
      }
   }
   if (mode == "MOD" && state == 5) {
      if (campoVazio("regraDestino")) {
         msgErro += "<li style='margin-bottom: 5px;'>O campo <strong>Regra de Apontamento</strong> é de preenchimento obrigatório.</li>";
      }
   }

   if (msgErro !== "") {
      msgErro = "<ul style='padding-left: 17px;color: red;list-style: disc;'>" + msgErro + "</ul><br/>";
      exibirMensagem(msgErro);
      return false;
   }

   // NOVA LÓGICA DE VALIDAÇÃO DE PROMOÇÃO E SALÁRIO
   if ((mode == "ADD" || mode == "MOD") && (state == ABERTURA || state == AJUSTAR)) {
      console.log("--- Debug: Entrando na nova lógica de validação ---");
      const codCargoAtual = $("#codCargoAtual").val();
      const codCargoDestino = $("#codCargoDestino").val();
      const salarioDestinoValue = $("#salarioDestino").val();
      const numeroMatricula = $("#numeroMatricula").val().trim();

      console.log("Valores do formulário -> Matricula:", numeroMatricula, ", Cargo Atual:", codCargoAtual, ", Cargo Destino:", codCargoDestino, ", Salário Destino:", salarioDestinoValue);

      if (numeroMatricula && (codCargoDestino || salarioDestinoValue)) {
         const c1 = DatasetFactory.createConstraint("RA_MAT", numeroMatricula, numeroMatricula, ConstraintType.MUST);
         const dataset = DatasetFactory.getDataset("ds_gtb_jdbc_016_matricula", null, [c1], null);

         console.log("Resultado do dataset de matrícula:", dataset);

         // CORREÇÃO: Usar a estrutura de dados do dataset do lado do cliente (values.length e values[0])
         if (dataset != null && dataset.values.length > 0) {
            const salarioAtualDB = dataset.values[0].RA_SALARIO;
            const normalizedSalarioAtual = parseFloat(String(salarioAtualDB).replace(",", "."));
            const normalizedSalarioDestino = parseFloat(salarioDestinoValue.replace(/[^\d,]/g, "").replace(",", "."));

            console.log("Salário Atual (BD):", salarioAtualDB, "| Normalizado:", normalizedSalarioAtual);
            console.log("Salário Destino (Form):", salarioDestinoValue, "| Normalizado:", normalizedSalarioDestino);

            // REGRA 1: Salário destino não pode ser menor que o atual
            if (!isNaN(normalizedSalarioDestino) && normalizedSalarioDestino < normalizedSalarioAtual) {
               console.log("VALIDAÇÃO FALHOU: Salário de destino é menor que o atual.");
               exibirMensagem("O salário de destino não pode ser menor que o salário atual.");
               return false; // Bloqueia o envio
            }

            const hasJobChange = codCargoDestino && codCargoAtual !== codCargoDestino;
            const hasSalaryIncrease = !isNaN(normalizedSalarioDestino) && normalizedSalarioDestino > normalizedSalarioAtual;

            console.log("Tem mudança de cargo?", hasJobChange);
            console.log("Tem aumento de salário?", hasSalaryIncrease);

            // REGRA 2: Se tem mudança de cargo ou aumento, mostra alerta do RH
            if ((hasJobChange || hasSalaryIncrease) && !promotionWarningShown) {
               console.log("VALIDAÇÃO: Mudança de cargo ou aumento salarial detectada. Mostrando modal do RH.");
               promotionWarningShown = true;
               showRHValidationModal();
               return false; // Bloqueia o envio para mostrar o modal
            }
         } else {
            console.log("AVISO: Não foram encontrados dados no dataset para a matrícula informada.");
         }
      }
   }

   console.log("--- Debug: Fim do beforeSendValidate, permitindo envio ---");
   return true; // Permite o envio se nenhuma regra bloquear
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
      id: "fluig-modal-validation",
      actions: [
         {
            label: "Ok",
            autoClose: true,
         },
      ],
   });
}

/**
 * Exibe um modal informando que a solicitação será avaliada pelo RH.
 */
function showRHValidationModal() {
   FLUIGC.modal({
      title: "Atenção",
      content: "<p style='color: red;'>Solicitações que envolvem promoção serão analisadas pelo RH</p>",
      id: "promotion-validation-modal",
      actions: [
         {
            label: "OK",
            autoClose: true,
         },
      ],
   });
}
