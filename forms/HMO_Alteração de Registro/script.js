$(document).ready(function () {
   $("#requesterAvatar").attr("src", "/social/api/rest/social/image/profile/" + $("#requesterCode").val() + "/SMALL_PICTURE");

   adjustHeaderLayout(); // Executa no carregamento
   $(window).resize(adjustHeaderLayout); // Executa no redimensionamento
});

// Função para alterar a estrutura do header com base no tamanho da tela para garantir responsividade
function adjustHeaderLayout() {
   var tbTittle = $(".tb-tittle");
   var tbUserData = $(".tb-user-data");

   if ($(window).width() <= 1200) {
      // Para notebooks (telas menores)
      tbTittle.removeClass("col-sm-7").addClass("col-sm-6");
      tbUserData.removeClass("col-sm-2").addClass("col-sm-3");
   } else {
      // Para desktops (telas maiores)
      tbTittle.removeClass("col-sm-6").addClass("col-sm-7");
      tbUserData.removeClass("col-sm-3").addClass("col-sm-2");
   }
}
