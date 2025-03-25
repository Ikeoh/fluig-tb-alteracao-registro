let localImageBase64 = "";
let dataAtual = "";
let nomeFuncionario = "";
let cpfFuncionario = ""; // Add CPF field
let horarioTrabalho = ""; // Add work hours field
let cargo = ""; // Add job title field
let salario = ""; // Add salary field
let novoEndereco = ""; // Add new address field

$(document).ready(function () {
   let state = getState();

   if (state == ABERTURA) {
      carregarImagemBase64("./resources/logo-tb-padrao.png", function (base64Img) {
         localImageBase64 = base64Img;
         console.log("Imagem carregada em Base64:", localImageBase64);
      });

      $("#btnGerarPDF").on("click", function () {
         dataAtual = getCurrentDate();
         nomeFuncionario = $("#matricula_016").val();
         cpfFuncionario = $("#cpf_016").val(); // Get CPF from form
         horarioTrabalho = $("#horarioTrabalho_016").val(); // Get work hours from form
         cargo = $("#cargo_016").val(); // Get job title from form
         salario = $("#salario_016").val(); // Get salary from form
         novoEndereco = $("#novoEndereco_016").val(); // Get new address from form

         // Exibir o modal de confirmação antes de gerar o PDF
         const modalConfirmacao = FLUIGC.modal(
            {
               title: "<span style='color: red; font-weight: bold;'>ATENÇÃO!</span>",
               content: "Esse mecanismo irá gerar um arquivo PDF com base nas informações preenchidas no formulário. Deseja continuar?",
               id: "modalConfirmacao", // ID para facilitar a manipulação
               size: "full",
               actions: [
                  {
                     label: "Ok, gerar arquivo",
                     bind: "data-confirm-modal",
                     autoClose: false, // Não fecha automaticamente
                     classType: "btn-success",
                  },
               ],
            },
            (data) => {
               $("[data-confirm-modal]").on("click", function () {
                  modalConfirmacao.remove();
                  gerarPDF();
               });
            }
         );
      });
   }
});

function gerarPDF() {
   if (localImageBase64 === "") {
      console.error("A imagem ainda não foi carregada.");
      return;
   }
   documentoAssinaturaFuncionario();
}

function documentoAssinaturaFuncionario() {
   let documento = {
      background: function (currentPage, pageSize) {
         const imageWidth = 500; // Largura da imagem
         const imageHeight = 500; // Altura da imagem (ajuste conforme necessário)

         // Cálculo para centralizar a imagem
         const xPosition = (pageSize.width - imageWidth) / 2;
         const yPosition = (pageSize.height - imageHeight) / 2;

         return {
            image: localImageBase64,
            width: imageWidth,
            height: imageHeight,
            opacity: 0.1,
            absolutePosition: { x: xPosition, y: yPosition },
         };
      },
      header: {
         columns: [
            {
               image: localImageBase64,
               width: 80,
               margin: [40, 30],
            },
         ],
         width: "*",
      },
      content: [
         {
            style: "header",
            margin: [0, 120, 0, 15],
            text: "TERMO ADITIVO DE CONTRATO DE TRABALHO",
         },
         {
            text: ["TB SERVIÇOS TRANSPORTE LIMPEZA GERENCIAMENTO E RECURSOS HUMANOS S/A, empresa com sede à Avenida Brigadeiro Faria Lima, 1912 – 15º andar, Jardim Paulistano, São Paulo/SP – CEP 01451-907, inscrita no CNPJ/MF 60.924.040/0001-51, doravante denominada EMPREGADOR (A) e de outro lado, ", { text: nomeFuncionario, bold: true }, ", portador (a) do CPF ", { text: cpfFuncionario, bold: true }, ", nacionalidade XXXXXXXXXX, doravante denominado (a) EMPREGADO (A), têm como justo e acertado o presente termo aditivo ao contrato de trabalho:"],
            margin: [0, 0, 0, 20],
         },
         {
            text: "CLÁUSULA PRIMEIRA – As partes alteram o contrato de trabalho no que se ora convenciona abaixo:",
            style: "subheader",
            margin: [0, 0, 0, 10],
         },
         {
            ol: [
               {
                  text: "O EMPREGADO, a partir desta data:",
                  style: "listItemHeader",
                  margin: [0, 0, 0, 5],
               },
               {
                  text: `O EMPREGADO cumprirá jornada de trabalho de ${horarioTrabalho} horas semanais, distribuídas de segunda-feira a sexta-feira, no horário compreendido entre XX:XX e XX:XX, com intervalo intrajornada de XX horas, nos termos do art. 71 da CLT.`,
                  style: "listItem",
                  margin: [10, 0, 0, 5],
               },
               {
                  text: `O EMPREGADO passará a exercer as atribuições inerentes ao cargo de ${cargo}, com remuneração mensal de R$ ${salario}`,
                  style: "listItem",
                  margin: [10, 0, 0, 5],
               },
               {
                  text: `O EMPREGADO passará a exercer suas atividades laborais no seguinte endereço ${novoEndereco}`,
                  style: "listItem",
                  margin: [10, 0, 0, 5],
               },
            ],
            margin: [0, 0, 0, 20],
         },
         {
            text: "PARAGRÁFO PRIMEIRO – O contrato de trabalho fica ratificado em todos os seus termos, cláusulas e condições não expressamente alteradas por esse documento, que àquele se integra, formando um todo, único e indivisível para todos os efeitos legais.",
            margin: [0, 0, 0, 20],
         },
         {
            text: "E por estarem assim contratados, nos termos de seus respectivos interesses, assinam o presente instrumento, para as finalidades de direito.",
            margin: [0, 0, 0, 20],
         },
         { text: "São Paulo, " + dataAtual, margin: [0, 0, 0, 20] },
         // ... (Existing content remains the same) ...
      ],
      styles: {
         header: { fontSize: 18, alignment: "center", bold: true },
         subheader: { fontSize: 14, bold: true, margin: [0, 0, 0, 10] },
         tableHeader: { bold: true, fontSize: 12 },
         tableItem: { fontSize: 12 },
         tableValue: { fontSize: 12, italics: true },
         footer: { opacity: 0.5 },
         listItemHeader: { bold: true, fontSize: 12, margin: [0, 0, 0, 5] },
         listItem: { fontSize: 12, margin: [10, 0, 0, 5] },
      },
   };
   pdfMake.createPdf(documento).download("termo_aditivo_contrato.pdf");
}

