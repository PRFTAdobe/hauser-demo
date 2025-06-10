import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const decorateCards = (block) => {
  const blockElements = [...block.children];
  while (block.firstChild) {
    block.removeChild(block.firstChild);
  }
  const ul = document.createElement('ul');
  ul.classList.add('cards__unordered-list');
  blockElements.forEach((row) => {
    const li = document.createElement('li');
    li.classList.add('card');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture'))
        div.classList.add('card__media');
      else div.classList.add('card__content');
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
      { width: '750' },
    ]);
    const optimizedImage = optimizedPic.querySelector('img');
    optimizedImage.classList.add('card__image');
    moveInstrumentation(img, optimizedImage);
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.append(ul);
};

export default decorateCards;
