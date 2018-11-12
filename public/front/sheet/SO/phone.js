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
    document.querySelectorAll('.container-fluid.pt-2')[0].style = 'visibility: hidden';
  })
  .catch((exception) => { console.log(exception); });

const startTime = new Date().toLocaleTimeString();
localStorage.setItem('startTime', startTime);

function endWork() {
  window.location.href = 'begin.html';
}

document.getElementById('selectDeal').style = 'visibility: hidden';
document.getElementById('selectDealStatus').style = 'visibility: hidden';
document.getElementById('selectRecall').style = 'visibility: hidden';
document.getElementById('selectRecallStatus').style = 'visibility: hidden';
document.getElementById('selectDenyStatus').style = 'visibility: hidden';
document.getElementById('denyEmail').style = 'visibility: hidden';
document.getElementById('recallDate').style = 'visibility: hidden';
document.getElementById('recallTime').style = 'visibility: hidden';
document.getElementById('dealTextArea').style = 'visibility: hidden';

function endCall() {
  MightyCallWebPhone.Phone.HangUp();
  document.querySelectorAll('.container-fluid.pt-2')[0].style = 'visibility: visible';
  document.querySelector('.btn.btn-danger.black').disabled = true;
}

function sendStatus() {
  document.querySelector('.btn.btn-danger.black').disabled = false;
  document.querySelectorAll('.container-fluid.pt-2')[0].style = 'visibility: hidden';
  document.getElementById('selectDeal').style = 'visibility: hidden';
  document.getElementById('selectDealStatus').style = 'visibility: hidden';
  document.getElementById('selectRecall').style = 'visibility: hidden';
  document.getElementById('selectRecallStatus').style = 'visibility: hidden';
  document.getElementById('selectDenyStatus').style = 'visibility: hidden';
  document.getElementById('denyEmail').style = 'visibility: hidden';
  document.getElementById('recallDate').style = 'visibility: hidden';
  document.getElementById('recallTime').style = 'visibility: hidden';
  document.getElementById('dealTextArea').style = 'visibility: hidden';
}

function showDeal() {
  document.getElementById('selectDeal').style = 'visibility: visible';
  document.getElementById('selectDealStatus').style = 'visibility: hidden';
  document.getElementById('selectRecall').style = 'visibility: hidden';
  document.getElementById('selectRecallStatus').style = 'visibility: hidden';
  document.getElementById('selectDenyStatus').style = 'visibility: hidden';
  document.getElementById('denyEmail').style = 'visibility: hidden';
  document.getElementById('recallDate').style = 'visibility: hidden';
  document.getElementById('recallTime').style = 'visibility: hidden';
  document.getElementById('dealTextArea').style = 'visibility: hidden';
}

function showDealStatus() {
  document.getElementById('selectDeal').style = 'visibility: visible';
  document.getElementById('selectDealStatus').style = 'visibility: visible';
  document.getElementById('selectRecall').style = 'visibility: hidden';
  document.getElementById('selectRecallStatus').style = 'visibility: hidden';
  document.getElementById('selectDenyStatus').style = 'visibility: hidden';
  document.getElementById('denyEmail').style = 'visibility: hidden';
  document.getElementById('recallDate').style = 'visibility: hidden';
  document.getElementById('recallTime').style = 'visibility: hidden';
  document.getElementById('dealTextArea').style = 'visibility: hidden';
}

function showDealTextArea() {
  document.getElementById('selectDeal').style = 'visibility: visible';
  document.getElementById('selectDealStatus').style = 'visibility: visible';
  document.getElementById('selectRecall').style = 'visibility: hidden';
  document.getElementById('selectRecallStatus').style = 'visibility: hidden';
  document.getElementById('selectDenyStatus').style = 'visibility: hidden';
  document.getElementById('denyEmail').style = 'visibility: hidden';
  document.getElementById('recallDate').style = 'visibility: hidden';
  document.getElementById('recallTime').style = 'visibility: hidden';
  document.getElementById('dealTextArea').style = 'visibility: visible';
}

