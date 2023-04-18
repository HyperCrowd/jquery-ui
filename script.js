const HOSTURL =
  'https://androidmonitor.internetwatchdogs.org' ||
  window.location.protocol + '//' + window.location.host;
const xApiKey = 'test';

/**
 *
 */
const endpoints = {
  loggedInOperator: 'v1/logged_in/operator',
  listUids: 'v1/list/uids',
  listUpload: 'v1/list/uploads',
};

async function post(endpoint, params = {}) {
  return call(endpoint, params, 'POST');
}

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

  const url = `${HOSTURL}/${endpoint}${paramString}`;

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
  const app = $('#app');
  const accordion = $('#accordion');
  const username = $('#username');
  const password = $('#password');
  const listUsers = $('#listUsers');

  // const loggedIn = await call(endpoints.loggedInOperator);
  const lists = await post(endpoints.listUids, {});
  const uploads = await post(endpoints.listUpload, {
    uid: '681210907',
    start: '2023-03-16T22:55:40.089Z',
    end: '2023-04-16T22:55:40.089Z',
    count: 100,
  });

  for (const item of lists) {
  }

  for (const upload of uploads) {
  }

  // Test
  console.log(
    JSON.stringify({
      //loggedIn,
      lists,
      uploads,
    })
  );

  // Login Dialog
  const dialog = $('#login-dialog');
  dialog.dialog({
    autoOpen: true,
    modal: true,
  });
  dialog.parent().find('.ui-dialog-titlebar-close').hide();
  dialog.find('form').on('submit', async function (event) {
    //
    event.preventDefault();
    const loggedIn = await login(password.val());
    console.log(loggedIn);

    if (loggedIn) {
      dialog.dialog('close');
      app.show();
    }
  });

  accordion.accordion({
    collapsible: true,
    heightStyle: 'content',
  });

  // List Users
  const userStartDate = $('#userStartDate');
  const userEndDate = $('#userEndDate');
  const userStartTime = $('#userStartTime');
  const userEndTime = $('#userEndTime');

  userStartDate.datepicker({
    showWeek: true,
    firstDay: 1,
    onSelect: () => {
      if (userStartTime.val() === '') {
        userStartTime.val('12:00 AM');
      }
    },
  });

  userEndDate.datepicker({
    showWeek: true,
    firstDay: 1,
    onSelect: () => {
      if (userEndTime.val() === '') {
        userEndTime.val('11:59 PM');
      }
    },
  });

  userStartTime.timepicker({
    timeFormat: 'h:mm TT',
    interval: 15,
    minTime: '00:00',
    maxTime: '11:59 PM',
    defaultTime: '12:00',
    startTime: '00:00',
    dynamic: false,
    dropdown: true,
    scrollbar: true,
    ampm: true,
  });

  userEndTime.timepicker({
    timeFormat: 'h:mm TT',
    interval: 15,
    minTime: '00:00',
    maxTime: '11:59 PM',
    defaultTime: '12:00',
    startTime: '00:00',
    dynamic: false,
    dropdown: true,
    scrollbar: true,
    ampm: true,
  });

  listUsers.click(async (e) => {
    listUsers.prop('disabled', true);
    listUsers.text('Searching...');
    const users = await post(endpoints.listUids, {
      start: getDatetime(userStartDate.val(), userStartTime.val()),
      end: getDatetime(userEndDate.val(), userEndTime.val()),
    });
    listUsers.prop('disabled', false);
    listUsers.text('Search');
    console.log(users);
  });
});

/**
 *
 */
function getDatetime(date, time) {
  const now = new Date();

  if (date === undefined || date === false || date === '') {
    date = `${now.getMonth()}/${now.getDate()}/${now.getFullYear()}`;
  }

  if (time === undefined || time === false || time === '') {
    time = `${now.getHours()}:${now.getMinutes()}`;
  }

  return new Date(`${date} ${time}`).toISOString();
}

/**
 *
 */
function setAppVisibility(app, showApp) {
  if (showApp === true) {
    app.show();
  } else {
    app.hide();
  }
}

/**
 *
 */
function isLoggedIn() {
  const password = localStorage.getItem('absolutelyNotAPassword');

  if (password === null) {
    return false;
  } else {
    return true;
  }
}

async function login(password) {
  if (isLoggedIn()) {
    return true;
  }
  // @TODO am I passing up a password here or something?
  const result = await call(endpoints.loggedInOperator);
  if (result && result.ok === true) {
    localStorage.setItem('absolutelyNotAPassword', password);
    return true;
  } else {
    return false;
  }
}

/**
 *
 */
function addAccordianItem(title, data, accordian) {
  const newItemHTML = `<h3>${title}</h3><div>${data}</div>`;
  accordian.append(newItemHTML);
  accordian.accordion('refresh');
}
