import { extractElements } from '../../scripts/tools.js';

const decorateCarousel = async (block) => {
  const carouselItems = [...block.children];
  while (block.firstChild) {
    block.removeChild(block.firstChild);
  }

  block.append(addNavigationButton('&#8249;', 'previous'));
  block.append(addNavigationButton('&#8250;', 'next'));

  const carouselSlideContainer = document.createElement('ul');
  carouselSlideContainer.classList.add('carousel__slides');
  carouselItems.forEach((carouselItem) => {
    console.log(carouselItem);
    const slide = document.createElement('li');
    slide.classList.add('carousel__slide');

    const carouselElements = carouselItem.querySelectorAll(':scope > div');
    const [picture, title, description] = Array.from(
      carouselElements,
      (carouselElement) => extractElements(carouselElement),
    );
    if (picture) {
      console.log('Here!');
      picture.classList.add('carousel__picture');
      slide.append(picture);
    }
    const carouselCaption = document.createElement('div');
    carouselCaption.classList.add('carousel__caption');
    const carouselCaptionContent = document.createElement('div');
    carouselCaptionContent.append(title);
    carouselCaptionContent.append(description);
    carouselCaptionContent.classList.add('carousel__caption-content');
    carouselCaption.append(carouselCaptionContent);
    slide.append(carouselCaption);
    carouselSlideContainer.append(slide);
  });
  block.append(carouselSlideContainer);
};

const addNavigationButton = (text, direction) => {
  const button = document.createElement('button');
  button.classList.add('carousel__arrow', `carousel__arrow--${direction}`);
  button.innerHTML = text;
  button.addEventListener('click', () => {
    const carousel = button.closest('.carousel');
    const carouselSlideContainer = carousel.querySelector('.carousel__slides');
    if (direction === 'previous') {
      carouselSlideContainer.scrollLeft -= carouselSlideContainer.clientWidth;
    } else {
      carouselSlideContainer.scrollLeft += carouselSlideContainer.clientWidth;
    }
  });
  return button;
};

export default decorateCarousel;
