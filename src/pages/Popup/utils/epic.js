import { nsCCAuth } from './codes';

export default async function fetchEpic(code, callback) {
  const auth = nsCCAuth(code);
  const url = `https://ws1.nitestats.com/codes/checker?auth=${auth}&code=${code}`;
  const response = await fetch(url).then((res) => res.json());

  if (response?.table === 'valid') {
    const returnData = {
      title: response.title,
    };

    const term = response.title
      .split(' ')
      .filter((_, i, me) => me.length - 1 !== i)
      .join(' ');

    const imageRes = await fetch(
      `https://fnbr.co/api/images?search=${encodeURIComponent(term)}`,
      {
        headers: {
          'x-api-key': '2b0cc97a-a68a-4f02-a49f-6aef830d7d1a',
        },
      }
    ).then((res) => res.json());

    if (imageRes?.data?.[0]?.images?.icon) {
      returnData.image = imageRes?.data?.[0]?.images?.icon;
    }

    return callback(returnData);
  }
}
