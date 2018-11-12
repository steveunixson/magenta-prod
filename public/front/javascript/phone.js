const call = async () => {
  const Token = await axios.get('/api/v2/yandex-key');
  const MagentaAPI = await axios.get('/api/v2/org');
  const secretKey = localStorage.getItem('yandexID');
  const mcConfig = { login: `${Token.data.yandex}`, password: `${secretKey}` };
  await MightyCallWebPhone.ApplyConfig(mcConfig);
  await MightyCallWebPhone.Phone.Init('phone');
  return MagentaAPI;
};
call()
  .then((result) => {
    localStorage.setItem('CRM-key', result.data.msg);
    document.querySelector('.btn.btn-danger.black').disabled = true;
  })
  .catch((exception) => { console.log(exception); });

const startTime = new Date().toLocaleTimeString();
localStorage.setItem('startTime', startTime);

let step = 0;
function startCall() {
  function counter() {
    return step++;
  }
  axios.post('/api/v2/numbers', { base: localStorage.getItem('callBase'), id: `${counter()}` }, {
    headers: {
      'x-api-key': localStorage.getItem('CRM-key'),
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
    .then((response) => {
      console.log(`+7${response.data.msg.phoneNumber.replace(/\D/g, '').substring(1)}`);
      MightyCallWebPhone.Phone.Call(`+7${response.data.msg.phoneNumber.replace(/\D/g, '').substring(1)}`);
      document.getElementById('companyName').innerText = `Компания: ${response.data.msg.companyName}`;
    })
    .catch((exception) => {
      console.log(exception);
    });
  function webPhoneOnCallOutgoing(callInfo) {
    console.log(`Звонок от:${callInfo.From}`);
    console.log(`Звонок к:${callInfo.To}`);
    document.getElementById('nextNumber').disabled = true;
    document.getElementById('prevNumber').disabled = true;
    document.querySelector('.btn.btn-danger.black').disabled = true;
  }
  MightyCallWebPhone.Phone.OnCallOutgoing.subscribe(webPhoneOnCallOutgoing);
  console.log(step);
  localStorage.setItem('lastContactID', step);
}

function prevCall() {
  function counter() {
    return step--;
  }
  axios.post('/api/v2/numbers', { base: localStorage.getItem('callBase'), id: `${counter()}` }, {
    headers: {
      'x-api-key': localStorage.getItem('CRM-key'),
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
    .then((response) => {
      console.log(`+7${response.data.msg.phoneNumber.replace(/\D/g, '').substring(1)}`);
      document.getElementById('companyName').innerText = `Компания: ${response.data.msg.companyName}`;
    })
    .catch((exception) => {
      console.log(exception);
      localStorage.removeItem('lastContactID');
    });
  console.log(step);
  localStorage.setItem('lastContactID', step);
}

function endWork() {
  axios.post('/api/v2/user/stats', {
    apiKey: localStorage.getItem('CRM-key'),
    start: localStorage.getItem('startTime'),
    end: new Date().toLocaleTimeString(),
    operator: localStorage.getItem('username'),
    localTime: new Date().toLocaleTimeString(),
    localDate: new Date().toLocaleDateString(),
    callNumber: localStorage.getItem('lastContactID'),
  })
    .then((response) => {
      console.log(response);
      window.location.href = 'begin.html';
    })
    .catch((error) => {
      console.log(error);
    });
}

function endCall() {
  MightyCallWebPhone.Phone.HangUp();
  document.querySelectorAll('.container-fluid.pt-2')[0].style = 'visibility: visible';
  document.getElementById('nextNumber').disabled = true;
  document.getElementById('prevNumber').disabled = true;
  document.querySelector('.btn.btn-danger.black').disabled = true;
}

document.getElementById('selectLeedStatus').style = 'visibility: hidden';
document.getElementById('selectLeed').style = 'visibility: hidden';
document.getElementById('selectRecallProject').style = 'visibility: hidden';
document.getElementById('selectDeny').style = 'visibility: hidden';
document.getElementById('dateLead').style = 'visibility: hidden';
document.getElementById('timeLead').style = 'visibility: hidden';
document.getElementById('lprEmailInput').style = 'visibility: hidden';
document.getElementById('selectRecallReason').style = 'visibility: hidden';
document.getElementById('recallDate').style = 'visibility: hidden';
document.getElementById('recallTime').style = 'visibility: hidden';

function selectRecalStatus() {
  document.getElementById('selectRecallReason').style = 'visibility: visible';
}

function selectRecallDate() {
  document.getElementById('recallDate').style = 'visibility: visible';
  document.getElementById('recallTime').style = 'visibility: visible';
}

function selectLead() {
  document.getElementById('selectLeedStatus').style = 'visibility: visible';
}

function selectLeadDate() {
  document.getElementById('dateLead').style = 'visibility: visible';
  document.getElementById('timeLead').style = 'visibility: visible';
}

function showLead() {
  document.querySelector('.btn-group-vertical').children[0].value = 'active';
  document.querySelector('.btn-group-vertical').children[1].value = 'standby';
  document.querySelector('.btn-group-vertical').children[2].value = 'standby';
  document.getElementById('selectLeed').style = 'visibility: visible';
  document.getElementById('selectRecallProject').style = 'visibility: hidden';
  document.getElementById('selectRecallReason').style = 'visibility: hidden';
  document.getElementById('recallDate').style = 'visibility: hidden';
  document.getElementById('recallTime').style = 'visibility: hidden';
  document.getElementById('selectDeny').style = 'visibility: hidden';
  document.getElementById('lprEmailInput').style = 'visibility: hidden';
  document.getElementById('selectDeny').style = 'visibility: hidden';
  document.getElementById('lprEmailInput').style = 'visibility: hidden';
}

function showRecal() {
  document.querySelector('.btn-group-vertical').children[0].value = 'standby';
  document.querySelector('.btn-group-vertical').children[1].value = 'active';
  document.querySelector('.btn-group-vertical').children[2].value = 'standby';
  document.getElementById('selectRecallProject').style = 'visibility: visible';
  document.getElementById('selectLeed').style = 'visibility: hidden';
  document.getElementById('selectLeedStatus').style = 'visibility: hidden';
  document.getElementById('dateLead').style = 'visibility: hidden';
  document.getElementById('timeLead').style = 'visibility: hidden';
  document.getElementById('selectDeny').style = 'visibility: hidden';
  document.getElementById('lprEmailInput').style = 'visibility: hidden';
}

function showDeny() {
  document.querySelector('.btn-group-vertical').children[0].value = 'standby';
  document.querySelector('.btn-group-vertical').children[1].value = 'standby';
  document.querySelector('.btn-group-vertical').children[2].value = 'active';
  document.getElementById('dateLead').style = 'visibility: hidden';
  document.getElementById('selectDeny').style = 'visibility: visible';
  document.getElementById('selectLeed').style = 'visibility: hidden';
  document.getElementById('selectLeedStatus').style = 'visibility: hidden';
  document.getElementById('timeLead').style = 'visibility: hidden';
  document.getElementById('selectRecallProject').style = 'visibility: hidden';
  document.getElementById('selectRecallReason').style = 'visibility: hidden';
  document.getElementById('recallDate').style = 'visibility: hidden';
  document.getElementById('recallTime').style = 'visibility: hidden';
}

function selectDeny() {
  if (document.getElementById('selectDeny').value === 'offer') {
    document.getElementById('lprEmailInput').style = 'visibility: visible';
  } else {
    document.getElementById('lprEmailInput').style = 'visibility: hidden';
  }
}

function onLeadSelectChange() {
  if (document.getElementById('selectLeed').value === 'Good Morning') {
    document.querySelector('#selectLeedStatus').children[0].disabled = false;
    document.querySelector('#selectLeedStatus').children[1].disabled = false;
    document.querySelector('#selectLeedStatus').children[2].disabled = true;
    document.querySelector('#selectLeedStatus').children[3].disabled = true;
  }
  if (document.getElementById('selectLeed').value === 'Key to Call') {
    document.querySelector('#selectLeedStatus').children[0].disabled = true;
    document.querySelector('#selectLeedStatus').children[1].disabled = true;
    document.querySelector('#selectLeedStatus').children[2].disabled = false;
    document.querySelector('#selectLeedStatus').children[3].disabled = false;
  }
}

function sendStatus() {
  axios.post('/api/v2/numbers', { base: localStorage.getItem('callBase'), id: `${step}` }, {
    headers: {
      'x-api-key': localStorage.getItem('CRM-key'),
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
    .then((response) => {
      if (document.querySelector('.btn-group-vertical').children[0].value === 'active') {
        const data = {
          id: step,
          base: localStorage.getItem('callBase'),
          phone: response.data.msg.phoneNumber,
          company: response.data.msg.companyName,
          success: true,
          operator: localStorage.getItem('username'),
          type: 'Лид',
          project: document.getElementById('selectLeed').value,
          status: document.getElementById('selectLeedStatus').value,
          date: document.getElementById('date_lead').value,
          time: document.getElementById('time_lead').value,
          apiKey: localStorage.getItem('CRM-key'),
        };
        console.log(data);
        axios.post('/api/v2/status', data)
          .then((result) => {
            console.log(result);
          })
          .catch((error) => {
            console.log(error);
          });
      }
      if (document.querySelector('.btn-group-vertical').children[1].value === 'active') {
        const data = {
          id: step,
          base: localStorage.getItem('callBase'),
          phone: response.data.msg.phoneNumber,
          company: response.data.msg.companyName,
          success: false,
          operator: localStorage.getItem('username'),
          type: 'Перезвон',
          project: document.getElementById('selectRecallProject').value,
          status: document.getElementById('selectRecallReason').value,
          date: document.getElementById('date_recall').value,
          time: document.getElementById('time_recall').value,
          apiKey: localStorage.getItem('CRM-key'),
        };
        console.log(data);
        axios.post('/api/v2/status', data)
          .then((result) => {
            console.log(result);
          })
          .catch((error) => {
            console.log(error);
          });
      }
      if (document.querySelector('.btn-group-vertical').children[2].value === 'active') {
        const data = {
          id: step,
          base: localStorage.getItem('callBase'),
          phone: response.data.msg.phoneNumber,
          company: response.data.msg.companyName,
          success: false,
          operator: localStorage.getItem('username'),
          type: 'Отказ',
          status: document.getElementById('selectDeny').value,
          email: document.getElementById('lprEmailInput').value,
          apiKey: localStorage.getItem('CRM-key'),
        };
        console.log(data);
        axios.post('/api/v2/status', data)
          .then((result) => {
            console.log(result);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    })
    .catch((exception) => {
      console.log(exception);
    });
  document.getElementById('nextNumber').disabled = false;
  document.getElementById('prevNumber').disabled = false;
  document.querySelector('.btn.btn-danger.black').disabled = false;
  document.getElementById('selectLeedStatus').style = 'visibility: hidden';
  document.getElementById('selectLeed').style = 'visibility: hidden';
  document.getElementById('selectRecallProject').style = 'visibility: hidden';
  document.getElementById('selectDeny').style = 'visibility: hidden';
  document.getElementById('dateLead').style = 'visibility: hidden';
  document.getElementById('timeLead').style = 'visibility: hidden';
  document.getElementById('lprEmailInput').style = 'visibility: hidden';
  document.getElementById('selectRecallReason').style = 'visibility: hidden';
  document.getElementById('recallDate').style = 'visibility: hidden';
  document.getElementById('recallTime').style = 'visibility: hidden';
  document.querySelectorAll('.container-fluid.pt-2')[0].style = 'visibility: hidden';
}

// дорогой друг! ты нашел этот пиздец... Это и правда пиздец
// за такое положен отдельный котел в аду с персоональным черным сверлителем очка
// приношу глубочайшие извинения за сий говнокод, но сроки поджимали и мы делали как умели
// на реакт или вью или другие НОРМАЛЬНЫЕ ТЕХНОЛОГИИ не хватало времени
// ДА даже для джиквери было слишком поздно!
// unixson 11.11.2018
