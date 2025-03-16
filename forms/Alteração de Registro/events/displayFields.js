function displayFields(form, customHTML) {
   // Mantém a visualização de campos do formulário igual, tanto para o modo modificação quanto visualização
   form.setShowDisabledFields(true);
   // Remove o botão padrão Fluig de impressão do formulário
   form.setHidePrintLink(true);

   var codProcess = getValue("WKDef");
   var numProcess = getValue("WKNumProces");
   var state = getValue("WKNumState");
   var nextState = getValue("WKNextState");
   var mode = form.getFormMode();
   var mobile = form.getMobile();
   var currentUser = getValue("WKUser");
   var currentUserData = fluigAPI.getUserService().getCurrent();
   var currentDateHour = cDateHour();
   var currentDate = cDate();
   var currentHour = cHour();
   var customJS = "<script>";

   if (mode == "ADD") {
      var visaoAtividades = []; //"divVerificaRh", "divPlanejContrOrc", "divAprovGestorAtual", "divAprovGestorDestino", "divAprovDiretoria", "divAprovDiretorGrl", "divAssinaturaFuncionario", "divValidacaoRh"
      visaoAtividades.forEach(function (fieldId) {
         form.setVisibleById(fieldId, false);
      });

      form.setValue("requesterCode", currentUserData.getCode());
      form.setValue("requesterName", currentUserData.getFullName());
      form.setValue("requesterEmail", currentUserData.getEmail());
      form.setValue("requestDate", currentDateHour);
   }

   if (mode == "MOD") {
      if (state == AJUSTAR) {
         var visaoAtividades = ["divPlanejContrOrc", "divAprovGestorAtual", "divAprovGestorDestino", "divAprovDiretoria", "divAprovDiretorGrl", "divAssinaturaFuncionario", "divValidacaoRh"]; //Array das div's que serão ocultas
         visaoAtividades.forEach(function (fieldId) {
            form.setVisibleById(fieldId, false);
         });
      }
      if (state == AP_RH_VERIFICACAO) {
         var visaoAtividades = ["divPlanejContrOrc", "divAprovGestorAtual", "divAprovGestorDestino", "divAprovDiretoria", "divAprovDiretorGrl", "divAssinaturaFuncionario", "divValidacaoRh"]; //Array das div's que serão ocultas
         visaoAtividades.forEach(function (fieldId) {
            form.setVisibleById(fieldId, false);
         });
      }
      if (state == AP_PLANJ_CONTR_ORC) {
         var visaoAtividades = ["divVerificaRh", "divAprovGestorAtual", "divAprovGestorDestino", "divAprovDiretoria", "divAprovDiretorGrl", "divAssinaturaFuncionario", "divValidacaoRh"]; //Array das div's que serão ocultas
         visaoAtividades.forEach(function (fieldId) {
            form.setVisibleById(fieldId, false);
         });
      }
      if (state == AP_CENTRO_CUSTO_ATUAL) {
         var visaoAtividades = ["divVerificaRh", "divPlanejContrOrc", "divAprovGestorDestino", "divAprovDiretoria", "divAprovDiretorGrl", "divAssinaturaFuncionario", "divValidacaoRh"]; //Array das div's que serão ocultas
         visaoAtividades.forEach(function (fieldId) {
            form.setVisibleById(fieldId, false);
         });
      }
      if (state == AP_CENTRO_CUSTO_DESTINO) {
         var visaoAtividades = ["divVerificaRh", "divPlanejContrOrc", "divAprovGestorAtual", "divAprovDiretoria", "divAprovDiretorGrl", "divAssinaturaFuncionario", "divValidacaoRh"]; //Array das div's que serão ocultas
         visaoAtividades.forEach(function (fieldId) {
            form.setVisibleById(fieldId, false);
         });
      }
      if (state == AP_DIRETORIA) {
         var visaoAtividades = ["divVerificaRh", "divPlanejContrOrc", "divAprovGestorAtual", "divAprovGestorDestino", "divAprovDiretorGrl", "divAssinaturaFuncionario", "divValidacaoRh"]; //Array das div's que serão ocultas
         visaoAtividades.forEach(function (fieldId) {
            form.setVisibleById(fieldId, false);
         });
      }
      if (state == AP_DIRETORIA_GRL) {
         var visaoAtividades = ["divVerificaRh", "divPlanejContrOrc", "divAprovGestorAtual", "divAprovGestorDestino", "divAprovDiretoria", "divAssinaturaFuncionario", "divValidacaoRh"]; //Array das div's que serão ocultas
         visaoAtividades.forEach(function (fieldId) {
            form.setVisibleById(fieldId, false);
         });
      }
      if (state == ASS_FUNCIONARIO) {
         var visaoAtividades = ["divVerificaRh", "divPlanejContrOrc", "divAprovGestorAtual", "divAprovGestorDestino", "divAprovDiretoria", "divAprovDiretorGrl", "divValidacaoRh"]; //Array das div's que serão ocultas
         visaoAtividades.forEach(function (fieldId) {
            form.setVisibleById(fieldId, false);
         });
      }

      if (state == AP_RH_VALIDACAO) {
         var visaoAtividades = ["divVerificaRh", "divPlanejContrOrc", "divAprovGestorAtual", "divAprovGestorDestino", "divAprovDiretoria", "divAprovDiretorGrl", "divAssinaturaFuncionario"]; //Array das div's que serão ocultas
         visaoAtividades.forEach(function (fieldId) {
            form.setVisibleById(fieldId, false);
         });
      }
   }

   if (mode != "VIEW") {
      form.setValue("currentName", currentUserData.getFullName());
      form.setValue("currentLogin", currentUserData.getLogin());
   }

   if (mode == "VIEW") {
      customJS += "$('.custom-tooltip').addClass('hidden');";
   }

   // Condição para remover os botões upload/delete em determinadas atividades que precisam apenas visualizar o arquivo
   /*
   if (state != ASS_FUNCIONARIO) {
      customJS += "invisibleBtnUpload('fnNomeDoAnexo');";
   }
   */

   setApprovalData(state, form, currentUserData.getFullName(), currentUserData.getLogin(), currentUserData.getEmail(), mode, currentDate, currentHour);

   customJS += "function getCodProcess(){ return '" + codProcess + "'};";
   customJS += "function getNumProcess(){ return '" + numProcess + "'};";
   customJS += "function getState(){ return '" + state + "'};";
   customJS += "function getNextState(){ return '" + nextState + "'};";
   customJS += "function getMode(){ return '" + mode + "'};";
   customJS += "function getCurrentUser(){ return '" + currentUser + "'};";
   customJS += "function getCurrentUserData(){ return '" + currentUserData + "'};";
   customJS += "function getCurrentDateHour(){ return '" + currentDateHour + "'};";
   customJS += "function getCurrentDate(){ return '" + currentDate + "'};";
   customJS += "function getCurrentHour(){ return '" + currentHour + "'};";
   customJS += "function getMobile(){ return " + mobile + "};";
   customJS += "displayBtnFiles();"; // Habilitar em casos de uso de tabela pai-filho de anexos
   //customJS += "tableLineCount();"; // Habilitar em casos de uso de tabela pai-filho de anexos
   customJS += "</script>";
   customHTML.append(customJS);
}

