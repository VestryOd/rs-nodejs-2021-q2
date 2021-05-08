const { pipeline } = require('stream');
const fs = require('fs');
const TransformCaesarCipher = require('./TransformCaesarCipher');
const { paramsErrors, filesErrors } = require('./constants');
const { resolve } = require('path');

class AppTool {
  constructor(props) {
    this.checkProps(props);
    this.shift = parseInt(props.shift, 10);
    this.input = props.input;
    this.output = props.output;
    this.action = props.action;
  }

  checkProps(props) {
    if (!props.shift || props.shift <= 0 || typeof props.shift !== 'number') {
      throw `${paramsErrors.shift}`;
    }
    if (!props.action || (props.action !== 'encode' && props.action !== 'decode')) {
      throw `${paramsErrors.action}`;
    }
    if (props.input && typeof props.input !== 'string') {
      throw `${paramsErrors.input}`;
    }
    if (props.output && typeof props.output !== 'string') {
      throw `${paramsErrors.output}`;
    }
  }

  render() {

    Promise.all([
      new Promise((res, rej) => {
        this.input
        ? fs.access(this.input, fs.constants.F_OK, (err) => {
          if (err) {
            throw `${filesErrors.input}`
          } else res();
        })
        : res();
      }), 
      new Promise((res, rej) => {
        this.output
        ? fs.access(this.output, fs.constants.F_OK, (err) => {
          if (err) {
            throw `${filesErrors.output}`
          } else res();
        })
        : res();
      }),
    ])
    .then(
      () => pipeline(
        this.input ? fs.createReadStream(this.input) : process.stdin,
        new TransformCaesarCipher({
          shift: this.shift,
          action: this.action
        }),
        this.output
          ? fs.createWriteStream(this.output, { flags: 'a' })
          : process.stdout,
        err => {
          if (err) {
            throw new Error(err);
          }
        }
      )
    )
    .catch((err) => {
      throw error;
    })

    
  }
};

module.exports = AppTool;