/**
 * Controla a habilitação dos campos do formulário com base na atividade do processo.
 * @param {FormController} form
 */
function enableFields(form) {
   var activity = getValue("WKNumState");

   // Lista de todos os campos que podem ser desabilitados/readonly
   var allFields = ["salarioAtual_016", "filial_016", "nomeFuncionario_016", "filialDestino_016", "centroCustoDestino_016", "cargoDestino_016", "salarioDestino_016", "codHorarioDestino_016", "tipoContratoDestino_016", "departamentoDestino_016", "justificativaVerificaRh", "btnAprovarVerificaRh", "btnReprovarVerificaRh", "btnAjustarVerificaRh", "justificativaGestorAtual", "btnAprovarGestorAtual", "btnReprovarGestorAtual", "btnAjustarGestorAtual", "justificativaGestorDestino", "btnAprovarGestorDestino", "btnReprovarGestorDestino", "btnAjustarGestorDestino", "justificativaPlanejContrOrc", "btnAprovarPlanejContrOrc", "btnReprovarPlanejContrOrc", "btnAjustarPlanejContrOrc", "justificativaDiretoria", "btnAprovarDiretor", "btnReprovarDiretor", "btnAjustarDiretor", "justificativaDiretorGrl", "btnAprovarDiretorGrl", "btnReprovarDiretorGrl", "btnAjustarDiretorGrl", "justificativaValidacaoRh", "btnAprovarValidacaoRh", "btnReprovarValidacaoRh", "btnAjustarValidacaoRh"];

   // Desabilita todos os campos por padrão
   allFields.forEach(function (field) {
      form.setEnabled(field, false);
   });

   // Habilita campos específicos com base na atividade atual
   if (activity == ABERTURA || activity == AJUSTAR) {
      var fieldsToEnable = ["salarioAtual_016", "filial_016", "nomeFuncionario_016", "filialDestino_016", "centroCustoDestino_016", "cargoDestino_016", "salarioDestino_016", "codHorarioDestino_016", "tipoContratoDestino_016", "departamentoDestino_016"];
      fieldsToEnable.forEach(function (field) {
         form.setEnabled(field, true);
      });
   } else if (activity == AP_RH_VERIFICACAO) {
      form.setEnabled("justificativaVerificaRh", true);
      form.setEnabled("btnAprovarVerificaRh", true);
      form.setEnabled("btnReprovarVerificaRh", true);
      form.setEnabled("btnAjustarVerificaRh", true);
   } else if (activity == AP_CENTRO_CUSTO_ATUAL) {
      form.setEnabled("justificativaGestorAtual", true);
      form.setEnabled("btnAprovarGestorAtual", true);
      form.setEnabled("btnReprovarGestorAtual", true);
      form.setEnabled("btnAjustarGestorAtual", true);
   } else if (activity == AP_CENTRO_CUSTO_DESTINO) {
      form.setEnabled("justificativaGestorDestino", true);
      form.setEnabled("btnAprovarGestorDestino", true);
      form.setEnabled("btnReprovarGestorDestino", true);
      form.setEnabled("btnAjustarGestorDestino", true);
   } else if (activity == AP_PLANJ_CONTR_ORC) {
      form.setEnabled("justificativaPlanejContrOrc", true);
      form.setEnabled("btnAprovarPlanejContrOrc", true);
      form.setEnabled("btnReprovarPlanejContrOrc", true);
      form.setEnabled("btnAjustarPlanejContrOrc", true);
   } else if (activity == AP_DIRETORIA) {
      form.setEnabled("justificativaDiretoria", true);
      form.setEnabled("btnAprovarDiretor", true);
      form.setEnabled("btnReprovarDiretor", true);
      form.setEnabled("btnAjustarDiretor", true);
   } else if (activity == AP_DIRETORIA_GRL) {
      form.setEnabled("justificativaDiretorGrl", true);
      form.setEnabled("btnAprovarDiretorGrl", true);
      form.setEnabled("btnReprovarDiretorGrl", true);
      form.setEnabled("btnAjustarDiretorGrl", true);
   } else if (activity == AP_RH_VALIDACAO) {
      form.setEnabled("justificativaValidacaoRh", true);
      form.setEnabled("btnAprovarValidacaoRh", true);
      form.setEnabled("btnReprovarValidacaoRh", true);
      form.setEnabled("btnAjustarValidacaoRh", true);
   }
}
