import { extractElements } from '../../scripts/tools.js';

const decorateSampleBlock = (block) => {
  const blockElements = extractElements(block);
  while (block.firstChild) {
    block.removeChild(block.firstChild);
  }
  const [heading, text] = blockElements;

  if (heading || text) {
    block.append(heading || '');
    block.append(text || '');
  } else {
    block.insertAdjacentHTML('beforeend', '<p>Sample Block Component</p>');
  }
};

export default decorateSampleBlock;
