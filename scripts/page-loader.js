/*This function is for a pageshow event to call showUserForm if the User Info page is active or calls loadUserInformation if the records page is active. */
$(document).on("pageshow", function () {
  const activePageId = $(".ui-page-active").attr("id");
  if (activePageId == "page-user-info") {
    showUserForm();
  } else if (activePageId == "page-records") {
    loadUserInformation();
    listRecords();
  } else if (activePageId == "page-advice") {
    showAdvice();
    resizeGraph();
  } else if (activePageId == "page-graph") {
    showGraph();
    resizeGraph();
  }
});

/*This function is used to resize the graph to fit in the window on smaller devices */
function resizeGraph() {
  if ($(window).width() < 700) {
    $("#canvas-advice").css({ width: $(window).width() - 75 });
    $("#canvas-graph").css({ width: $(window).width() - 75 });
  }
}
