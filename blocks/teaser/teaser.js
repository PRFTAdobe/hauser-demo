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

  if (includeCallToAction) {
    const teaserActionContainer = document.createElement('div');
    teaserActionContainer.classList.add('teaser__action-container');

    if (callToActionOneLink && callToActionOneText) {
      const callToActionOneLinkElement = callToActionOneLink.querySelector('a');
      if (callToActionOneLinkElement) {
        callToActionOneLinkElement.target = callToActionOneTarget || '_self';
        callToActionOneLinkElement.title = callToActionOneText;
        callToActionOneLinkElement.classList.add('teaser__action-link');
        callToActionOneLinkElement.textContent = callToActionOneText;
        teaserActionContainer.append(callToActionOneLinkElement);
      }
    }

    if (callToActionTwoLink && callToActionTwoText) {
      const callToActionTwoLinkElement = callToActionTwoLink.querySelector('a');
      if (callToActionTwoLinkElement) {
        callToActionTwoLinkElement.target = callToActionTwoTarget || '_self';
        callToActionTwoLinkElement.title = callToActionTwoText;
        callToActionTwoLinkElement.classList.add('teaser__action-link');
        callToActionTwoLinkElement.textContent = callToActionTwoText;
        teaserActionContainer.append(callToActionTwoLinkElement);
      }
    }
    teaserContent.append(teaserActionContainer);
    block.append(teaserContent);
  } else if (link && link.firstElementChild) {
    const linkElement = link.querySelector('a');
    linkElement.target = linkTarget || '_self';
    while (linkElement.firstChild) {
      linkElement.removeChild(linkElement.firstChild);
    }
    linkElement.classList.add('teaser__link');
    linkElement.append(teaserContent);
    block.append(linkElement);
  }

  if (image && image.firstElementChild) {
    image.classList.add('teaser__media');
    block.classList.add('teaser--with-media');
    const teaserImages = image.querySelectorAll('img');
    Array.from(teaserImages).forEach((teaserImage) => {
      teaserImage.classList.add('teaser__image');
    });
    block.append(image);
  }

  const teaserParagraphs = block.querySelectorAll('p');
  Array.from(teaserParagraphs).forEach((teaserParagraph) => {
    teaserParagraph.classList.add('teaser__paragraph');
  });
};

export default decorateTeaser;
