$(document).ready(function () {
   $("#requesterAvatar").attr("src", "/social/api/rest/social/image/profile/" + $("#requesterCode").val() + "/SMALL_PICTURE");

   adjustHeaderLayout(); // Executa no carregamento
   $(window).resize(adjustHeaderLayout); // Executa no redimensionamento

   setTimeout(function () {
      //window["matricula_016"].disable(true);
      //window["filialDestino_016"].disable(true);
      //window["centroCustoDestino_016"].disable(true);
      //window["cargoDestino_016"].disable(true);
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

   if (selectedItem.inputId == "filialDestino_016") {
      reloadZoomFilterValues("cargoDestino_016", "RJ_FILIAL," + selectedItem["M0_CODFIL_3DIG"]);
      reloadZoomFilterValues("codHorarioDestino_016", "R6_FILIAL," + selectedItem["M0_CODFIL_3DIG"]);
      reloadZoomFilterValues("tipoContratoDestino_016", "RCC_FILIAL," + selectedItem["M0_CODFIL_3DIG"]);
      window["cargoDestino_016"].disable(false);
      window["codHorarioDestino_016"].disable(false);
      window["tipoContratoDestino_016"].disable(false);
   }

   if (selectedItem.inputId == "centroCustoDestino_016") {
      const centroCusto = selectedItem["CTT_CUSTO"];
      getAndDisplaySaldoDisponivel(centroCusto);
   }

   if (selectedItem.inputId == "matricula_016") {
      $("#numeroMatricula_016").val(selectedItem.RA_MAT);
      $("#filialAtual_016").val(selectedItem.RA_FILIAL);
      $("#centroCustoAtual_016").val(selectedItem.RA_CC);
      $("#codCargoAtual_016").val(selectedItem.RA_CARGO);
      $("#cargoAtual_016").val(selectedItem.RJ_DESC);
      //$("#salarioAtual_016").val("");
      $("#codHorarioAtual_016").val(selectedItem.RA_TNOTRAB);
      $("#horarioAtual_016").val(selectedItem.R6_DESC);
      $("#tipoContratoAtual_016").val(selectedItem.RCC_DESC);
      window["filialDestino_016"].disable(false);
      window["centroCustoDestino_016"].disable(false);
   }

   if (selectedItem.inputId == "cargoDestino_016") {
      $("#codCargoDestino_016").val(selectedItem.RJ_FUNCAO);
   }

   if (selectedItem.inputId == "codHorarioDestino_016") {
      $("#horarioDestino_016").val(selectedItem.R6_DESC);
   }

   if (selectedItem.inputId == "tipoContratoDestino_016") {
      $("#codTipoContratoDestino_016").val(selectedItem.RCC_CODIGO_CONTEU);
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

      window["matricula_016"].clear();
      window["matricula_016"].disable(true);
   }

   if (removedItem.inputId == "matricula_016") {
      $("#numeroMatricula_016").val("");
      $("#filialAtual_016").val("");
      $("#centroCustoAtual_016").val("");
      $("#codCargoAtual_016").val("");
      $("#cargoAtual_016").val("");
      $("#salarioAtual_016").val("");
      $("#codHorarioAtual_016").val("");
      $("#horarioAtual_016").val("");
      $("#tipoContratoAtual_016").val("");
      window["filialDestino_016"].clear();
      window["filialDestino_016"].disable(true);
      window["centroCustoDestino_016"].clear();
      window["centroCustoDestino_016"].disable(true);
      window["tipoContratoAtual_016"].clear();
      window["tipoContratoAtual_016"].disable(true);
   }

   if (removedItem.inputId == "filialDestino_016") {
      window["centroCustoDestino_016"].clear();
      $("#codCargoDestino_016").val("");
      window["cargoDestino_016"].clear();
      window["cargoDestino_016"].disable(true);
      window["codHorarioDestino_016"].clear();
      window["codHorarioDestino_016"].disable(true);
      $("#horarioDestino_016").val("");
      $("#codTipoContratoDestino_016").val("");
      window["tipoContratoDestino_016"].clear();
      window["tipoContratoDestino_016"].disable(true);
   }

   if (removedItem.inputId == "centroCustoDestino_016") {
      $("#saldoVagasDisponivel").val("");
   }

   if (removedItem.inputId == "cargoDestino_016") {
      $("#codCargoDestino_016").val("");
   }

   if (removedItem.inputId == "codHorarioDestino_016") {
      $("#horarioDestino_016").val("");
   }

   if (removedItem.inputId == "tipoContratoDestino_016") {
      $("#codTipoContratoDestino_016").val("");
   }
}

function formatarMoeda($elemento) {
   // Pega o valor atual do campo
   var valor = $elemento.val();

   // Remove tudo o que não é dígito ou vírgula
   valor = valor.replace(/[^\d,]/g, "");

   // Substitui vírgula por ponto e remove pontos extras
   valor = valor.replace(",", ".").replace(/\./g, "");

   // Adiciona zeros à esquerda se o valor for menor que 100 (centavos)
   if (valor && parseInt(valor) < 100) {
      valor = valor.padStart(3, "0");
   }

   // Converte para float e formata com duas casas decimais
   valor = (parseInt(valor, 10) / 100).toFixed(2);

   // Verifica se o valor é um número válido
   if (isNaN(valor)) {
      // Se não for um número válido, limpa o campo ou define um valor padrão
      $elemento.val("");
      // $elemento.val('R$ 0,00'); // Descomente esta linha se preferir definir um valor padrão
      return; // Sai da função
   }

   // Separa parte inteira e decimal
   let partes = valor.split(".");
   let parteInteira = partes[0];
   let parteDecimal = partes[1];

   // Adiciona os pontos como separadores de milhar
   parteInteira = parteInteira.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

   // Junta a parte inteira e decimal com vírgula
   valor = parteInteira + "," + parteDecimal;

   // Adiciona o prefixo R$
   valor = valor;

   // Atualiza o valor do campo
   $elemento.val(valor);
}

// Aplica a formatação em todos os campos com a classe 'campo-moeda'
$(document).ready(function () {
   $(".campo-moeda").on("input", function () {
      formatarMoeda($(this));
   });
});

async function getAndDisplaySaldoDisponivel(centroCusto) {
   try {
      const datasetName = "ds_gtb_jdbc_016_saldo_disponivel";

      // Cria a constraint.
      const constraints = [
         {
            _field: "CTT_CUSTO",
            _initialValue: centroCusto,
            _finalValue: centroCusto,
            _type: 1,
            _likeSearch: false,
         },
      ];

      const fields = null; // Ou: ["CTT_CUSTO", "CTT_XQTDPE", "CTT_XQTDRE", "VAGAS_ATIVAS"]
      const sortFields = null;

      const dataset = await DatasetFactory.getDataset(datasetName, fields, constraints, sortFields);

      if (dataset && dataset.values && dataset.values.length > 0) {
         console.log("Dados do Dataset ds_gtb_jdbc_016_saldo_disponivel (filtrado):", dataset.values);

         // --- CÁLCULO DO SALDO ---
         const registro = dataset.values[0]; // Pega o primeiro (e provavelmente único) registro.

         // Converte os valores para números (IMPORTANTE!).  Usa parseFloat e trata casos onde o valor pode ser undefined ou null.
         const qtdPe = parseFloat(registro.CTT_XQTDPE) || 0;
         const qtdRe = parseFloat(registro.CTT_XQTDRE) || 0;
         const vagasAtivas = parseFloat(registro.VAGAS_ATIVAS) || 0;

         const saldoDisponivel = qtdPe - qtdRe - vagasAtivas;

         console.log("Saldo de vagas disponível:", saldoDisponivel);

         // --- GRAVAÇÃO NO CAMPO DO FORMULÁRIO ---

         // 1. Usando o método setvalue do FLUIG (Recomendado):
         $("#saldoVagasDisponivel").val(saldoDisponivel);
      } else {
         console.warn("O dataset ds_gtb_jdbc_016_saldo_disponivel retornou vazio (após o filtro).");
         if (dataset && dataset.values == null) {
            console.error("Dataset.values é nulo! Verifique o nome do dataset, constraints, etc.");
         }
      }
   } catch (error) {
      console.error("Erro ao obter o dataset ds_gtb_jdbc_016_saldo_disponivel:", error);
   }
}
