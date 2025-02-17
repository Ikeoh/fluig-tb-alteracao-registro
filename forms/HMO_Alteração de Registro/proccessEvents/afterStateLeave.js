/******************
 * Algumas atividades de aprovação podem exigir um mecanismo de retorno.
 * Nesses casos em que o aprovador movimenta o processo, que, em algum momento irá retornar para ele validar/aprovar,
 * é necessário que o campo de controle do status de aprovação seja limpo, para garantir que o usuário não movimente
 * a atividade acidentalmente a partir de uma decisão errada.
 */
function afterStateLeave(sequenceId) {
   // Verifica se o sequenceId é igual à variável AJUSTAR
   if (sequenceId == AJUSTAR) {
      // Verifica o valor do campo "ativAprovStatusJuridico_014"
      var statusJuridico = hAPI.getCardValue("ativAprovStatusJuridico_014");
      if (statusJuridico == "AJUSTAR") {
         // Se for "AJUSTAR", limpa o campo
         hAPI.setCardValue("ativAprovStatusJuridico_014", "");
      }

      // Verifica o valor do campo "ativAprovStatusRh_014"
      var statusRh = hAPI.getCardValue("ativAprovStatusRh_014");
      if (statusRh == "AJUSTAR") {
         // Se for "AJUSTAR", limpa o campo
         hAPI.setCardValue("ativAprovStatusRh_014", "");
      }
   }
}