// Função para carregar a imagem em base64
function carregarImagemBase64(url, callback) {
   let xhr = new XMLHttpRequest();
   xhr.onload = function () {
      let reader = new FileReader();
      reader.onloadend = function () {
         callback(reader.result); // Retorna a imagem em Base64
      };
      reader.readAsDataURL(xhr.response); // Lê o blob como data URL (Base64)
   };
   xhr.open("GET", url);
   xhr.responseType = "blob"; // Carrega a imagem como um blob
   xhr.send();
}

/*
let localImageBase64 = "";
let dataAtual = "";
let nomeFuncionario = "";
let filialAtual = "";
let filialDestino = "";
let centroCustoAtual = "";
let centroCustoDestino = "";
let cargoAtual = "";
let cargoDestino = "";
let salarioAtual = "";
let salarioDestino = "";
let horarioAtual = "";
let horarioDestino = "";
let tipoContrato = "";

$(document).ready(function () {
   let state = getState();

   if (state == ABERTURA) {
      carregarImagemBase64("./resources/logo-tb-padrao.png", function (base64Img) {
         localImageBase64 = base64Img; // Armazena a imagem em Base64
         console.log("Imagem carregada em Base64:", localImageBase64);
      });

      // Event listener para o botão de gerar PDF
      $("#btnGerarPDF").on("click", function () {
         dataAtual = getCurrentDate();
         // Recuperar os valores dos campos
         nomeFuncionario = $("#matricula_016").val();
         filialAtual = $("#filial_016").val();
         filialDestino = $("#filialDestino_016").val();
         centroCustoAtual = $("#centroCusto_016").val();
         centroCustoDestino = $("#centroCustoDestino_016").val();
         cargoAtual = $("#cargo_016").val();
         cargoDestino = $("#cargoDestino_016").val();
         salarioAtual = $("#salarioAtual_016").val();
         salarioDestino = $("#salarioDestino_016").val();
         horarioAtual = $("#codHorario_016").val();
         horarioDestino = $("#codHorarioDestino_016").val();
         tipoContrato = $("#tipoContrato_016").val();

         // Exibir o modal de confirmação antes de gerar o PDF
         const modalConfirmacao = FLUIGC.modal(
            {
               title: "<span style='color: red; font-weight: bold;'>ATENÇÃO!</span>",
               content: "Esse mecanismo irá gerar um arquivo PDF com base nas informações preenchidas no formulário. Deseja continuar?",
               id: "modalConfirmacao", // ID para facilitar a manipulação
               size: "full",
               actions: [
                  {
                     label: "Ok, gerar arquivo",
                     bind: "data-confirm-modal",
                     autoClose: false, // Não fecha automaticamente
                     classType: "btn-success",
                  },
               ],
            },
            (data) => {
               $("[data-confirm-modal]").on("click", function () {
                  modalConfirmacao.remove();
                  gerarPDF();
               });
            }
         );
      });
   }
});

function gerarPDF() {
   // Verifica se a imagem foi carregada corretamente
   if (localImageBase64 === "") {
      console.error("A imagem ainda não foi carregada.");
      return;
   }
   documentoAssinaturaFuncionario();
}

function documentoAssinaturaFuncionario() {
   let documento = {
      background: function (currentPage, pageSize) {
         const imageWidth = 500; // Largura da imagem
         const imageHeight = 500; // Altura da imagem (ajuste conforme necessário)

         // Cálculo para centralizar a imagem
         const xPosition = (pageSize.width - imageWidth) / 2;
         const yPosition = (pageSize.height - imageHeight) / 2;

         return {
            image: localImageBase64,
            width: imageWidth,
            height: imageHeight,
            opacity: 0.1,
            absolutePosition: { x: xPosition, y: yPosition },
         };
      },
      header: {
         columns: [
            {
               image: localImageBase64,
               width: 80,
               margin: [40, 30],
            },
         ],
         width: "*",
      },
      content: [
         {
            style: "header",
            margin: [0, 120, 0, 15],
            text: "ALTERAÇÃO DE REGISTRO",
         },
         "Sr(a) " + nomeFuncionario + "\n\n",
         {
            text: ["Pelo presente o(a) notificamos que a partir desta data, não serão utilizados os seus serviços pela nossa Empresa, e por isso, vimos avisá-lo nos termos e para efeito do disposto no Artigo 487, item II Cap. VI do Decreto lei nº 5.452, de 1º de maio de 1943 da CLT (Consolidação das Leis do Trabalho), ficando dispensado de cumprir ", { text: "Aviso Prévio", bold: true }, " que será ", { text: "indenizado", bold: true }, ".\n\n"],
         },
         "Aproveitamos a oportunidade para agradecer a colaboração dedicada à empresa no período trabalhado e serviços prestados.\n\n\n",
         "São Paulo, " + dataAtual + "\n\n\n\n",
         {
            alignment: "center",
            columns: [
               { text: "TEL:(____)-__________________________________", margin: [0, 0, 0, 5] },
               { text: "_____________________________________________", margin: [0, 0, 0, 5] },
            ],
            columnGap: 30,
         },
         {
            alignment: "center",
            columns: [
               { text: "E-MAIL:_____________________________________", margin: [0, 0, 0, 5] },
               { text: "fulaninho1", margin: [0, 0, 0, 5] },
            ],
            columnGap: 30,
         },
         {
            alignment: "center",
            columns: [
               { text: "", margin: [0, 0, 0, 40] },
               { text: "RE: " + "12345", margin: [0, 0, 0, 40] },
            ],
            columnGap: 30,
         },
         {
            alignment: "center",
            columns: [{ text: "_____________________________________________", margin: [0, 0, 0, 5] }],
            columnGap: 30,
         },
         {
            alignment: "center",
            columns: [{ text: "EMPREGADOR", margin: [0, 0, 0, 5] }],
            columnGap: 30,
         },
         {
            alignment: "center",
            columns: [{ text: "CPF: _______._______._______-_____", margin: [0, 0, 0, 40] }],
            columnGap: 30,
         },
      ],
      footer: [
         {
            style: "footer",
            alignment: "center",
            text: "_____________________________________________________________________________________________",
         },
         {
            alignment: "center",
            text: "TB SERVICOS, TRANSPORTE, LIMPEZA, GERENCIAMENTO E RECURSOS HUMANOS S.A.",
         },
      ],
      styles: {
         header: { fontSize: 18, alignment: "left", bold: true },
         footer: { opacity: 0.5 },
      },
   };
   pdfMake.createPdf(documento).download("alteracao_registro_.pdf");
}

// Função para carregar a imagem em base64
function carregarImagemBase64(url, callback) {
   let xhr = new XMLHttpRequest();
   xhr.onload = function () {
      let reader = new FileReader();
      reader.onloadend = function () {
         callback(reader.result); // Retorna a imagem em Base64
      };
      reader.readAsDataURL(xhr.response); // Lê o blob como data URL (Base64)
   };
   xhr.open("GET", url);
   xhr.responseType = "blob"; // Carrega a imagem como um blob
   xhr.send();
}
*/
