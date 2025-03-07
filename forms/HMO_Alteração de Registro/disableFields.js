$(document).ready(function () {
   let state = getState();
   let mode = getMode();

   // Verifica se a atividade atual é diferente de 'ABERTURA'
   if (state != ABERTURA) {
      readonlyFields(["salarioAtual_016", "filial_016", "matricula_016", "filialDestino_016", "centroCustoDestino_016", "cargoDestino_016", "salarioDestino_016", "codHorarioDestino_016", "tipoContratoDestino_016"]);
      disableFields([]);
   }
   if (state != INICIO) {
      readonlyFields([]);
      disableFields([]);
   }
   if (state != AP_RH_VERIFICACAO) {
      readonlyFields([]);
      disableFields(["btnAprovarVerificaRh", "btnReprovarVerificaRh", "btnAjustarVerificaRh"]);
      preventInteraction([]);
   }
   if (state != AP_CENTRO_CUSTO_ATUAL) {
      readonlyFields([]);
      disableFields(["btnAprovarGestorAtual", "btnReprovarGestorAtual", "btnAjustarGestorAtual"]);
      preventInteraction([]);
   }
   if (state != AP_CENTRO_CUSTO_DESTINO) {
      readonlyFields([]);
      disableFields(["btnAprovarGestorDestino", "btnReprovarGestorDestino", "btnAjustarGestorDestino"]);
      preventInteraction([]);
   }
   if (state != AP_PLANJ_CONTR_ORC) {
      readonlyFields([]);
      disableFields(["btnAprovarPlanejContrOrc", "btnReprovarPlanejContrOrc", "btnAjustarPlanejContrOrc"]);
      preventInteraction([]);
   }
   if (state != AP_DIRETORIA) {
      readonlyFields([]);
      disableFields(["btnAprovarDiretor", "btnReprovarDiretor", "btnAjustarDiretor"]);
      preventInteraction([]);
   }
   if (state != AP_DIRETORIA_GRL) {
      readonlyFields([]);
      disableFields(["btnAprovarDiretorGrl", "btnReprovarDiretorGrl", "btnAjustarDiretorGrl"]);
      preventInteraction([]);
   }
   if (state != ASS_FUNCIONARIO) {
      readonlyFields([]);
      disableFields([]);
   }
   if (state != AP_RH_VALIDACAO) {
      readonlyFields([]);
      disableFields(["btnAprovarValidacaoRh", "btnReprovarValidacaoRh", "btnAjustarValidacaoRh"]);
      preventInteraction([]);
   }
   if (state != AJUSTAR) {
      readonlyFields([]);
      disableFields([]);
   }
});

// Função para definir campos como readonly
function readonlyFields(fieldList) {
   fieldList.forEach(function (fieldId) {
      $("#" + fieldId).prop("readonly", true);
   });
}

// Função para definir campos como disabled
function disableFields(fieldList) {
   fieldList.forEach(function (fieldId) {
      $("#" + fieldId).prop("disabled", true);
   });
}

// Função para definir campos como readonly dentro de uma tabela pai-filho
function readonlyFieldsTable(tableName, fieldList) {
   // Para cada linha da tabela pai-filho
   $('table[id="' + tableName + '"] tbody tr').each(function () {
      // Verifica se o input "anexoCodigo" existe na linha para garantir que não estamos processando a linha oculta
      let anexoCodigo = $(this).find("input[name^='anexoCodigo']");

      // Se a linha contém o campo de código, processa a linha
      if (anexoCodigo.length > 0) {
         let rowId = anexoCodigo.attr("name").split("___")[1]; // Captura o id único da linha

         // Itera sobre a lista de campos e os torna readonly
         fieldList.forEach(function (fieldId) {
            $("#" + fieldId + "___" + rowId).prop("readonly", true); // Torna o campo readonly
         });
      }
   });
}

// Função para definir campos como disable dentro de uma tabela pai-filho
function disableFieldsTable(tableName, fieldList) {
   // Para cada linha da tabela pai-filho
   $('table[id="' + tableName + '"] tbody tr').each(function () {
      // Verifica se o input "anexoCodigo" existe na linha para garantir que não estamos processando a linha oculta
      let anexoCodigo = $(this).find("input[name^='anexoCodigo']");

      // Se a linha contém o campo de código, processa a linha
      if (anexoCodigo.length > 0) {
         let rowId = anexoCodigo.attr("name").split("___")[1]; // Captura o id único da linha

         // Itera sobre a lista de campos e os torna readonly
         fieldList.forEach(function (fieldId) {
            $("#" + fieldId + "___" + rowId).prop("readonly", true); // Torna o campo readonly
         });
      }
   });
}

// Função para prevenir a interação de click em um chackbox
function preventInteraction(fieldList) {
   fieldList.forEach(function (fieldId) {
      $("#" + fieldId).on("click", function (e) {
         e.preventDefault(); // Previne a ação de alterar o estado do checkbox
      });
   });
}
