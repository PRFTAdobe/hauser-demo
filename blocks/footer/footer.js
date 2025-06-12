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
  while (fragment.firstElementChild) {
    footer.append(fragment.firstElementChild);
  }

  block.append(footer);
};

export default decorateFooter;
