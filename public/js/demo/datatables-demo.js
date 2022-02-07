// Call the dataTables jQuery plugin
$(document).ready(function () {
  $('#dataTable').DataTable({
    "bInfo": false, // hide showing entries
    "ordering": false,
    "lengthChange": false
  })
});
