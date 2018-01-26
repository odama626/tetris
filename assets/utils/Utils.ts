export const for2dTruthy = (matrix, callback) => {
  let y;
  let x;
  let tempReturn = false;
  for (y = 0; y < matrix.length; y++) {
    for (x = 0; x < matrix[y].length; x++) {
      tempReturn = callback(x, y);
      if (tempReturn) return tempReturn;
    }
  }
  return tempReturn;
};

export const compareWith = (...keys) => (a, b) =>
  a && b ? keys.reduce((acc, cur) => acc && a[cur] === b[cur], true) : false;

export function storageAvailable(type) {
  try {
    // test for 'localStorage' and 'sessionStorage'
    var storage = window[type],
      x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      (e.code === 22 ||
        e.code === 1014 ||
        e.name === 'QuoteExceededError' ||
        e.name === 'NS_ERROR_DOM_QUOTEA_REACHED') &&
      storage.length !== 0
    );
  }
}

export class Format {
  static percentage(percentage: number): string {
    return `${(percentage * 100).toLocaleString()}%`;
  }
  static dateFull(timestamp: Date): string {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  static date(timestamp: Date): string {
    let date = new Date(timestamp);
    return `${Format.padLeft(
      (date.getMonth() + 1).toString(),
      2,
      '0'
    )}/${Format.padLeft(date.getDate().toString(), 2, '0')}/${date
      .getFullYear()
      .toString()
      .slice(2)}`;
  }

  static padLeft(str: string, x: number, s: string): string {
    str = str.toString();
    if (str.length >= x) return str;
    return Array(((x + 1 - str.length) / s.length) | 0).join(s) + str;
  }

  static capitalize(str: string): string {
    if (str.length < 1) return str;
    return str[0].toUpperCase() + str.slice(1);
  }

  static pluralize(str: string, qty: number): string {
    return qty > 1 && str[str.length - 1] !== 's' ? str + 's' : str;
  }
  static depluralize(str: string): string {
    return str[str.length - 1] === 's' ? str.substr(0, str.length - 1) : str;
  }

  static phoneNumber(str: string): string {
    let s = str.replace(/\D/g, '');
    return `(${s.slice(0, 3)}) ${s.slice(3, 6)}-${s.slice(6)}`;
  }

  static stringifyList(strs: string[]): string {
    return strs.slice(0, -1).join(', ') + ', and ' + strs.slice(-1);
  }
}

export function lockScroll(lock: boolean = true, resetScroll: boolean = false) {
  if (resetScroll) window.scroll(0, 0);
  document.body.classList.toggle('body-locked', lock);
}

export function getProportionateWidth({ width, height }, targetHeight) {
  return width * targetHeight / height;
}

export function ImageBase64(url: string) {
  return new Promise((resolve, reject) => {
    let image = new Image();
    image.setAttribute('crossOrigin', 'anonymous');
    image.onerror = e => reject(e);
    image.onload = function() {
      let me = this as HTMLImageElement;
      let canvas = document.createElement('canvas');
      canvas.width = me.width;
      canvas.height = me.height;
      let ctx = canvas.getContext('2d');
      if (ctx !== null) {
        // ctx.scale(2,2);
        ctx.drawImage(me, 0, 0);
        let dataUrl = canvas.toDataURL('image/png');
        if (dataUrl) {
          resolve({
            data: dataUrl,
            width: canvas.width,
            height: canvas.height
          });
        } else {
          reject('failed to get dataurl');
        }
      } else {
        reject('failed to create canvas');
      }
    };
    image.src = url;
  });
}

export function serialize(params) {
  return Object.keys(params)
    .map(p => `${p}=${encodeURIComponent(params[p].trim())}`)
    .join('&');
}
