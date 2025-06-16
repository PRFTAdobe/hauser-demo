/* eslint-disable no-unused-vars */
import { extractElements, html } from '../../scripts/tools.js';

const decorateTeaser = (block) => {
  const blockElements = extractElements(block, [
    'text',
    'html',
    'html',
    'html',
    'boolean',
    'html',
    'text',
    'html',
    'text',
    'text',
    'html',
    'text',
    'text',
  ]);
  while (block.firstChild) {
    block.removeChild(block.firstChild);
  }
  const [
    pretitle,
    title,
    description,
    image,
    includeCallToAction,
    link,
    linkTarget,
    callToActionOneLink,
    callToActionOneTarget,
    callToActionOneText,
    callToActionTwoLink,
    callToActionTwoTarget,
    callToActionTwoText,
  ] = blockElements;

  const teaserContent = document.createElement('div');
  teaserContent.classList.add('teaser__content');

  if (pretitle) {
    const pretitleElement = document.createElement('p');
    pretitleElement.classList.add('teaser__pretitle');
    pretitleElement.textContent = pretitle;
    teaserContent.append(pretitleElement);
  }

  if (title && title.firstElementChild) {
    const titleElement = title.firstElementChild;
    titleElement.classList.add('teaser__title');
    teaserContent.append(titleElement);
  } else {
    teaserContent.innerHTML = html` <h2 class="teaser__title">
      ${document.title}
    </h2>`;
  }

  if (description && description.firstElementChild) {
    description.classList.add('teaser__description');
    teaserContent.append(description);
  }

  block.append(teaserContent);

  const teaserParagraphs = block.querySelectorAll('p');
  Array.from(teaserParagraphs).forEach((teaserParagraph) => {
    teaserParagraph.classList.add('teaser__paragraph');
  });
};

export default decorateTeaser;
