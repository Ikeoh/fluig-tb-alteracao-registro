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
      var visaoAtividades = []; //Array das div's que serão ocultas
      visaoAtividades.forEach(function (fieldId) {
         form.setVisibleById(fieldId, false);
      });

      form.setValue("requesterCode", currentUserData.getCode());
      form.setValue("requesterName", currentUserData.getFullName());
      form.setValue("requesterEmail", currentUserData.getEmail());
      form.setValue("requestDate", currentDateHour);
   }

   if (mode != "VIEW") {
      form.setValue("currentName", currentUserData.getFullName());
      form.setValue("currentLogin", currentUserData.getLogin());
   }

   if (mode == "VIEW") {
      customJS += "$('.custom-tooltip').addClass('hidden');";
   }

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
   //customJS += "displayBtnFiles();"; // Habilitar em casos de uso de tabela pai-filho de anexos
   //customJS += "tableLineCount();"; // Habilitar em casos de uso de tabela pai-filho de anexos
   customJS += "</script>";
   customHTML.append(customJS);
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
