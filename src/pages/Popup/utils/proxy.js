import { getPassword } from './getProxies';

export async function connectProxy(proxy, callback) {
  const password = await getPassword(proxy.ip);
  const config = {
    mode: 'fixed_servers',
    rules: {
      singleProxy: {
        scheme: password.length === 32 ? 'http' : 'socks5',
        host: proxy.host,
        port: parseInt(proxy.port),
      },
      bypassList: ['https://api.hide-my-ip.com'],
    },
  };

  chrome.webRequest.onAuthRequired.addListener(
    async (details) => {
      if (!details.isProxy) return;
      return {
        authCredentials: {
          username: password,
          password: password,
        },
      };
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
        password,
        connectedSince: Date.now(),
      })
    );
    console.log('connected');
    callback();
  });
}

export async function disconnectProxy() {
  return await chrome.proxy.settings.set({
    value: { mode: 'direct' },
    scope: 'regular',
  });
}
