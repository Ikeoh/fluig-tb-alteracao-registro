function afterProcessCreate(processId) {
   // Define o valor do campo requestNumber com o ID do processo
   hAPI.setCardValue("requestNumber", processId);

   // Gera um token aleatório
   var accessToken = generateRandomToken();

   // Define o valor do campo accessToken com o token gerado
   hAPI.setCardValue("accessToken", accessToken);
}

// Função para gerar um token aleatório
function generateRandomToken() {
   // Define os caracteres que podem ser usados no token
   var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
   var token = "";
   // Gera um token com 10 caracteres
   for (var i = 0; i < 10; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
   }
   return token;
}
