const fs = require('fs-extra');
const stringify = require('json-stable-stringify-without-jsonify');
const union = require('lodash.union');
const importFresh = require('import-fresh');
// const path = require('path');

class Conf {
  static wSite (config, filePath = '.site.js', cover = true) {
    if (!cover) {
      const oldConfig = Conf.rSite(filePath);
      if (oldConfig && oldConfig.template && config.template) config.template = union(oldConfig.template, config.template);
    }
    const content = `module.exports = ${stringify(config, { space: 4 })};`;
    fs.writeFileSync(filePath, content, 'utf8');
  }

  static rSite (filePath = '.site.js') {
    try {
      fs.accessSync(filePath, fs.constants.F_OK);
    } catch (error) {
      return null;
    }
    return importFresh(filePath);
  }

  static rEnv (filePath = '.env') {
    try {
      fs.accessSync(filePath, fs.constants.F_OK);
    } catch (error) {
      return null;
    }
    return require('dotenv').config({ path: filePath });
  }

  static wEnv (config, filePath = '.env', cover = true) {
    let str = '';
    for (let key in config) {
      str += `${key}=${config[key]}\n`;
    }
    if (!cover) fs.appendFileSync(filePath, str, 'utf8');
    else fs.writeFileSync(filePath, str, 'utf8');
  }

  static getEnvs (envPathList = []) {
    let envConfig = {};
    for (let filePath of envPathList) {
      const obj = Conf.rEnv(filePath);
      if (obj && obj.parsed) Object.assign(envConfig, obj.parsed);
    }
    return envConfig;
  }

}
module.exports = Conf;
