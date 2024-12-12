$(document).ready(function () {
   $("#requesterAvatar").attr("src", "/social/api/rest/social/image/profile/" + $("#requesterCode").val() + "/SMALL_PICTURE");

   adjustHeaderLayout(); // Executa no carregamento
   $(window).resize(adjustHeaderLayout); // Executa no redimensionamento

   setTimeout(function () {
      window["matricula_016"].disable(true);
   }, 300);
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

$(document).ready(function () {
   // Função para alternar as cores dos botões de uma atividade específica
   const toggleButtonColors = (clickedButtonId, activityPrefix) => {
      $(`#btnAprovar${activityPrefix}`).addClass("btn-inactive");
      $(`#btnReprovar${activityPrefix}`).addClass("btn-inactive");
      $(`#btnAjustar${activityPrefix}`).addClass("btn-inactive");

      $(`#${clickedButtonId}`).removeClass("btn-inactive");
   };

   // Função para desabilitar os botões no modo VIEW
   const disableButtons = (activityPrefix) => {
      if (getMode() == "VIEW") {
         $(`#btnAprovar${activityPrefix}`).prop("disabled", true);
         $(`#btnReprovar${activityPrefix}`).prop("disabled", true);
         $(`#btnAjustar${activityPrefix}`).prop("disabled", true);
         $(`#justificativa${activityPrefix}`).prop("readonly", true);
      }
   };

   // Função para manipular a mudança de aprovação de uma atividade específica
   const handleButtonChangeAprovacao = (activityPrefix) => {
      $(`#btnAprovar${activityPrefix}`).click(function () {
         $(`#ativAprovStatus${activityPrefix}`).val("APROVADO");
         $(`#justificativa${activityPrefix}`).val("").prop("readonly", true);
         $(`#spanJustificativa${activityPrefix}`).addClass("hidden");
         toggleButtonColors(`btnAprovar${activityPrefix}`, activityPrefix);
      });

      $(`#btnReprovar${activityPrefix}`).click(function () {
         $(`#ativAprovStatus${activityPrefix}`).val("REPROVADO");
         $(`#justificativa${activityPrefix}`).prop("readonly", false);
         $(`#spanJustificativa${activityPrefix}`).removeClass("hidden");
         toggleButtonColors(`btnReprovar${activityPrefix}`, activityPrefix);
      });

      $(`#btnAjustar${activityPrefix}`).click(function () {
         $(`#ativAprovStatus${activityPrefix}`).val("AJUSTAR");
         $(`#justificativa${activityPrefix}`).prop("readonly", false);
         $(`#spanJustificativa${activityPrefix}`).removeClass("hidden");
         toggleButtonColors(`btnAjustar${activityPrefix}`, activityPrefix);
      });
   };

   // Função para verificar o status inicial e aplicar a cor correta nos botões
   const checkInitialStatus = (activityPrefix) => {
      const statusValue = $(`#ativAprovStatus${activityPrefix}`).val();

      if (statusValue === "APROVADO") {
         toggleButtonColors(`btnAprovar${activityPrefix}`, activityPrefix);
         $(`#justificativa${activityPrefix}`).prop("readonly", true);
         $(`#spanJustificativa${activityPrefix}`).addClass("hidden");
      } else if (statusValue === "REPROVADO") {
         toggleButtonColors(`btnReprovar${activityPrefix}`, activityPrefix);
         $(`#justificativa${activityPrefix}`).prop("readonly", false);
         $(`#spanJustificativa${activityPrefix}`).removeClass("hidden");
      } else if (statusValue === "AJUSTAR") {
         toggleButtonColors(`btnAjustar${activityPrefix}`, activityPrefix);
         $(`#justificativa${activityPrefix}`).prop("readonly", false);
         $(`#spanJustificativa${activityPrefix}`).removeClass("hidden");
      } else {
         $(`#btnAprovar${activityPrefix}`).addClass("btn-inactive");
         $(`#btnReprovar${activityPrefix}`).addClass("btn-inactive");
         $(`#btnAjustar${activityPrefix}`).addClass("btn-inactive");
         $(`#justificativa${activityPrefix}`).prop("readonly", true);
         $(`#spanJustificativa${activityPrefix}`).addClass("hidden");
      }
   };

   // Lista de atividades de aprovação a serem manipuladas
   const activities = ["GestorAtual", "GestorDestino", "PlanejContrOrc", "DiretorAdm", "DiretorGrl", "ValidacaoRh"];

   // Inicializa a manipulação dos botões e verifica o status inicial para cada atividade
   activities.forEach((activity) => {
      handleButtonChangeAprovacao(activity);
      checkInitialStatus(activity);
      disableButtons(activity); // Desabilita os botões de acordo com as condições;
   });
});

function setSelectedZoomItem(selectedItem) {
   console.log(selectedItem);

   if (selectedItem.inputId == "filial_016") {
      $("#numeroFilial_016").val(selectedItem.M0_CODFIL);
      reloadZoomFilterValues("matricula_016", "RA_FILIAL," + selectedItem["M0_CODFIL"]);

      window["matricula_016"].disable(false);
   }

   if (selectedItem.inputId == "matricula_016") {
      $("#numeroMatricula_016").val(selectedItem.RA_MAT);
   }

   if (selectedItem.inputId == "campoZoomId") {
      $("#centroCustoFuncionario").val(selectedItem.RA_CC.trim());

      let centroCusto = $("#centroCustoFuncionario").val();
      console.log("Centro de Custo: ", centroCusto);
      if (centroCusto) {
         let constraints = [DatasetFactory.createConstraint("CTT_CUSTO", centroCusto, centroCusto, ConstraintType.MUST)];
         console.log("Constraints: ", constraints);
         let dataset = DatasetFactory.getDataset("ds_gtb_jdbc_centro_de_custo", null, constraints, null);
         console.log("Dataset: ", dataset);

         if (dataset && dataset.values.length > 0) {
            // Itera sobre os registros para encontrar o centro de custo correto
            let responsavelLogin = null;
            for (let i = 0; i < dataset.values.length; i++) {
               if (dataset.values[i]["CTT_CUSTO"] === centroCusto) {
                  responsavelLogin = dataset.values[i]["XRES_LOGIN"];
                  break; // Parar a iteração quando encontrar o registro correto
               }
            }

            // Atribuindo o valor do login ao campo responsavelCentroCusto_014
            if (responsavelLogin) {
               $("#responsavelCentroCusto").val(responsavelLogin);
               console.log("Responsável pelo centro de custo: " + responsavelLogin);
            } else {
               console.log("Nenhum responsável encontrado para o centro de custo: " + centroCusto);
            }
         }
      }
   }
}

function removedZoomItem(removedItem) {
   if (removedItem.inputId == "filial_016") {
      $("#numeroFilial_016").val("");

      window["matricula_016"].disable(true);
   }
}
