/* eslint-disable import/no-extraneous-dependencies,no-undef */
const pvCreateComponentConfig = require('@pro-vision/pv-create-component/config.js');

const cssTemplate = require('./templates/cssTemplate.cjs');
const jsTemplate = require('./templates/jsTemplate.cjs');
const xWalkTemplate = require('./templates/xWalkTemplate.cjs');

const BLOCKS_DIR = 'blocks';

const updateConfigByIdentifier = (config, newItem) => {
  const index = config.findIndex((item) => item.id === newItem.id);
  if (index !== -1) {
    // Replace existing item
    config[index] = newItem;
  } else {
    // If not found, optionally add the new item
    config.push(newItem);
  }
  return config;
};

const nameItem = {
  id: 'NAME',
  prompt: {
    filter(name) {
      return name.trim().toLowerCase().replace(/ ( )+/g, ' ');
    },
    message: "What's the block's name?:",
    name: 'name',
    type: 'input',
    validate(value) {
      // only letters and numbers. (no special characters such as '-' and '_')
      const pass = value.match(/(^[a-zA-Z0-9 ]+$)/g);
      if (pass) {
        return true;
      }

      return 'Please enter only letters, numbers and spaces';
    },
  },
};

const typeItem = {
  id: 'TYPE',
  prompt: {
    choices: ['Block'],
    message: 'What type of component should it be?:',
    name: 'type',
    type: 'list',
  },
};

const javaScriptItem = {
  files: [
    {
      id: 'JS-FILE',
      path: (options) =>
        `${BLOCKS_DIR}/${options.kebabCase}/${options.kebabCase}.js`,
      template: jsTemplate,
    },
  ],
  id: 'TS',
};

let config = updateConfigByIdentifier(pvCreateComponentConfig, nameItem);
config = updateConfigByIdentifier(config, typeItem);
config = updateConfigByIdentifier(config, javaScriptItem);
config.push({
  files: [
    {
      id: 'CSS-FILE',
      path: (options) =>
        `${BLOCKS_DIR}/${options.kebabCase}/${options.kebabCase}.css`,
      template: cssTemplate,
    },
  ],
  id: 'CSS',
});
config.push({
  files: [
    {
      id: 'XWALK-FILE',
      path: (options) =>
        `${BLOCKS_DIR}/${options.kebabCase}/_${options.kebabCase}.json`,
      template: xWalkTemplate,
    },
  ],
  id: 'XWALK',
});

module.exports = config;
