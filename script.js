$(document).ready(function () {
  /* Your custom JS code goes here */
  // Example dialog box
  $('#dialog-message').dialog({
    modal: true,
    buttons: {
      Ok: function () {
        $(this).dialog('close');
      },
    },
  });

  // Example slider
  $('#slider').slider({
    value: 50,
    slide: function (event, ui) {
      $('#slider-value').text(ui.value);
    },
  });

  $('#accordion').accordion({
    collapsible: true,
  });

  $('#datepicker').datepicker({
    showWeek: true,
    firstDay: 1,
  });
});
