import { extractElements } from '../../scripts/tools.js';

const decorateHelloBlock = (block) => {
  const blockElements = extractElements(block);
  while (block.firstChild) {
    block.removeChild(block.firstChild);
  }
  const [heading, text] = blockElements;

  console.log(heading);
  console.log(text);

  if (heading && text) {
    block.append(heading);
    block.append(text);
  } else {
    block.insertAdjacentHTML('beforeend', '<p>Hello Block Component</p>');
  }
};

export default decorateHelloBlock;
