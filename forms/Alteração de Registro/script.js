$(document).ready(function () {
   $("#requesterAvatar").attr("src", "/social/api/rest/social/image/profile/" + $("#requesterCode").val() + "/SMALL_PICTURE");

   adjustHeaderLayout(); // Executa no carregamento
   $(window).resize(adjustHeaderLayout); // Executa no redimensionamento

   let state = getState();

   if (state == ABERTURA) {
      const select = $("#dataEfetiva_016");
      const today = new Date();
      for (let i = 0; i < 6; i++) {
         const targetDate = new Date(today.getFullYear(), today.getMonth() + i, 1);
         const day = String(targetDate.getDate()).padStart(2, "0");
         const month = String(targetDate.getMonth() + 1).padStart(2, "0");
         const year = targetDate.getFullYear();
         const formattedDate = `${day}/${month}/${year}`;
         select.append(new Option(formattedDate, formattedDate));
      }

      setTimeout(function () {
         window["nomeFuncionario_016"].disable(true);
         window["filialDestino_016"].disable(true);
         window["centroCustoDestino_016"].disable(true);
         window["cargoDestino_016"].disable(true);
         window["codHorarioDestino_016"].disable(true);
         window["tipoContratoDestino_016"].disable(true);
         window["departamentoDestino_016"].disable(true);
         window["regraDestino_016"].disable(true);
         $("#salarioAtual_016").prop("disabled", true);
         $("#salarioDestino_016").prop("disabled", true);
      }, 300);
   }
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
   const activities = ["GestorAtual", "GestorDestino", "PlanejContrOrc", "Diretor", "DiretorGrl", "ValidacaoRh", "VerificaRh"];

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
      reloadZoomFilterValues("nomeFuncionario_016", "RA_FILIAL," + selectedItem["M0_CODFIL"]);
      window["nomeFuncionario_016"].disable(false);
   }

   if (selectedItem.inputId == "filialDestino_016") {
      reloadZoomFilterValues("cargoDestino_016", "RJ_FILIAL," + selectedItem["M0_CODFIL_3DIG"]);
      reloadZoomFilterValues("codHorarioDestino_016", "R6_FILIAL," + selectedItem["M0_CODFIL_3DIG"]);
      reloadZoomFilterValues("tipoContratoDestino_016", "RCC_FILIAL," + selectedItem["M0_CODFIL_3DIG"]);
      reloadZoomFilterValues("departamentoDestino_016", "QB_FILIAL," + selectedItem["M0_CODFIL_3DIG"]);
      reloadZoomFilterValues("regraDestino_016", "PA_FILIAL," + selectedItem["M0_CODFIL_3DIG"]);
      window["centroCustoDestino_016"].disable(false);
      window["cargoDestino_016"].disable(false);
      window["codHorarioDestino_016"].disable(false);
      window["tipoContratoDestino_016"].disable(false);
      window["departamentoDestino_016"].disable(false);
   }

   if (selectedItem.inputId == "centroCustoDestino_016") {
      const centroCusto = selectedItem["CTT_CUSTO"];
      getAndDisplaySaldoDisponivel(centroCusto);
      updateResponsibleDir();

      buscarCentroDeCusto(centroCusto, "XRES", "apvGestorDestino");
      buscarCentroDeCusto(centroCusto, "XDIRET", "apvDiretor");
      $("#enderecoDestino").val(selectedItem.CTT_ENDER);
   }

   if (selectedItem.inputId == "nomeFuncionario_016") {
      $("#numeroMatricula_016").val(selectedItem.RA_MAT);
      $("#filialAtual_016").val(selectedItem.RA_FILIAL);
      $("#centroCustoAtual_016").val(selectedItem.RA_CC);
      $("#codCargoAtual_016").val(selectedItem.RA_CARGO);
      $("#cargoAtual_016").val(selectedItem.RJ_DESC);
      //$("#salarioAtual_016").val("");
      $("#codHorarioAtual_016").val(selectedItem.RA_TNOTRAB);
      $("#horarioAtual_016").val(selectedItem.R6_DESC);
      $("#tipoContratoAtual_016").val(selectedItem.RCC_DESC);
      $("#codDepartamentoAtual_016").val(selectedItem.RA_DEPTO);
      getDepartamentoDescricao(selectedItem.RA_DEPTO, selectedItem.RA_FILIAL);
      window["filialDestino_016"].disable(false);
      $("#salarioAtual_016").prop("disabled", false);
      $("#salarioDestino_016").prop("disabled", false);

      buscarCentroDeCusto($("#centroCustoAtual_016").val(), "XRES", "apvGestorAtual");

      $("#numeroCpf").val(selectedItem.RA_CIC);
      $("#horasSemanais").val(selectedItem.RA_HRSEMAN);
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

   if (selectedItem.inputId == "departamentoDestino_016") {
      //
   }

   if (selectedItem.inputId == "regraDestino_016") {
      $("#codRegraDestino_016").val(selectedItem.PA_CODIGO);
   }
}

function removedZoomItem(removedItem) {
   if (removedItem.inputId == "filial_016") {
      $("#numeroFilial_016").val("");

      window["nomeFuncionario_016"].clear();
      window["nomeFuncionario_016"].disable(true);

      // Limpa os campos de "Dados Atuais"
      $("#filialAtual_016").val("");
      $("#centroCustoAtual_016").val("");
      $("#codCargoAtual_016").val("");
      $("#cargoAtual_016").val("");
      $("#salarioAtual_016").val("");
      $("#codHorarioAtual_016").val("");
      $("#horarioAtual_016").val("");
      $("#tipoContratoAtual_016").val("");
      $("#departamentoAtual_016").val("");
      $("#codDepartamentoAtual_016").val("");

      // Limpa também os campos de "Dados Após Alteração" que são resetados em nomeFuncionario_016
      window["filialDestino_016"].clear();
      window["filialDestino_016"].disable(true);
      window["centroCustoDestino_016"].clear();
      window["centroCustoDestino_016"].disable(true);
      $("#codCargoDestino_016").val("");
      window["cargoDestino_016"].clear();
      window["cargoDestino_016"].disable(true);
      $("#salarioDestino_016").val("");
      $("#salarioDestino_016").prop("disabled", true);
      window["codHorarioDestino_016"].clear();
      window["codHorarioDestino_016"].disable(true);
      $("#horarioDestino_016").val("");
      $("#codTipoContratoDestino_016").val("");
      window["tipoContratoDestino_016"].clear();
      window["tipoContratoDestino_016"].disable(true);
      $("#apvGestorAtual").val("");
   }

   if (removedItem.inputId == "nomeFuncionario_016") {
      //OUTROS
      $("#numeroMatricula_016").val("");
      $("#numeroCpf").val("");
      $("#horasSemanais").val("");

      //ATUAIS
      $("#filialAtual_016").val("");
      $("#centroCustoAtual_016").val("");
      $("#codCargoAtual_016").val("");
      $("#cargoAtual_016").val("");
      $("#salarioAtual_016").val("");
      $("#salarioAtual_016").prop("disabled", true);
      $("#codHorarioAtual_016").val("");
      $("#horarioAtual_016").val("");
      $("#tipoContratoAtual_016").val("");
      $("#departamentoAtual_016").val("");
      $("#codDepartamentoAtual_016").val("");

      //ALTERADOS
      window["filialDestino_016"].clear();
      window["filialDestino_016"].disable(true);
      window["centroCustoDestino_016"].clear();
      window["centroCustoDestino_016"].disable(true);
      $("#codCargoDestino_016").val("");
      window["cargoDestino_016"].clear();
      window["cargoDestino_016"].disable(true);
      $("#salarioDestino_016").val("");
      $("#salarioDestino_016").prop("disabled", true);
      window["codHorarioDestino_016"].clear();
      window["codHorarioDestino_016"].disable(true);
      $("#horarioDestino_016").val("");
      $("#codTipoContratoDestino_016").val("");
      window["tipoContratoDestino_016"].clear();
      window["tipoContratoDestino_016"].disable(true);
      $("#apvGestorAtual").val("");
   }

   if (removedItem.inputId == "filialDestino_016") {
      window["centroCustoDestino_016"].clear();
      window["centroCustoDestino_016"].disable(true);
      $("#codCargoDestino_016").val("");
      window["cargoDestino_016"].clear();
      window["cargoDestino_016"].disable(true);
      $("#salarioDestino_016").val("");
      window["codHorarioDestino_016"].clear();
      window["codHorarioDestino_016"].disable(true);
      $("#horarioDestino_016").val("");
      $("#codTipoContratoDestino_016").val("");
      window["tipoContratoDestino_016"].clear();
      window["tipoContratoDestino_016"].disable(true);
      window["departamentoDestino_016"].clear();
      window["departamentoDestino_016"].disable(true);
      window["regraDestino_016"].clear();
      window["regraDestino_016"].disable(true);
   }

   if (removedItem.inputId == "centroCustoDestino_016") {
      $("#saldoVagasDisponivel").val("");
      $("#apvGestorDestino").val("");
      $("#apvDiretor").val("");
      $("#enderecoDestino").val("");
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

   if (removedItem.inputId == "departamentoDestino_016") {
      //
   }

   if (removedItem.inputId == "regraDestino_016") {
      $("#codRegraDestino_016").val("");
   }
}

function getDepartamentoDescricao(codDepartamento, codFilial) {
   if (!codDepartamento || !codFilial) {
      return;
   }

   var filial3dig = codFilial.substring(0, 3);
   var constraints = [DatasetFactory.createConstraint("QB_DEPTO", codDepartamento, codDepartamento, ConstraintType.MUST), DatasetFactory.createConstraint("QB_FILIAL", filial3dig, filial3dig, ConstraintType.MUST)];

   DatasetFactory.getDataset("ds_gtb_jdbc_016_departamentos", null, constraints, null, {
      success: function (dataset) {
         if (dataset && dataset.values && dataset.values.length > 0) {
            $("#departamentoAtual_016").val(dataset.values[0]["QB_DESCRIC"]);
         }
      },
      error: function (error) {
         console.error("Erro ao buscar o dataset de departamentos:", error);
      },
   });
}

/**
 * Formata um campo de entrada como moeda (formato brasileiro, com separadores de milhar e vírgula para decimais).
 * Esta função faz a formatação manualmente, sem usar toLocaleString.
 *
 * @param {JQuery} $elemento - O elemento jQuery do campo de entrada a ser formatado.
 */
function formatarMoeda($elemento) {
   // Verifica se $elemento é um objeto jQuery válido e se contém pelo menos um elemento.
   if (!$elemento || $elemento.length === 0) {
      console.error("Erro: $elemento inválido ou vazio.", $elemento);
      return; // Sai da função se o elemento for inválido.
   }

   // 1. Pega o valor atual do campo.
   var valor = $elemento.val();

   // 2. Remove tudo o que não é dígito ou vírgula.
   valor = valor.replace(/[^\d,]/g, "");

   // 3. Substitui a primeira vírgula por ponto e remove todos os outros pontos.
   //    Isso garante que haja apenas um ponto decimal e que ele esteja no lugar certo.
   valor = valor.replace(",", ".").replace(/\./g, "");

   // 4. Adiciona zeros à esquerda se o valor for menor que 100 (centavos).
   //    Isso garante que valores como "1", "12" sejam tratados como "001", "012".
   if (valor && parseInt(valor) < 100) {
      valor = valor.padStart(3, "0"); // Adiciona zeros à esquerda até ter 3 dígitos.
   }

   // 5. Converte para float e formata com duas casas decimais.
   //    Divide por 100 para tratar o valor como centavos.
   valor = (parseInt(valor, 10) / 100).toFixed(2);

   // 6. Verifica se o valor é um número válido (após a conversão).
   if (isNaN(valor)) {
      // Se não for um número válido, limpa o campo.
      $elemento.val("");
      // $elemento.val('R$ 0,00'); // Opção: definir um valor padrão.
      return; // Sai da função.
   }

   // 7. Separa a parte inteira e a parte decimal.
   let partes = valor.split(".");
   let parteInteira = partes[0];
   let parteDecimal = partes[1];

   // 8. Adiciona os pontos como separadores de milhar à parte inteira.
   //    Usa uma expressão regular para inserir pontos a cada 3 dígitos, da direita para a esquerda.
   parteInteira = parteInteira.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

   // 9. Junta a parte inteira e decimal com vírgula.
   valor = parteInteira + "," + parteDecimal;

   // 10. Adiciona o prefixo R$ (opcional, neste caso não estamos usando).
   //valor = "R$ " + valor;  //Removido o prefixo.

   // 11. Atualiza o valor do campo com o valor formatado.
   $elemento.val(valor);
}

// Aplica a formatação em todos os campos com a classe 'campo-moeda'
$(document).ready(function () {
   // Usando 'keyup' em vez de 'input' para evitar problemas com alguns navegadores/dispositivos.
   // 'keyup' é disparado *após* a tecla ser liberada, o que geralmente é mais confiável.
   $(".campo-moeda").on("keyup", function (event) {
      //Verifica se o campo existe
      if ($(this).length > 0) {
         formatarMoeda($(this));
      } else {
         console.warn("Campo não encontrado:", this);
      }
   });
   // Dispara a formatação quando o campo perde o foco (blur). Isso garante que a formatação
   // seja aplicada mesmo se o usuário não digitar nada e apenas colar um valor ou sair do campo.
   $(".campo-moeda").on("blur", function () {
      if ($(this).length > 0) {
         //verifica se o campo existe
         formatarMoeda($(this));
      } else {
         console.warn("Campo não encontrado:", this);
      }
   });
});

/**
 * Aplica o componente de calendário do Fluig (FLUIGC.calendar) a um conjunto de elementos.
 *
 * @param {Array<string>} ids - Um array contendo os IDs dos elementos HTML que receberão o calendário.
 */
function applyCalendar(ids) {
   // Itera sobre cada ID no array.
   ids.forEach(function (id) {
      // Aplica o calendário ao elemento com o ID correspondente.
      FLUIGC.calendar("#" + id);
   });
}

// Executa a função quando o documento estiver pronto.
$(document).ready(function () {
   // Chama a função applyCalendar com um array de IDs.
   applyCalendar([]);
});

/**
 * Obtém e exibe o saldo de vagas disponível para um determinado centro de custo.
 *
 * 1. Define o nome do dataset e a constraint para buscar os dados.
 * 2. Faz uma chamada assíncrona ao dataset 'ds_gtb_jdbc_016_saldo_disponivel' do Fluig.
 * 3. Se o dataset retornar dados:
 *    - Exibe os dados brutos do dataset no console (para depuração).
 *    - Extrai os valores de 'CTT_XQTDPE', 'CTT_XQTDRE' e 'VAGAS_ATIVAS' do primeiro registro.
 *    - Converte os valores extraídos para números, tratando casos onde eles podem ser nulos/indefinidos/vazios.
 *    - Calcula o saldo disponível:  saldo = CTT_XQTDPE - CTT_XQTDRE - VAGAS_ATIVAS.
 *    - Exibe o saldo calculado no console.
 *    - Grava o saldo disponível no campo do formulário 'saldoVagasDisponivel' usando jQuery.
 * 4. Se o dataset não retornar dados, exibe um aviso no console.
 * 5. Se ocorrer um erro ao obter o dataset, exibe um erro no console.
 *
 * @param {string} centroCusto - O código do centro de custo para o qual o saldo será calculado.
 * @returns {Promise<void>} - Uma Promise que resolve quando a operação é concluída (não retorna um valor diretamente).
 */
async function getAndDisplaySaldoDisponivel(centroCusto) {
   try {
      const datasetName = "ds_gtb_jdbc_016_saldo_disponivel";

      // Cria a constraint para filtrar o dataset pelo código do centro de custo.
      const constraints = [
         {
            _field: "CTT_CUSTO", // Nome do campo no dataset.
            _initialValue: centroCusto, // Valor inicial do intervalo (o próprio código).
            _finalValue: centroCusto, // Valor final do intervalo (o próprio código).
            _type: 1, // Tipo da constraint (1 = MUST - obrigatório).
            _likeSearch: false, // Define se a busca deve usar LIKE (false = igualdade exata).
         },
      ];

      // Define os campos a serem retornados (null para todos os campos) e a ordenação (null para nenhuma).
      const fields = null;
      const sortFields = null;

      // Faz a chamada assíncrona ao dataset usando async/await.
      const dataset = await DatasetFactory.getDataset(datasetName, fields, constraints, sortFields);

      // Verifica se o dataset retornou dados e se o array 'values' não está vazio.
      if (dataset && dataset.values && dataset.values.length > 0) {
         console.log("Dados do Dataset ds_gtb_jdbc_016_saldo_disponivel (filtrado):", dataset.values);

         // --- CÁLCULO DO SALDO ---
         const registro = dataset.values[0]; // Pega o primeiro registro (deve ser único, dada a constraint).

         // Converte os valores para números, usando parseFloat e o operador OR (||) para tratar valores nulos/indefinidos.
         // Se parseFloat retornar NaN (Not a Number), o operador || 0 garante que o valor seja 0.
         const qtdPe = parseFloat(registro.CTT_XQTDPE) || 0;
         const qtdRe = parseFloat(registro.CTT_XQTDRE) || 0;
         const vagasAtivas = parseFloat(registro.VAGAS_ATIVAS) || 0;

         // Calcula o saldo disponível.
         const saldoDisponivel = qtdPe - qtdRe - vagasAtivas;

         console.log("Saldo de vagas disponível:", saldoDisponivel);

         // --- GRAVAÇÃO NO CAMPO DO FORMULÁRIO ---
         $("#saldoVagasDisponivel").val(saldoDisponivel); // Usa jQuery para definir o valor do campo.
      } else {
         // Avisa no console se o dataset não retornar dados.
         console.warn("O dataset ds_gtb_jdbc_016_saldo_disponivel retornou vazio (após o filtro).");
         //Verifica se o dataset e os values existem antes de tentar verificar o length;
         if (dataset && dataset.values == null) {
            console.error("Dataset.values é nulo! Verifique o nome do dataset, constraints, etc.");
         }
      }
   } catch (error) {
      // Captura e exibe erros no console, caso ocorram durante a chamada ou processamento do dataset.
      console.error("Erro ao obter o dataset ds_gtb_jdbc_016_saldo_disponivel:", error);
   }
}

/**
 * Atualiza o campo 'dirResponsavel' com base no prefixo do centro de custo de destino.
 *
 * - Obtém o código do centro de custo do campo 'centroCustoDestino_016'.
 * - Se o código do centro de custo for inválido (menor que 2 caracteres), exibe um toast de erro e retorna.
 * - Extrai o prefixo (os dois primeiros dígitos) do código do centro de custo.
 * - Define o valor do campo 'dirResponsavel' com base no prefixo:
 *   - Se o prefixo for '01' ou '99', define como 'DIRGERAL'.
 *   - Caso contrário, define como 'DIRADM'.
 * - Imprime o prefixo e o valor final de 'dirResponsavel' no console para fins de depuração.
 */
function updateResponsibleDir() {
   // Obtém o valor do campo, garantindo que seja uma string.
   let costCenterCode = String($("#centroCustoDestino_016").val());

   // Remove espaços em branco no início e no fim da string.
   costCenterCode = costCenterCode.trim();

   // Verifica se o código do centro de custo tem pelo menos 2 caracteres.
   if (costCenterCode.length < 2) {
      // Exibe um toast de erro se o código for inválido.
      FLUIGC.toast({
         title: "Atenção:",
         message: "Ocorreu um erro ao tentar capturar o prefixo do código de centro de custo.  Entre em contato com a equipe de TI responsável pelo Fluig!",
         type: "danger",
      });
      return; // Sai da função se o código for inválido.
   }

   // Extrai os dois primeiros caracteres (prefixo) do código do centro de custo.
   const prefix = costCenterCode.substring(0, 2);
   console.log("prefix:", prefix); // Imprime o prefixo no console.

   // Define o valor do campo 'dirResponsavel' usando um operador ternário.
   const responsibleDir = prefix === "01" || prefix === "99" ? "DIRGERAL" : "DIRADM";
   $("#dirResponsavel").val(responsibleDir); // Atribui o valor ao campo.

   console.log("Diretor Responsável:", $("#dirResponsavel").val()); // Imprime o valor final do campo.
}

/**
 * Função para buscar informações de um centro de custo no Fluig e atribuir um responsável aprovador a um campo de controle.
 *
 * @param {string} codigoCentroCusto - O código do centro de custo.
 * @param {string} tipoResponsavel  - 'XRES' (responsável) ou 'XDIRET' (diretor).
 * @param {string} campoId          - O ID do campo que receberá o valor.
 * @returns {void} - Atualiza o campo e imprime no console.
 */
function buscarCentroDeCusto(codigoCentroCusto, tipoResponsavel, campoId) {
   // Validações dos parâmetros de entrada. Essencial para evitar erros.
   if (!codigoCentroCusto) {
      console.error("Erro: Código do centro de custo não fornecido.");
      return;
   }
   if (!tipoResponsavel || (tipoResponsavel !== "XRES" && tipoResponsavel !== "XDIRET")) {
      console.error("Erro: 'tipoResponsavel' inválido. Use 'XRES' ou 'XDIRET'.");
      return;
   }
   if (!campoId) {
      console.error("Erro: ID do campo não fornecido.");
      return;
   }

   // Cria um array de constraints para filtrar o dataset.
   // Neste caso, filtramos pelo campo 'CTT_CUSTO' com o código fornecido.
   const constraints = [DatasetFactory.createConstraint("CTT_CUSTO", codigoCentroCusto, codigoCentroCusto, ConstraintType.MUST)];

   // Chama o dataset do Fluig de forma assíncrona.
   DatasetFactory.getDataset("ds_gtb_jdbc_centro_de_custo", null, constraints, null, {
      // Função executada em caso de sucesso na chamada do dataset.
      success: function (dataset) {
         const resultado = dataset; // Armazena o resultado do dataset.

         // Verifica se o dataset retornou algum registro.
         if (resultado && resultado.values && resultado.values.length > 0) {
            const centroCusto = resultado.values[0]; // Obtém o primeiro registro (se houver).

            // Define qual campo do dataset será usado (XRES_LOGIN ou XDIRET_LOGIN)
            // com base no parâmetro 'tipoResponsavel'.
            let campoLogin;
            if (tipoResponsavel === "XRES") {
               campoLogin = "XRES_LOGIN";
            } else {
               campoLogin = "XDIRET_LOGIN";
            }

            // Verifica se o campo selecionado (XRES_LOGIN ou XDIRET_LOGIN)
            // existe no objeto retornado pelo dataset.
            if (centroCusto.hasOwnProperty(campoLogin)) {
               const valorLogin = centroCusto[campoLogin]; // Obtém o valor do campo.

               // Usa jQuery para definir o valor do campo do formulário.
               $("#" + campoId).val(valorLogin);

               // Mensagem de sucesso no console.
               console.log(`Valor de ${campoLogin} (${valorLogin}) atribuído ao campo ${campoId}.`);
            } else {
               // Mensagem de aviso se o campo não for encontrado.
               console.warn(`O campo ${campoLogin} não foi encontrado.`);
            }

            // Log completo do resultado do dataset (útil para depuração).
            console.log("Resultado completo da busca:", centroCusto);
         } else {
            // Mensagem de aviso se nenhum centro de custo for encontrado.
            console.warn("Nenhum centro de custo encontrado com o código:", codigoCentroCusto);
         }
      },
      // Função executada em caso de erro na chamada do dataset.
      error: function (error) {
         console.error("Erro ao buscar o dataset ds_gtb_jdbc_centro_de_custo:", error);
      },
   });
}
