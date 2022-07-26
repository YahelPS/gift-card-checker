import { hex2text } from './string';
import CryptoJS from 'crypto-js';

export const validXboxChars = [
  'B',
  'C',
  'D',
  'F',
  'G',
  'H',
  'J',
  'K',
  'M',
  'P',
  'Q',
  'R',
  'T',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  '2',
  '3',
  '4',
  '6',
  '7',
  '8',
  '9',
];

export const validateXbox = (input) => {
  if (input.replaceAll('-', '').length !== 25) return false;
  const inputArray = input.replaceAll('-', '').split('');
  const isValid = inputArray.every((char) => validXboxChars.includes(char));
  return isValid;
};

export const validatePSN = (input) => {
  if (input.replaceAll('-', '').length !== 12) return false;
  return true;
};

export const validateEpic = (input) => {
  if (input.replaceAll('-', '').length !== 20) return false;
  return true;
};

export function nsCCAuth(data) {
  return CryptoJS.MD5(
    hex2text('4e697465537461747341757468') + 'v1.3:' + data
  ).toString();
}
