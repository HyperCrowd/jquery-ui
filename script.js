const HOSTURL =
  'https://androidmonitor.internetwatchdogs.org' ||
  window.location.protocol + '//' + window.location.host;

/**
 *
 */
const endpoints = {
  loggedInOperator: 'v1/logged_in/operator',
  listUids: 'v1/list/uids',
  listUploads: 'v1/list/uploads',
  videoDownload: 'v1/download/video',
};

async function post(endpoint, params = {}) {
  return call(endpoint, params, 'POST');
}

/**
 *
 */
async function call(endpoint, params = {}, method = 'GET', headers = {}) {
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
  const password = sessionStorage.getItem('absolutelyNotAPassword');
  const url = `${HOSTURL}/${endpoint}${paramString}`;

  const command = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'x-api-key': password,
      'x-api-admin-key': password,
      ...headers,
    },
  };

  if (method === 'POST') {
    command.body = JSON.stringify(params);
  }

  const response = await fetch(url, command);

  return response.json();
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

$(document).ready(async function () {
  const loginForm = $('#login-form');
  const accordion = $('#accordion');
  const password = $('#password');
  const email = $('#email');
  const listUsers = $('#listUsers');
  const listUploads = $('#listUploads');

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  // Login
  loginForm.find('form').on('submit', async function (event) {
    event.preventDefault();

    const emailVal = email.val();
    if (emailRegex.test(emailVal) === false) {
      return;
    }

    const loggedIn = await login(emailVal, password.val());

    if (loggedIn) {
      accordion.accordion({
        active: 1,
      });
    }
  });
  password.val(sessionStorage.getItem('absolutelyNotAPassword'));
  email.val(sessionStorage.getItem('absolutelyNotAnEmail'));

  // Video Dialog
  const videoDialog = $('#video-dialog');
  videoDialog.dialog({
    autoOpen: false,
    modal: true,
    closeOnEscape: true,
    beforeClose: function () {
      videoDialog.html('');
    },
    open: function () {
      var contentWidth = $(this).find('.ui-dialog-content').width();
      $(this).dialog('option', 'width', contentWidth + 100);
    },
  });

  // Main
  accordion.accordion({
    collapsible: true,
    heightStyle: 'content',
  });

  // List Users
  const userStartDate = $('#userStartDate');
  const userEndDate = $('#userEndDate');
  const userStartTime = $('#userStartTime');
  const userEndTime = $('#userEndTime');
  const userResults = $('#userResults').hide();

  userStartDate.datepicker({
    showWeek: true,
    firstDay: 1,
    onSelect: () => {
      if (userStartTime.val() === '') {
        userStartTime.val('00:00:00');
      }
    },
  });

  userEndDate.datepicker({
    showWeek: true,
    firstDay: 1,
    onSelect: () => {
      if (userEndTime.val() === '') {
        userEndTime.val('23:59:59');
      }
    },
  });

  userStartTime.timepicker({
    timeFormat: 'hh:mm:ss',
    interval: 15,
    minTime: '00:00:00',
    maxTime: '23:59:59',
    defaultTime: '12:00:00',
    startTime: '00:00:00',
    dynamic: false,
    dropdown: true,
    scrollbar: true,
  });

  userEndTime.timepicker({
    timeFormat: 'hh:mm:ss',
    interval: 15,
    minTime: '00:00:00',
    maxTime: '23:59:59',
    defaultTime: '12:00:00',
    startTime: '00:00:00',
    dynamic: false,
    dropdown: true,
    scrollbar: true,
  });

  listUsers.click(async (e) => {
    listUsers.prop('disabled', true);
    listUsers.text('Searching...');

    const start = getDatetime(
      userStartDate.val(),
      userStartTime.val(),
      yesterday
    );
    const end = getDatetime(userEndDate.val(), userEndTime.val());

    const options = {};

    if (start !== false) {
      options.start = start;
    }

    if (end !== false) {
      options.end = end;
    }

    const users = await post(endpoints.listUids, options);
    listUsers.prop('disabled', false);
    listUsers.text('Search');

    userResults.hide();
    let html = '';
    for (const user of users) {
      html += `<tr>
        <td><button onclick="showUploads('${user.uid}');">${
        user.uid
      }</button></td>
        <td>${getFormattedDate(user.created)}</td>
      </tr>`;
    }

    userResults.find('tbody').html(html);
    userResults.show();
  });

  // Uploads
  const uploadsStartDate = $('#uploadsStartDate');
  const uploadsEndDate = $('#uploadsEndDate');
  const uploadsStartTime = $('#uploadsStartTime');
  const uploadsEndTime = $('#uploadsEndTime');
  const uploadsUid = $('#uploadsUid');
  const uploadsAppname = $('#uploadsAppname');
  const uploadsCount = $('#uploadsCount');
  const uploadResults = $('#uploadResults').hide();

  uploadsStartTime.timepicker({
    timeFormat: 'hh:mm:ss',
    interval: 15,
    minTime: '00:00:00',
    maxTime: '23:59:59',
    defaultTime: '12:00:00',
    startTime: '00:00:00',
    dynamic: false,
    dropdown: true,
    scrollbar: true,
  });

  uploadsEndTime.timepicker({
    timeFormat: 'hh:mm:ss',
    interval: 15,
    minTime: '00:00:00',
    maxTime: '23:59:59',
    defaultTime: '12:00:00',
    startTime: '00:00:00',
    dynamic: false,
    dropdown: true,
    scrollbar: true,
  });

  uploadsStartDate.datepicker({
    showWeek: true,
    firstDay: 1,
    onSelect: () => {
      if (uploadsStartTime.val() === '') {
        uploadsStartTime.val('00:00:00');
      }
    },
  });

  uploadsEndDate.datepicker({
    showWeek: true,
    firstDay: 1,
    onSelect: () => {
      if (uploadsEndTime.val() === '') {
        uploadsEndTime.val('23:59:59');
      }
    },
  });

  listUploads.click(async (e) => {
    listUploads.prop('disabled', true);
    listUploads.text('Searching...');

    const start = getDatetime(
      uploadsStartDate.val(),
      uploadsStartTime.val(),
      yesterday
    );

    const end = getDatetime(uploadsEndDate.val(), uploadsEndTime.val());

    const options = {
      count: uploadsCount.val(),
    };

    if (start !== false) {
      options.start = start;
    }

    if (end !== false) {
      options.end = end;
    }

    if (uploadsUid.val() !== '') {
      options.uid = uploadsUid.val();
    }

    if (uploadsAppname.val() !== '') {
      options.appname = uploadsAppname.val();
    }
    const uploads = await post(endpoints.listUploads, options);

    listUploads.prop('disabled', false);
    listUploads.text('Search');

    uploadResults.hide();
    let html = '';
    for (const upload of uploads) {
      html += `<tr>
        <td>${upload.id}</td>
        <td><button onclick="showVideo('${upload.id}');">Watch</button></td>
        <td>${upload.appname}</td>
        <td>${getFormattedDate(upload.start)}</td>
        <td>${getFormattedDate(upload.end)}</td>
      </tr>`;
    }

    uploadResults.find('tbody').html(html);
    uploadResults.show();
  });
});