function setApprovalData(activity, form, name, userID, email, mode, date, hour) {
   if (mode != "VIEW") {
      if (activity == AP_RH_VERIFICACAO) {
         form.setValue("codigoAprovadorVerificaRh", userID);
         form.setValue("emailAprovadorVerificaRh", email);
         form.setValue("nomeAprovadorVerificaRh", name);
         form.setValue("dataAprovacaoVerificaRh", date);
         form.setValue("horaAprovacaoVerificaRh", hour);
      }
      if (activity == AP_CENTRO_CUSTO_ATUAL) {
         form.setValue("codigoAprovadorGestorAtual", userID);
         form.setValue("emailAprovadorGestorAtual", email);
         form.setValue("nomeAprovadorGestorAtual", name);
         form.setValue("dataAprovacaoGestorAtual", date);
         form.setValue("horaAprovacaoGestorAtual", hour);
      }
      if (activity == AP_CENTRO_CUSTO_DESTINO) {
         form.setValue("codigoAprovadorGestorDestino", userID);
         form.setValue("emailAprovadorGestorDestino", email);
         form.setValue("nomeAprovadorGestorDestino", name);
         form.setValue("dataAprovacaoGestorDestino", date);
         form.setValue("horaAprovacaoGestorDestino", hour);
      }
      if (activity == AP_PLANJ_CONTR_ORC) {
         form.setValue("codigoAprovadorPlanejContrOrc", userID);
         form.setValue("emailAprovadorPlanejContrOrc", email);
         form.setValue("nomeAprovadorPlanejContrOrc", name);
         form.setValue("dataAprovacaoPlanejContrOrc", date);
         form.setValue("horaAprovacaoPlanejContrOrc", hour);
      }
      if (activity == AP_DIRETORIA) {
         form.setValue("codigoAprovadorDiretor", userID);
         form.setValue("emailAprovadorDiretor", email);
         form.setValue("nomeAprovadorDiretor", name);
         form.setValue("dataAprovacaoDiretor", date);
         form.setValue("horaAprovacaoDiretor", hour);
      }
      if (activity == AP_DIRETORIA_GRL) {
         form.setValue("codigoAprovadorDiretorGrl", userID);
         form.setValue("emailAprovadorDiretorGrl", email);
         form.setValue("nomeAprovadorDiretorGrl", name);
         form.setValue("dataAprovacaoDiretorGrl", date);
         form.setValue("horaAprovacaoDiretorGrl", hour);
      }
      if (activity == AP_RH_VALIDACAO) {
         form.setValue("codigoAprovadorValidacaoRh", userID);
         form.setValue("emailAprovadorValidacaoRh", email);
         form.setValue("nomeAprovadorValidacaoRh", name);
         form.setValue("dataAprovacaoValidacaoRh", date);
         form.setValue("horaAprovacaoValidacaoRh", hour);
      }
   }
}

function cDateHour() {
   var DateHour = new Date();
   var dateFormat = new java.text.SimpleDateFormat("dd/MM/yyyy HH:mm");
   return dateFormat.format(DateHour);
}

function cDate() {
   return new java.text.SimpleDateFormat("dd/MM/yyyy").format(new Date());
}

function cHour() {
   return new java.text.SimpleDateFormat("HH:mm").format(new Date());
}
