const decorateCarousel = async (block) => {
  const carouselItems = [...block.children];
  while (block.firstChild) {
    block.removeChild(block.firstChild);
  }
  carouselItems.forEach((item) => {
    console.log(item);
  });
};

export default decorateCarousel;
