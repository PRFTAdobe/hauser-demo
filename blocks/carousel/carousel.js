import { readBlockConfig } from '../../scripts/aem.js';

const decorateCarousel = async (block) => {
  console.log(readBlockConfig(block));
  block.classList.add(...['booyah']);
};

export default decorateCarousel;
