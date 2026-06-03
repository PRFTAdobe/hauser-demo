import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
const decorateFooter = async (block) => {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta
    ? new URL(footerMeta, window.location).pathname
    : '/footer';
  const fragment = await loadFragment(footerPath);

  while (block.firstChild) {
    block.removeChild(block.firstChild);
  }
  const footer = document.createElement('div');
  const linkSection = fragment.querySelectorAll('.section')[1];
  const defaultContentWrapper = linkSection.querySelector(
    '.default-content-wrapper',
  );
  Array.from(defaultContentWrapper.children).forEach((child) => {
    if (child.id) {
      console.info(child);
    }
  });
  console.info(linkSection);
  while (fragment.firstElementChild) {
    console.info('fragment', fragment.firstElementChild);
    footer.append(fragment.firstElementChild);
  }

  block.append(footer);
};

export default decorateFooter;
