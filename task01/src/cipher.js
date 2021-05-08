const { Transform } = require('stream');
const { StringDecoder } = require('string_decoder');

class TransformCaesarCipher extends Transform {
  constructor(props) {
    super(props);
    this.shift = props.shift;
    this._sign = props.action === 'encode' ? 1 : -1;
    this._decoder = new StringDecoder('utf-8');
    // this._upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    // this._lower = "abcdefghijklmnopqrstuvwxyz";
  }

  _transform(chunk, encoding, callback) {
    if (encoding === 'buffer') {
      chunk = this._decoder.write(chunk);
    }

    chunk = this.passingAlphabet(chunk);

    callback(null, `${chunk}\n`);
  }

  _cipherCharByCode = (max, min, code) => {
    const calculatedShift = this.shift >= 26 ? this.shift % 26 : this.shift;
      const rest = code + (calculatedShift * this._sign);
      if (this._sign > 0 && rest > max) {
        return min + (rest - max)
      } else if (this._sign < 0 && rest < min){
        return max - (min - rest);
      } else {
        return rest;
      }
  }

  checkChar(char) {
    if (typeof char !== 'string') return char;
    const code = char.charCodeAt(0);
    if (code < 65 || code > 91 && code < 97 || code > 122) {
      return char;
    } else {
      return code >= 65 && code <= 91
          ? this._cipherCharByCode(91, 65, code)
          : this._cipherCharByCode(122, 97, code);
    }
  }

  // checkChar(char) {
  //   if (!this._upper.includes(char) && !this._lower.includes(char)) {
  //     return char;
  //   } else {
  //     const source = this._upper.includes(char) ? this._upper : this._lower;
  //     const step = this.shift % 26;
  //     const direction = this._sign === 0 ? step : step * this._sign;
  //     return source[source.indexOf(char) + direction];
  //   }
  // }

  passingAlphabet(str) {
    const inData = str.split('');
    const result = inData.map((chr) => this.checkChar(chr));
    return result.join('');
  }
}

module.exports = TransformCaesarCipher;