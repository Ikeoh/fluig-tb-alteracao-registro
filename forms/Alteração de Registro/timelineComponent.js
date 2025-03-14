function addObservationToTimeline() {
   const source = $("#source").val().trim();
   if (!source) return;

   const formattedSource = source.replace(/\n/g, "<br>"); // Substitui quebras de linha por <br>

   const currentDate = new Date().toLocaleString();
   const currentLogin = $("#currentLogin").val();
   const currentName = $("#currentName").val();

   const commentHTML = `
       <div class="panel panel-default fs-xs-margin-bottom">
           <div class="panel-body fs-sm-space media clearfix">
               <a class="pull-left" href="#">
                   <img src="/collaboration/api/v3/users/${currentLogin}/picture?type=SMALL_PICTURE" class="fluig-style-guide thumb-profile img-rounded thumb-profile-sm">
               </a>
               <div class="media-body">
                   <header>
                       <h5 class="media-heading">
                           <a href="#" class="link-default">${currentName}</a> comentou em
                           <span class="timeline-header-no-link">${currentDate}</span>
                       </h5>
                   </header>
                   <p>${formattedSource}</p> <!-- Comentário formatado -->
               </div>
           </div>
       </div>
   `;
   $("#timeline").append(commentHTML);
   wdkAddChild("commentsTable");
   setCommentToTableRow();
   $("#source").val("");
}

function setCommentToTableRow() {
   const commentDate = new Date().toLocaleString();
   const commentUser = $("#currentName").val();
   const commentLogin = $("#currentLogin").val();
   const commentText = $("#source").val().trim();

   const lastRowIndex = $("table[tablename='commentsTable'] tbody tr").length - 1;

   // Atribui os valores capturados aos campos correspondentes na tabela Pai-Filho
   $(`input[name='commentDate___${lastRowIndex}']`).val(commentDate);
   $(`input[name='commentUser___${lastRowIndex}']`).val(commentUser);
   $(`input[name='commentLogin___${lastRowIndex}']`).val(commentLogin);
   $(`input[name='commentText___${lastRowIndex}']`).val(commentText);
}

function loadTimelineFromTable() {
   $("#timeline").empty();

   $("table[tablename='commentsTable'] tbody tr").each(function (index) {
      const commentDate = $(this).find("input[name^='commentDate___']").val();
      const commentUser = $(this).find("input[name^='commentUser___']").val();
      const commentLogin = $(this).find("input[name^='commentLogin___']").val();
      const commentText = $(this).find("input[name^='commentText___']").val();

      if (commentDate && commentUser && commentText) {
         const formattedCommentText = commentText.replace(/\n/g, "<br>"); // Substitui quebras de linha por <br>

         const commentHTML = `
            <div class="panel panel-default fs-xs-margin-bottom">
                <div class="panel-body fs-sm-space media clearfix">
                    <a class="pull-left" href="#">
                        <img src="/collaboration/api/v3/users/${commentLogin}/picture?type=SMALL_PICTURE" class="fluig-style-guide thumb-profile img-rounded thumb-profile-sm">
                    </a>
                    <div class="media-body">
                        <header>
                            <h5 class="media-heading">
                                <a href="#" class="link-default">${commentUser}</a> comentou em
                                <span class="timeline-header-no-link">${commentDate}</span>
                            </h5>
                        </header>
                        <p>${formattedCommentText}</p> <!-- Comentário formatado -->
                    </div>
                </div>
            </div>
         `;
         $("#timeline").append(commentHTML);
      }
   });
}

$(document).ready(function () {
   loadTimelineFromTable();
});
