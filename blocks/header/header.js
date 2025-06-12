import { getMetadata } from '../../scripts/aem.js';
import { html } from '../../scripts/tools.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
const decorateHeader = async (block) => {
  // media query match that indicates mobile/tablet width
  const isDesktop = window.matchMedia('(min-width: 900px)');
  while (block.firstChild) {
    block.removeChild(block.firstChild);
  }

  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.classList.add('nav');
  while (fragment.firstElementChild) {
    nav.append(fragment.firstElementChild);
  }

  const classNames = ['brand', 'links', 'tools'];
  classNames.forEach((className, index) => {
    const section = nav.children[index];
    const navSection = document.createElement('div');
    navSection.classList.add('nav__section', `nav__section--${className}`);
    if (section) {
      const defaultContentWrapper = section.querySelector(
        '.default-content-wrapper',
      );
      if (defaultContentWrapper && defaultContentWrapper.firstElementChild) {
        navSection.append(defaultContentWrapper.firstElementChild);
      }

      section.replaceWith(navSection);
    }
  });

  const mobileMenu = createMobileMenu();

  const navSectionBrand = nav.querySelector('.nav__section--brand');
  if (navSectionBrand && navSectionBrand.firstElementChild) {
    navSectionBrand.firstElementChild.replaceWith(
      updateBrandSection(navSectionBrand.firstElementChild),
    );
  }

  const navSectionLinks = nav.querySelector('.nav__section--links');
  if (navSectionLinks && navSectionLinks.firstElementChild) {
    navSectionLinks.firstElementChild.replaceWith(
      updateLinksSection(navSectionLinks.firstElementChild, isDesktop),
    );

    mobileMenu.addEventListener('click', () =>
      toggleMenu(nav, navSectionLinks, isDesktop),
    );

    toggleMenu(nav, navSectionLinks, isDesktop, isDesktop.matches);
    isDesktop.addEventListener('change', () =>
      toggleMenu(nav, navSectionLinks, isDesktop, isDesktop.matches),
    );
  }

  const navSectionTools = nav.querySelector('.nav__section--tools');
  if (navSectionTools && navSectionTools.firstElementChild) {
    navSectionTools.firstElementChild.replaceWith(
      updateToolsSection(navSectionTools.firstElementChild),
    );
  }

  nav.prepend(mobileMenu);
  nav.setAttribute('aria-expanded', 'false');

  const navWrapper = document.createElement('div');
  navWrapper.classList.add('nav-wrapper');
  navWrapper.append(nav);

  block.append(navWrapper);
};

/**
 * Updates the brand section
 * @param block
 * @returns updated brand section
 */
export const updateBrandSection = (block) => {
  const brandButton = block.querySelector('.button');
  if (brandButton) {
    brandButton.classList.remove('button');
    brandButton.classList.add('nav__brand');
    return brandButton;
  }
  return block;
};

/**
 * Updates the link section
 * @param block
 * @param isDesktop
 * @returns updated link section
 */
export const updateLinksSection = (block, isDesktop) => {
  if (block) {
    block.classList.add('nav__links');
    const listItems = block.querySelectorAll('li');
    Array.from(listItems).forEach((listItem) => {
      listItem.classList.add('nav__link');
      const childUnorderedList = listItem.querySelector('ul');
      if (childUnorderedList) {
        childUnorderedList.classList.add('nav__links');
        listItem.classList.add('nav__link--with-children');
      }
      listItem.addEventListener('click', () => {
        if (isDesktop.matches) {
          const nav = block.closest('.nav');
          const expanded = nav.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(nav);
          nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
  }
  return block;
};

/**
 * Updates the tools section
 * @param block
 * @returns updated tools section
 */
export const updateToolsSection = (block) => {
  const icon = block.querySelector('.icon');
  if (icon) {
    const navTools = document.createElement('div');
    navTools.classList.add('nav__tools');
    navTools.append(icon);
    return navTools;
  }
  return block;
};

/**
 * Creates the Hamburger/Mobile menu
 * @returns {HTMLDivElement}
 */
export const createMobileMenu = () => {
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav__hamburger');
  hamburger.innerHTML = html` <button
    type="button"
    aria-controls="nav"
    aria-label="Open navigation"
    class="nav__hamburger-button"
  >
    <span class="nav__hamburger-icon"></span>
  </button>`;
  return hamburger;
};

/**
 * Closes Nav on Escape Keyboard Event
 * @param event
 */
export const closeOnEscape = (event) => {
  const isDesktop = window.matchMedia('(min-width: 900px)');
  if (event.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav__section--links');
    const navSectionExpanded = navSections.querySelector(
      '[aria-expanded="true"]',
    );
    if (navSectionExpanded && isDesktop.matches) {
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      toggleMenu(nav, navSections, isDesktop);
      nav.querySelector('button').focus();
    }
  }
};

/**
 * Closes Nav on FocusLost
 * @param event
 */
export const closeOnFocusLost = (event) => {
  const isDesktop = window.matchMedia('(min-width: 900px)');
  const nav = event.currentTarget;
  if (!nav.contains(event.relatedTarget)) {
    const navSections = nav.querySelector('.nav__section--links');
    const navSectionExpanded = navSections.querySelector(
      '[aria-expanded="true"]',
    );
    if (navSectionExpanded && isDesktop.matches) {
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      toggleMenu(nav, navSections, isDesktop, false);
    }
  }
};

/**
 * Adds Open on Keydown event listener to the active element
 */
export const focusNavSection = () => {
  document.activeElement.addEventListener('keydown', openOnKeydown);
};

/**
 * Opens Submenu on 'Enter' or 'Space' key
 * @param event
 */
export const openOnKeydown = (event) => {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav__link--with-children';
  if (isNavDrop && (event.code === 'Enter' || event.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';

    const navSectionLinks = focused.closest('.nav__section--links');
    if (navSectionLinks) {
      toggleAllNavSections(navSectionLinks);
    }
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
};

/**
 * Toggles all nav sections
 * @param {Element} navElement The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
export const toggleAllNavSections = (navElement, expanded = false) => {
  navElement.querySelectorAll('.nav__link').forEach((link) => {
    link.setAttribute('aria-expanded', expanded.toString());
  });
};

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSectionLinks The nav sections within the container element
 * @param isDesktop
 * @param {*} forceExpanded Optional param to force nav to expand behavior when not null
 */
export const toggleMenu = (
  nav,
  navSectionLinks,
  isDesktop,
  forceExpanded = null,
) => {
  const expanded =
    forceExpanded !== null
      ? !forceExpanded
      : nav.getAttribute('aria-expanded') === 'true';
  document.body.style.overflowY = expanded || isDesktop.matches ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSectionLinks, !(expanded || isDesktop.matches));
  const button = nav.querySelector('.nav__hamburger button');
  if (button) {
    button.setAttribute(
      'aria-label',
      expanded ? 'Open navigation' : 'Close navigation',
    );
  }
  // enable nav dropdown keyboard accessibility
  const navLinkWithChildren = navSectionLinks.querySelectorAll(
    '.nav__link--with-children',
  );
  if (isDesktop.matches) {
    navLinkWithChildren.forEach((navLink) => {
      if (!navLink.hasAttribute('tabindex')) {
        navLink.setAttribute('tabindex', '0');
        navLink.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navLinkWithChildren.forEach((navLink) => {
      navLink.removeAttribute('tabindex');
      navLink.removeEventListener('focus', focusNavSection);
    });
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
};

export default decorateHeader;
