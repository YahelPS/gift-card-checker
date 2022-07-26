import { getPassword } from '../Popup/utils/getProxies';

chrome.runtime.onMessage.addListener((request, sender, sendRes) => {
  if (request.type === 'startProxy') {
    const { proxy, callback } = request.data;
    const config = {
      mode: 'fixed_servers',
      rules: {
        singleProxy: {
          scheme: 'http',
          host: proxy.host,
          port: parseInt(proxy.port),
        },
        bypassList: [],
      },
    };

    chrome.webRequest.onAuthRequired.addListener(
      (details) => {
        console.log(details);
        const data = localStorage.getItem('proxy');
        if (data) {
          return {
            authCredentials: {
              username: data.password,
              password: data.password,
            },
          };
        }
      },
      { urls: ['<all_urls>'] },
      ['blocking']
    );

    chrome.proxy.settings.set({ value: config, scope: 'regular' }, async () => {
      localStorage.setItem(
        'proxy',
        JSON.stringify({
          connected: true,
          proxy,
          password: await getPassword(proxy.ip),
          connectedSince: Date.now(),
        })
      );
      console.log('connected');
      callback();
    });
  }
});
