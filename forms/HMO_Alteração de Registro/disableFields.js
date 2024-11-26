$(document).ready(function () {
   let state = getState();
   let mode = getMode();

   // Verifica se a atividade atual é diferente de 'ABERTURA'
   if (state != ABERTURA) {
      readonlyFields(["fieldId_1", "fieldId_2", "fieldId_3"]);
      readonlyFieldsTable("tableName", ["tableFieldId_1", "tableFieldId_2", "tableFieldId_3"]);
      disableFields(["fieldId_1", "fieldId_2", "fieldId_3"]);
      disableFieldsTable("tableName", ["tableFieldId_1", "tableFieldId_2", "tableFieldId_3"]);
      preventInteraction(["fieldId_1", "fieldId_2", "fieldId_3"]);
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
