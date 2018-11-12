document.addEventListener('DOMContentLoaded', () => {
  axios.post('/api/v2/stats', {
    operator: localStorage.getItem('username'),
  })
    .then((response) => {
      document.getElementById('calls').innerText = `Звонков: ${response.data.result.total}`;
      document.getElementById('leads').innerText = `Лидов: ${response.data.result.leads}`;
      document.getElementById('gm').innerText = response.data.result.goodMorning;
      document.getElementById('ktk').innerText = response.data.result.keyToCall;
    })
    .catch((error) => {
      console.log(error);
    });
});
