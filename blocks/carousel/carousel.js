import { readBlockConfig } from '../../scripts/aem.js';

const decorateCarousel = async (block) => {
  const carouselItems = [...block.children];
  carouselItems.forEach((item) => {
    console.log(readBlockConfig(item));
  });
};

export default decorateCarousel;