function showRecall() {
  document.getElementById('selectDeal').style = 'visibility: hidden';
  document.getElementById('selectDealStatus').style = 'visibility: hidden';
  document.getElementById('selectRecall').style = 'visibility: visible';
  document.getElementById('selectRecallStatus').style = 'visibility: hidden';
  document.getElementById('selectDenyStatus').style = 'visibility: hidden';
  document.getElementById('denyEmail').style = 'visibility: hidden';
  document.getElementById('recallDate').style = 'visibility: hidden';
  document.getElementById('recallTime').style = 'visibility: hidden';
  document.getElementById('dealTextArea').style = 'visibility: hidden';
}

function showRecallStatus() {
  document.getElementById('selectDeal').style = 'visibility: hidden';
  document.getElementById('selectDealStatus').style = 'visibility: hidden';
  document.getElementById('selectRecall').style = 'visibility: visible';
  document.getElementById('selectRecallStatus').style = 'visibility: visible';
  document.getElementById('selectDenyStatus').style = 'visibility: hidden';
  document.getElementById('denyEmail').style = 'visibility: hidden';
  document.getElementById('recallDate').style = 'visibility: hidden';
  document.getElementById('recallTime').style = 'visibility: hidden';
  document.getElementById('dealTextArea').style = 'visibility: hidden';
}

function showRecallDate() {
  document.getElementById('selectDeal').style = 'visibility: hidden';
  document.getElementById('selectDealStatus').style = 'visibility: hidden';
  document.getElementById('selectRecall').style = 'visibility: visible';
  document.getElementById('selectRecallStatus').style = 'visibility: visible';
  document.getElementById('selectDenyStatus').style = 'visibility: hidden';
  document.getElementById('denyEmail').style = 'visibility: hidden';
  document.getElementById('recallDate').style = 'visibility: visible';
  document.getElementById('recallTime').style = 'visibility: visible';
  document.getElementById('dealTextArea').style = 'visibility: hidden';
}

function showDeny() {
  document.getElementById('selectDeal').style = 'visibility: hidden';
  document.getElementById('selectDealStatus').style = 'visibility: hidden';
  document.getElementById('selectRecall').style = 'visibility: hidden';
  document.getElementById('selectRecallStatus').style = 'visibility: hidden';
  document.getElementById('selectDenyStatus').style = 'visibility: visible';
  document.getElementById('recallDate').style = 'visibility: hidden';
  document.getElementById('recallTime').style = 'visibility: hidden';
  document.getElementById('dealTextArea').style = 'visibility: hidden';
}

function showDenyEmail() {
  if (document.getElementById('selectDenyStatus').value === 'offer') {
    document.getElementById('denyEmail').style = 'visibility: visible';
  } else {
    document.getElementById('denyEmail').style = 'visibility: hidden';
  }
}

function onLeadSelectChange() {
  if (document.getElementById('selectDeal').value === 'Good Morning') {
    document.querySelector('#selectDealStatus').children[1].disabled = false;
    document.querySelector('#selectDealStatus').children[2].disabled = false;
    document.querySelector('#selectDealStatus').children[3].disabled = true;
    document.querySelector('#selectDealStatus').children[4].disabled = true;
  }
  if (document.getElementById('selectDeal').value === 'Key to Call') {
    document.querySelector('#selectDealStatus').children[1].disabled = true;
    document.querySelector('#selectDealStatus').children[2].disabled = true;
    document.querySelector('#selectDealStatus').children[3].disabled = false;
    document.querySelector('#selectDealStatus').children[4].disabled = false;
  }
}

// дорогой друг! ты нашел этот пиздец... Это и правда пиздец
// за такое положен отдельный котел в аду с персоональным черным сверлителем очка
// приношу глубочайшие извинения за сий говнокод, но сроки поджимали и мы делали как умели
// на реакт или вью или другие НОРМАЛЬНЫЕ ТЕХНОЛОГИИ не хватало времени
// ДА даже для джиквери было слишком поздно!
// unixson 11.11.2018
