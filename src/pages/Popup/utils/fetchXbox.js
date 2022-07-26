import {
  checkProxies,
  checkProxy,
  getParsedProxies,
  getPassword,
  getProxies,
} from './getProxies';
import { connectProxy, disconnectProxy } from './proxy';

const options = {
  headers: {
    accept: 'application/json, text/javascript, */*; q=0.01',
    'accept-language': 'en-US,en;q=0.9,he;q=0.8',
    authorization:
      'WLID1.0="EwBAA18iAQAUkOrzy5O8+zKmOLh4X1kZomC7Ye8AAWqXQSv5mja1pJX4ekVtkYGMI8RAhSy+G9HvN5lMp0dyyTDpXMdNmvM1ACR8KUAtdKtR193H+JQvCyrrKHxwWKP7Icl4NEZ4XNBz3j/gfEBSIpsw9wEojZj9B7SblqVfvXWQfFS9uXp1F6vcEDZ6ZhUuxsoM5Bs8Bs9vfA3VaOBwlaf4bgdlS6tIag1A+oQOITTxmDY5frMlmyqihTjPm3mWvhp4/BX0qeKXIl+PHO3PSMFCuvrlrckSUvhuV+ERp6L+tWHE83ckYt0XQO+Np2dnIi2pe7BUZExvZ+w1H8NZC7yTsy0pFOw9T8Zjeb7cIwLCPNnpNGCto3VNzNvyQwkDZgAACCwwpm9cEC/REAJ8X6AVtV/HPNjc43xivUJe0VBwBFc8Uy1RP/ty7MRmLMxHN4M295EHMYAjvkmEfI3g9vycPyWIzY57+lnrnlKUy+hcdmgcliYkLTgfm0oP9kQgwYBxNBMLpq4s2UtKlVPhyOi52FGvI0ggS2CjKRjS9g/q0Emp+Rc/Hlw3LOp5d55aGndEg0du7Uc7pG9h4F8LUntJly3Z4B1RruU3ymb0G62D1NKAAY4dQc3DOZ11oLlWsf7xkOPsoPKRpcGjk2qajLWyo7WknXWHVZvpCo3oAMfR0AxM/Y8licQosQTYZPQm0U2CUp8edYkXGORo+KFtoFU7sw+aRxWnfyyhA6hyPzZd76oHtoe50mLY8i6oEf6l9TD82M3K3xpnVccZdgfb7/QF7CCmLnThgo4yahwkl0B+TuI8MeX9toJnBT/4uXEfy3vI39uEZCOD2IbZycfuf5aBjd2vHsI0/fUEu4bSfgpA/tF4jfri0j8FaE0bAnzUDugau20jmWCH1ZymcZHQOYRK/wTBkPQVzSTSJrJ4X2ENH8MFXoIWeRdVTmh7dxORJGbYJVZjLwKrthK1thzXohByt5ytahHqaMHzU+fNQ4iDeQui/tgebKsrMEVbJKdqX433XO6ypCtHcWggELHuw8ZR8SHr9rbAD1IhDV6Ay7IXdA+927xncxvbfppPqAvtVrg+odg4K7KaiVGjrRNMAg=="',
    'ms-cv': 'i91LD1KFpUqDZHxH.5.47',
    'sec-ch-ua':
      '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    Referer: 'https://www.microsoft.com/',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  },
};

export default async function fetchXbox(code, proxyCallback, callback) {
  const url = `https://purchase.mp.microsoft.com/v7.0/tokenDescriptions/${code}?market=IL&language=en-US&supportMultiAvailabilities=true`;
  const response = await fetch(url, options).then((res) => res.json());
  console.log(response);
  if (response.innererror) {
    const data = response.innererror?.data;
    if (data?.[0] === 'GeoRestricted') {
      const country = data.at(-1).toUpperCase();
      const proxies = await getParsedProxies();
      const countryProxies = proxies.filter((pr) => pr.countryCode === country);
      console.log(countryProxies.map((p) => `${p.host}:${p.port}`));
      const validProxy = countryProxies.find(
        (p) => p.host === '128.199.208.93'
      );
      console.log(validProxy);

      if (validProxy) connectProxy(validProxy, () => proxyCallback(validProxy));
      callback({
        title: `This code can only be used in ${country}, connecting a VPN...`,
        image:
          'https://media.discordapp.net/attachments/701456915552796682/1000592200255684688/undraw_Best_place_re_lne9-removebg-preview.png',
      });

      // const proxy =
      //   countryProxies[Math.floor(Math.random() * countryProxies.length)];

      // if (!proxy) return 'error';
      // if (proxy) connectProxy(proxy, () => proxyCallback(proxy));

      // return callback({
      //   title: `This code can only be used in ${country}, connecting a VPN...`,
      //   image:
      //     'https://media.discordapp.net/attachments/701456915552796682/1000592200255684688/undraw_Best_place_re_lne9-removebg-preview.png',
      // });
    }
  } else {
    // error
  }
}
