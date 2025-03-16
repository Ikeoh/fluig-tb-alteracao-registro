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
