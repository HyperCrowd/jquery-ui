const xApiKey = 'test';

/**
 *
 */
const endpoints = {
  loggedInOperator: 'logged_in/operator',
  listUids: 'list/uids',
  listUpload: 'list/uploads',
};

/**
 *
 */
async function call(endpoint, params = {}, method = 'GET') {
  let paramString = '';
  const parts = [];

  if (method === 'GET') {
    for (const key of Object.keys(params)) {
      parts.push(`${key}=${encodeURIComponent(params[key])}`);
    }

    if (parts.length > 0) {
      paramString = '?' + parts.join('&');
    }
  }

  const url = `https://androidmonitor.internetwatchdogs.org/v1/${endpoint}${paramString}`;

  const command = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'x-api-key': xApiKey,
      'x-api-admin-key': xApiKey,
    },
  };

  if (method === 'POST') {
    command.body = JSON.stringify(params);
  }

  const response = await fetch(url, command);

  return response.json();
}

$(document).ready(async function () {
  const loggedIn = await call(endpoints.loggedInOperator);
  const lists = await call(endpoints.listUids, {}, 'POST');
  const uploads = await call(
    endpoints.listUpload,
    {
      uid: 681210907,
    },
    'POST'
  );

  // Test
  console.log(
    JSON.stringify({
      loggedIn,
      lists,
      uploads,
    })
  );

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
