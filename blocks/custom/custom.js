import { extractElements } from '../../scripts/tools.js';

const decorateCustom = (block) => {
  const blockElements = extractElements(block, ['html', 'html']);
  while (block.firstChild) {
    block.removeChild(block.firstChild);
  }
  const [heading, text] = blockElements;

  if (
    (heading && heading.firstElementChild) ||
    (text && text.firstElementChild)
  ) {
    block.append(heading.firstElementChild || '');
    block.append(text || '');
  } else {
    block.insertAdjacentHTML('beforeend', '<p>Custom Component</p>');
  }
};

export default decorateCustom;
