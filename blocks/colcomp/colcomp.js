import { extractElements } from '../../scripts/tools.js';

const decorateColcomp = (block) => {
  const blockElements = extractElements(block, ['text', 'text']);
  while (block.firstChild) {
    block.removeChild(block.firstChild);
  }
  const [rows, colWidth] = blockElements;

  if (rows || colWidth) {
    block.append(rows || '');
    block.append(colWidth || '');
  } else {
    block.insertAdjacentHTML('beforeend', '<p>Colcomp Component</p>');
  }
};

export default decorateColcomp;
