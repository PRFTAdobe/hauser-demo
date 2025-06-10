import { getMetadata } from '../../scripts/aem.js';
import { html } from '../../scripts/tools.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
const decorateHeader = async (block) => {
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

  const navSectionBrand = nav.querySelector('.nav__section--brand');
  if (navSectionBrand && navSectionBrand.firstElementChild) {
    navSectionBrand.firstElementChild.replaceWith(
      updateBrandSection(navSectionBrand.firstElementChild),
    );
  }

  const navSectionLinks = nav.querySelector('.nav__section--links');
  if (navSectionLinks && navSectionLinks.firstElementChild) {
    navSectionLinks.firstElementChild.replaceWith(
      updateLinksSection(navSectionLinks.firstElementChild),
    );
  }

  const navSectionTools = nav.querySelector('.nav__section--tools');
  if (navSectionTools && navSectionTools.firstElementChild) {
    navSectionTools.firstElementChild.replaceWith(
      updateToolsSection(navSectionTools.firstElementChild),
    );
  }

  const mobileMenu = createMobileMenu();
  mobileMenu.addEventListener('click', () => toggleMenu(nav, navSectionLinks));
  nav.prepend(mobileMenu);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSectionLinks, isDesktop.matches);
  isDesktop.addEventListener('change', () =>
    toggleMenu(nav, navSectionLinks, isDesktop.matches),
  );

  const navWrapper = document.createElement('div');
  navWrapper.classList.add('nav-wrapper');
  navWrapper.append(nav);

  block.append(navWrapper);
};

const updateBrandSection = (block) => {
  const brandButton = block.querySelector('.button');
  if (brandButton) {
    brandButton.classList.remove('button');
    brandButton.classList.add('nav__brand');
    return brandButton;
  }
  return block;
};

const updateLinksSection = (block) => {
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

const updateToolsSection = (block) => {
  const icon = block.querySelector('.icon');
  if (icon) {
    const navTools = document.createElement('div');
    navTools.classList.add('nav__tools');
    navTools.append(icon);
    return navTools;
  }
  return block;
};

const createMobileMenu = () => {
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

const closeOnEscape = (event) => {
  if (event.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector(
      '[aria-expanded="true"]',
    );
    if (navSectionExpanded && isDesktop.matches) {
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
};

const closeOnFocusLost = (event) => {
  const nav = event.currentTarget;
  if (!nav.contains(event.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector(
      '[aria-expanded="true"]',
    );
    if (navSectionExpanded && isDesktop.matches) {
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      toggleMenu(nav, navSections, false);
    }
  }
};

const focusNavSection = () => {
  document.activeElement.addEventListener('keydown', openOnKeydown);
};

const openOnKeydown = (event) => {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav__link--with-children';
  if (isNavDrop && (event.code === 'Enter' || event.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';

    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
};

/**
 * Toggles all nav sections
 * @param {Element} navElement The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
const toggleAllNavSections = (navElement, expanded = false) => {
  navElement.querySelectorAll('.nav-link').forEach((link) => {
    link.setAttribute('aria-expanded', expanded.toString());
  });
};

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSectionLinks The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
const toggleMenu = (nav, navSectionLinks, forceExpanded = null) => {
  const expanded =
    forceExpanded !== null
      ? !forceExpanded
      : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav__hamburger button');
  document.body.style.overflowY = expanded || isDesktop.matches ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSectionLinks, !(expanded || isDesktop.matches));
  button.setAttribute(
    'aria-label',
    expanded ? 'Open navigation' : 'Close navigation',
  );
  // enable nav dropdown keyboard accessibility
  const navLinkWithChildren = navSectionLinks.querySelectorAll(
    '.nav__link--with-children',
  );
  if (isDesktop.matches) {
    navLinkWithChildren.forEach((navLink) => {
      if (!navLink.hasAttribute('tabindex')) {
        navLink.setAttribute('tabindex', 0);
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