function getFormattedDate(date) {
  return new Date(date)
    .toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
    .toString()
    .replace(', ', ',<br />');
}

/**
 *
 */
function getDatetime(date, time, now = new Date()) {
  if (date === undefined || date === false || date === '') {
    return false;
    // date = `${now.getMonth()}/${now.getDate()}/${now.getFullYear()}`;
  }

  if (time === undefined || time === false || time === '') {
    time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  }

  return new Date(`${date} ${time}`).toISOString();
}

/**
 *
 */
async function showVideo(id) {
  const url = `${HOSTURL}/${endpoints.videoDownload}/${id}`;
  const video = await call(url);
  console.log(video);
  const videoDialog = $('#video-dialog');
  videoDialog.html(`<video controls>
  <source src="${url}" type="video/mp4">
  Your browser does not support the video tag.
  </video>
  <br />
  <a href="${url}">Download</a>`);
  videoDialog.dialog('open');
}

async function showUploads(id) {
  const accordion = $('#accordion');
  const uploadsUid = $('#uploadsUid');
  const listUploads = $('#listUploads');

  uploadsUid.val(id.toString());
  accordion.accordion({
    active: 2,
  });
  listUploads.click();
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
  const password = sessionStorage.getItem('absolutelyNotAPassword');

  if (password === null) {
    return false;
  } else {
    return true;
  }
}

/**
 *
 */
async function login(email, password) {
  // @TODO am I passing up a password here or something?
  const result = await call(endpoints.loggedInOperator, {}, 'GET', {
    'x-api-key': password,
  });

  if (result && result.ok === true) {
    sessionStorage.setItem('absolutelyNotAnEmail', email);
    sessionStorage.setItem('absolutelyNotAPassword', password);

    return true;
  } else {
    $('#password').val('').prop('placeholder', 'Bad Password, try again');
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
