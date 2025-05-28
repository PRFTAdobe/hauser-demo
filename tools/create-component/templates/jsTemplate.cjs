const javaScriptTemplate = ({ pascalCase, uppercase }) => {
  return `import { extractElements } from '../../scripts/tools.js';

const decorate${pascalCase} = (block) => {
  const blockElements = extractElements(block, [0, 1]);
  while (block.firstChild) {
    block.removeChild(block.firstChild);
  }
  const [heading, text] = blockElements;

  if (heading || text) {
    block.append(heading || '');
    block.append(text || '');
  } else {
    block.insertAdjacentHTML('beforeend', '<p>${uppercase} Component</p>');
  }
};

export default decorate${pascalCase};
`;
};

// eslint-disable-next-line no-undef
module.exports = javaScriptTemplate;
