const Token = 'ce6a7ecb-55b3-4b25-ac02-301e501b3c0c';
const baseURL = 'https://api.yandex.mightycall.ru/api/v3';
const yandex = async () => {
  await $(document).ready();
  const login = await axios.post(`${baseURL}/auth/token`, 'grant_type=client_credentials&client_id=ce6a7ecb-55b3-4b25-ac02-301e501b3c0c&client_secret=102', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  const Number = await axios.get(`${baseURL}/phonenumbers`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${login.data.access_token}`,
      'x-api-key': `${Token}`,
    },
  });
  const Call = await axios.post(`${baseURL}/calls/makecall`, {
    from: `${Number.data.data.phoneNumbers[0].number}`,
    to: '+79515192483',
  }, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${login.data.access_token}`,
      'x-api-key': `${Token}`,
    },
  });
  await console.log(Number.data.data.phoneNumbers[0].number);
  return Call;
  // +79515192483
};
yandex()
  .then((result) => {
    console.log(result.data);
  })
  .catch((exception) => {
    console.log(exception);
  });
