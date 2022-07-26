export async function getProxies() {
  const response = await fetch(
    'https://api.hide-my-ip.com/chrome.cgi?key=3KFX-AJYQ-3KLT-GNYS-U4LZ-F6BJ'
  ).then((res) => res.text());
  return response.split('\n');
}

export async function getPassword(ip) {
  const response = await fetch(
    `https://api.hide-my-ip.com/chrome.cgi?key=3KFX-AJYQ-3KLT-GNYS-U4LZ-F6BJ&ip=${ip}`
  ).then((res) => res.text());
  return response;
}

export function parseProxies(data) {
  const proxies = [];

  data.forEach(function (value) {
    if (value.indexOf('Server: ') === 0) {
      let s1 = value.substr(8);
      let tokens = s1.split(',');
      let host = tokens[6].replace('|', '').replace('<br />', '');
      let port = parseInt(tokens[4]);
      let countryCode = tokens[2];
      if (countryCode === 'UK') {
        countryCode = 'UA';
      }
      let city = tokens[0].trim();
      let place = tokens[1].trim();
      let country = tokens[3]
        .toLowerCase()
        .replace(/\b[a-z]/g, function (letter) {
          return letter.toUpperCase();
        });
      country = country.trim();
      let name = country + ', ';
      if (city !== place && country !== place) name += place + ', ' + city;
      else name += city;
      let newProxyItem = { host, port, countryCode, name, list: 1 };
      proxies.push(newProxyItem);

      //see if active proxy is in the list and if so, replace activeProxy with new object referring to same prox
    } else if (value.indexOf('ExtraServer: ') === 0) {
      // ExtraServer

      let s1 = value.substr(13);
      //console.log('ExtraServer:', s1);
      let tokens = s1.split(',');
      let host = tokens[4];
      let port = parseInt(tokens[5]) || 0;
      let countryCode = tokens[2];
      if (countryCode === 'UK') {
        countryCode = 'UA';
      }
      let city = tokens[0].trim();
      let place = tokens[1].trim();
      let country = tokens[3]
        .toLowerCase()
        .replace(/\b[a-z]/g, function (letter) {
          return letter.toUpperCase();
        });
      country = country.trim();
      let name = country + ', ';
      if (city !== place && country !== place && place.length)
        name += place + ', ' + city;
      else name += city;

      let newProxyItem = { host, port, countryCode, name, list: 2 };
      proxies.push(newProxyItem);

      //see if active proxy is in the list and if so, replace activeProxy with new object referring to same prox
    } // ExtraServer
  }); //forEach
  return proxies;
}

export async function getParsedProxies() {
  const data = await getProxies();
  return parseProxies(data);
}

export function checkProxies() {}
