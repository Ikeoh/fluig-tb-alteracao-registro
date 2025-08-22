let localImageBase64 = "";
let dataAtual = "";
let nomeFuncionario = "";
let cpfFuncionario = "";
let horarioTrabalho = "";
let cargoDestino = "";
let salarioDestino = "";
let horarioDestino = "";
let novoEndereco = "";
let dataPromocao = ""; // Keep this as a placeholder or get it from the form.

$(document).ready(function () {
   let state = getState();

   if (state == ABERTURA) {
      carregarImagemBase64("./resources/logo-tb-padrao.png", function (base64Img) {
         localImageBase64 = base64Img;
         console.log("Imagem carregada em Base64:", localImageBase64);
      });

      $("#btnGerarPDF").on("click", function () {
         dataAtual = getCurrentDate();
         nomeFuncionario = $("#nomeFuncionario").val();
         cpfFuncionario = $("#numeroCpf").val();
         horarioTrabalho = $("#horasSemanais").val();
         cargoDestino = $("#cargoDestino").val();
         salarioDestino = $("#salarioDestino").val();
         horarioDestino = $("#horarioDestino").val();
         novoEndereco = $("#enderecoDestino").val();
         dataPromocao = $("#dataEfetiva").val();

         // Exibir o modal de confirmação antes de gerar o PDF
         const modalConfirmacao = FLUIGC.modal(
            {
               title: "<span style='color: red; font-weight: bold;'>ATENÇÃO!</span>",
               content: "Esse mecanismo irá gerar um arquivo PDF com base nas informações preenchidas no formulário. Deseja continuar?",
               id: "modalConfirmacao",
               size: "full",
               actions: [
                  {
                     label: "Ok, gerar arquivo",
                     bind: "data-confirm-modal",
                     autoClose: false,
                     classType: "btn-success",
                  },
               ],
            },
            (data) => {
               $('[data-confirm-modal]').on("click", function () {
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

   // Create the content for each document
   const promotionLetterContent = cartaPromocaoFuncionario();
   const contractAmendmentContent = documentoAssinaturaFuncionario();

   // Combine the contents with a page break between them
   const combinedContent = [
      ...promotionLetterContent, // Spread operator to add the content of the promotion letter
      { text: "", pageBreak: "after" }, // Add a page break. Use empty text to add only the break.
      ...contractAmendmentContent, // Spread operator to add the content of the contract amendment
   ];

   // Define the complete PDF
   const pdfDefinition = {
      header: function (currentPage, pageCount, pageSize) {
         return [
            {
               columns: [
                  {
                     image: localImageBase64,
                     width: 80,
                     margin: [40, 30],
                  },
               ],
               width: "*",
            },
         ];
      },
      background: function (currentPage, pageSize) {
         const imageWidth = 500; // Largura da imagem
         const imageHeight = 500; // Altura da imagem (ajuste conforme necessário)
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
      content: combinedContent, // Use the combined content here
      styles: {
         documentHeader: { fontSize: 18, alignment: "center", bold: true, margin: [0, 120, 0, 15] },
         documentSubheader: { fontSize: 14, bold: true, margin: [0, 0, 0, 10] },
         documentParagraph: { fontSize: 12, alignment: "justify", margin: [0, 0, 0, 10] }, // New style
         listItemHeader: { bold: true, fontSize: 12, margin: [0, 0, 0, 5] },
         listItem: { fontSize: 12, margin: [10, 0, 0, 5] },
         letterHeader: { fontSize: 16, alignment: "justify", margin: [0, 120, 0, 15] },
         letterParagraph: { fontSize: 12, alignment: "justify", margin: [0, 0, 0, 10] },
         letterSignature: { fontSize: 12, alignment: "justify", margin: [0, 30, 0, 0] },
      },
   };

   pdfMake.createPdf(pdfDefinition).download("documentos_promocao_aditivo.pdf");
}

function cartaPromocaoFuncionario() {
   const promotionLetterContent = [
      {
         style: "letterHeader",
         text: `Prezado(a) ${nomeFuncionario}`,
      },
      {
         text: `É com grande satisfação que comunicamos a você sua promoção ao cargo de ${cargoDestino}, valido a partir de ${dataPromocao}.`,
         style: "letterParagraph",
      },
      {
         text: "Esta decisão reflete o reconhecimento de seu empenho, dedicação e excelência no desempenho de suas funções. Gostaríamos de aproveitar esta oportunidade para parabenizá-lo (a) e reforçar nosso compromisso em oferecer o suporte necessário para que você desempenhe suas novas funções com a mesma excelência de sempre.",
         style: "letterParagraph",
      },
      {
         text: "Agradecemos o impacto positivo que você gerou no Grupo TB. Reconhecemos que seu esforço vai além das expectativas e contribui diretamente para os nossos resultados.",
         style: "letterParagraph",
      },
      {
         text: "Espero que este reconhecimento sirva como incentivo para que continue trilhando o caminho de excelência que tem marcado sua trajetória profissional.",
         style: "letterParagraph",
      },
      {
         text: "Parabéns por suas conquistas e por ser uma peça indispensável em nossa equipe.",
         style: "letterParagraph",
      },
      { text: "Atenciosamente", style: "letterSignature" },
      { text: "Recursos Humanos", style: "letterSignature" },
   ];
   return promotionLetterContent;
}

function documentoAssinaturaFuncionario() {
   const contractAmendmentContent = [
      {
         style: "documentHeader",
         text: "TERMO ADITIVO DE CONTRATO DE TRABALHO",
      },
      {
         text: ["TB SERVIÇOS TRANSPORTE LIMPEZA GERENCIAMENTO E RECURSOS HUMANOS S/A, empresa com sede à Avenida Brigadeiro Faria Lima, 1912 – 15º andar, Jardim Paulistano, São Paulo/SP – CEP 01451-907, inscrita no CNPJ/MF 60.924.040/0001-51, doravante denominada EMPREGADOR (A) e de outro lado, ", { text: nomeFuncionario, bold: true }, ", portador (a) do CPF ", { text: cpfFuncionario, bold: true }, ", doravante denominado (a) EMPREGADO (A), têm como justo e acertado o presente termo aditivo ao contrato de trabalho:"],
         margin: [0, 0, 0, 20],
         style: "documentParagraph",
      },
      {
         text: "CLÁUSULA PRIMEIRA – As partes alteram o contrato de trabalho no que se ora convenciona abaixo:",
         style: "documentSubheader",
         margin: [0, 0, 0, 10],
      },
      {
         text: "O EMPREGADO, a partir desta data:",
         style: "listItemHeader",
         margin: [0, 0, 0, 5],
      },
      {
         ol: [
            {
               text: `O EMPREGADO cumprirá jornada de trabalho de ${horarioTrabalho} horas semanais, distribuídas de segunda-feira a sexta-feira, no horário compreendido entre ${horarioDestino}, nos termos do art. 71 da CLT.`,
               style: "listItem",
               margin: [10, 0, 0, 5],
            },
            {
               text: `O EMPREGADO passará a exercer as atribuições inerentes ao cargo de ${cargoDestino}, com remuneração mensal de R$ ${salarioDestino}`,
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
         text: "PARÁGRAFO PRIMEIRO – O contrato de trabalho fica ratificado em todos os seus termos, cláusulas e condições não expressamente alteradas por esse documento, que àquele se integra, formando um todo, único e indivisível para todos os efeitos legais.",
         margin: [0, 0, 0, 20],
         style: "documentParagraph",
      },
      {
         text: "E por estarem assim contratados, nos termos de seus respectivos interesses, assinam o presente instrumento, para as finalidades de direito.",
         margin: [0, 0, 0, 20],
         style: "documentParagraph",
      },
      {
         text: "\n\n______________________________________________________", // Signature line
         alignment: "center",
      },
      {
         text: nomeFuncionario,
         alignment: "center",
      },
      { text: "São Paulo, " + dataPromocao, margin: [0, 0, 0, 20], alignment: "center" },
   ];
   return contractAmendmentContent;
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