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

   if (mode == "MOD") {
      if (state == 5) {
         // Assuming 5 is AP_RH_VERIFICACAO
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

   if (mode == "ADD" || mode == "MOD") {
      if (handlePromotionValidation()) {
         showRHValidationModal();
         return false;
      }
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

function getDatasetSync(datasetId, fields, constraints, order) {
   var dataset;
   var url = "/api/public/ecm/dataset/datasets";
   var data = {
      name: datasetId,
      fields: fields,
      constraints: constraints,
      order: order,
   };

   $.ajax({
      url: url,
      type: "POST",
      async: false,
      contentType: "application/json",
      data: JSON.stringify(data),
      success: function (data) {
         dataset = data.content;
      },
      error: function (jqXHR, textStatus, errorThrown) {
         console.error("Error getting dataset sync: ", errorThrown);
         dataset = { values: [] }; // Return empty on error
      },
   });

   return dataset;
}

/**
 * Lida com a validação de promoção, verificando alterações de cargo e salário.
 */
function handlePromotionValidation() {
   const codCargoAtual = $("#codCargoAtual").val();
   const codCargoDestino = $("#codCargoDestino").val();
   const salarioDestino = $("#salarioDestino").val();
   const numeroMatricula = $("#numeroMatricula").val();

   if (!numeroMatricula) {
      return false;
   }

   if (codCargoDestino && codCargoAtual !== codCargoDestino) {
      return checkPromotionRules(numeroMatricula);
   } else if (salarioDestino) {
      return checkSalaryChange(numeroMatricula, salarioDestino);
   }

   return false;
}

/**
 * Verifica se o salário foi alterado em comparação com o salário atual do funcionário.
 */
function checkSalaryChange(numeroMatricula, salarioDestino) {
   const constraints = [{ _field: "RA_MAT", _initialValue: numeroMatricula, _finalValue: numeroMatricula, _type: 1 }];
   const data = getDatasetSync("ds_gtb_jdbc_016_matricula", null, constraints, null);

   if (data && data.values.length > 0) {
      const salarioAtual = data.values[0].RA_SALARIO;
      if (salarioDestino.replace(/[^\d,]/g, "").replace(",", ".") !== salarioAtual) {
         return checkPromotionRules(numeroMatricula);
      }
   }
   return false;
}

/**
 * Verifica as regras de promoção (tempo de admissão e última alteração salarial).
 */
function checkPromotionRules(numeroMatricula) {
   const today = new Date();
   const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

   const admissionDate = getAdmissionDate(numeroMatricula);
   const lastSalaryChange = getLastSalaryChangeDate(numeroMatricula);

   let showAlert = false;

   if (admissionDate) {
      const year = admissionDate.substring(0, 4);
      const month = admissionDate.substring(4, 6);
      const day = admissionDate.substring(6, 8);
      const admissionDateObj = new Date(year, month - 1, day);
      if (admissionDateObj > oneYearAgo) {
         showAlert = true;
      }
   }

   if (lastSalaryChange) {
      const year = lastSalaryChange.substring(0, 4);
      const month = lastSalaryChange.substring(4, 6);
      const day = lastSalaryChange.substring(6, 8);
      const lastSalaryChangeObj = new Date(year, month - 1, day);
      if (lastSalaryChangeObj > oneYearAgo) {
         showAlert = true;
      }
   }

   return showAlert;
}

/**
 * Busca a data de admissão do funcionário.
 */
function getAdmissionDate(numeroMatricula) {
   const constraints = [{ _field: "RA_MAT", _initialValue: numeroMatricula, _finalValue: numeroMatricula, _type: 1 }];
   const dataset = getDatasetSync("ds_gtb_jdbc_016_matricula", null, constraints, null);
   if (dataset && dataset.values.length > 0) {
      return dataset.values[0].RA_ADMISSA;
   }
   return null;
}

/**
 * Busca a data da última alteração salarial do funcionário.
 */
function getLastSalaryChangeDate(numeroMatricula) {
   const constraints = [{ _field: "R7_MAT", _initialValue: numeroMatricula, _finalValue: numeroMatricula, _type: 1 }];
   const dataset = getDatasetSync("ds_gtb_jdbc_016_alteracao_salarial", null, constraints, null);
   if (dataset && dataset.values.length > 0) {
      return dataset.values[0].R7_DATA;
   }
   return null;
}

/**
 * Exibe um modal informando que a solicitação será avaliada pelo RH.
 */
function showRHValidationModal() {
   FLUIGC.modal({
      title: "Atenção",
      content: "Solicitações que envolvem promoção serão analisadas pelo RH",
      id: "promotion-validation-modal",
      actions: [
         {
            label: "OK",
            autoClose: true,
         },
      ],
   });
}
