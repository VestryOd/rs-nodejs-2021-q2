const { Transform } = require('stream');
const { StringDecoder } = require('string_decoder');
const { alphabet } = require('./constants');
const { minLowercase, maxLowercase, minUppercase, maxUppercase } = alphabet;

class TransformCaesarCipher extends Transform {
  constructor(props) {
    super(props);
    this.shift = props.shift;
    this._sign = props.action === 'encode' ? 1 : -1;
    this._decoder = new StringDecoder('utf-8');
  }

  _transform(chunk, encoding, callback) {
    if (encoding === 'buffer') {
      chunk = this._decoder.write(chunk);
    }

    chunk = this.passingAlphabet(chunk);

    callback(null, `${chunk}\n`);
  }

  _cipherCharByCode(max, min, code) {
    const calculatedShift = this.shift >= alphabet.length
        ? this.shift % alphabet.length
        : this.shift;
      const rest = code + (calculatedShift * this._sign);
      let encoded = '';
      if (this._sign > 0 && rest > max) {
        encoded = min + (rest - max)
      } else if (this._sign < 0 && rest < min){
        encoded = max - (min - rest);
      } else {
        encoded = rest;
      }
      return String.fromCharCode(encoded);
  }

  checkChar(char) {
    if (typeof char !== 'string') return char;
    const code = char.charCodeAt(0);
    if (code < minLowercase || code > maxLowercase && code < minUppercase || code > maxUppercase) {
      return char;
    } else {
      return code >= minLowercase && code <= maxLowercase
          ? this._cipherCharByCode(maxLowercase, minLowercase, code)
          : this._cipherCharByCode(maxUppercase, minUppercase, code);
    }
  }

  passingAlphabet(str) {
    const inData = str.split('');
    const result = inData.map((chr) => this.checkChar(chr));
    return result.join('');
  }
}

module.exports = TransformCaesarCipher;