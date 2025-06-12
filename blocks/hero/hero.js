import { extractElements } from '../../scripts/tools.js';

const decorateHero = (block) => {
  const blockElements = extractElements(block, ['html', 'html']);
  while (block.firstChild) {
    block.removeChild(block.firstChild);
  }
  const [picture, heading] = blockElements;
  const heroPicture = picture.firstElementChild;
  heroPicture.classList.add('hero__media');

  const heroImage = heroPicture.querySelector('img');
  heroImage.classList.add('hero__image');
  block.append(heroPicture);

  const heroHeading = heading.firstElementChild;
  heroHeading.classList.add('hero__heading');
  block.append(heroHeading);
};

export default decorateHero;
