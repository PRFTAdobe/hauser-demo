import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import { getMetadata } from '../../scripts/aem.js';
import { html } from '../../scripts/tools.js';
import { loadFragment } from '../fragment/fragment.js';
// Re-import after mocking, so the mocked version is used.
import decorateHeader, {
  createMobileMenu,
  focusNavSection,
  openOnKeydown,
  toggleMenu,
  updateBrandSection,
  updateLinksSection,
  updateToolsSection,
} from './header.js';

jest.mock('../../scripts/aem.js', () => {
  return {
    getMetadata: jest.fn(),
  };
});

jest.mock('../fragment/fragment.js', () => {
  return {
    loadFragment: jest.fn(),
  };
});

describe('decorateHeader', () => {
  // Create a stateful mock for the media query list
  const mockMql = {
    addEventListener(event, listener) {
      if (event === 'change') {
        if (!this.listeners.has(event)) {
          this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(listener);
      }
    },
    dispatchEvent(event) {
      if (event.type === 'change') {
        this.listeners.get('change')?.forEach((listener) => listener(this));
      }
    },
    listeners: new Map(),
    matches: true, // Start with desktop view
    media: '(min-width: 900px)',
    removeEventListener: jest.fn(),
  };
  // Mock for window.matchMedia that returns our stateful mock
  Object.defineProperty(window, 'matchMedia', {
    value: jest.fn().mockImplementation((query) => {
      if (query === '(min-width: 900px)') {
        return mockMql;
      }
      return { addEventListener: jest.fn(), matches: false };
    }),
    writable: true,
  });
  beforeEach(() => {
    // Reset mocks before each test
    getMetadata.mockClear();
    loadFragment.mockClear();
    // Set up a basic document body for each test
    document.body.innerHTML = '<header class="header"></header>';
  });
  it('should clear any existing content from the block', async () => {
    // Arrange: Add some initial content to the header
    const headerBlock = document.querySelector('.header');
    headerBlock.innerHTML = '<p>Initial Content</p>';

    // Arrange: Mock dependencies to allow the function to run
    const fragment = document.createElement('div');
    fragment.innerHTML = `<div><div class="default-content-wrapper"><p>Brand</p></div></div>`;
    loadFragment.mockResolvedValue(fragment);
    getMetadata.mockReturnValue('/nav');

    // Act: Run the decorator
    await decorateHeader(headerBlock);

    expect(headerBlock.querySelector('p').textContent).toEqual('Brand');
    expect(headerBlock.querySelector('.nav-wrapper')).not.toBeNull();
  });

  it('should load and decorate the navigation from a fragment', async () => {
    // Mock the fragment that loadFragment will return
    const fragment = document.createElement('div');
    fragment.innerHTML = `
        <div><div class="default-content-wrapper"><p><a href="/" class="button">Brand</a></p></div></div>
        <div><div class="default-content-wrapper"><ul><li><a href="/link1">Link 1</a></li></ul></div></div>
        <div><div class="default-content-wrapper"><p><span class="icon icon-search"></span></p></div></div>
      `;
    loadFragment.mockResolvedValue(fragment);
    getMetadata.mockReturnValue('/nav');

    const headerBlock = document.querySelector('.header');
    await decorateHeader(headerBlock);

    // Assert that the nav was created and structured correctly
    const nav = headerBlock.querySelector('nav');
    expect(nav).not.toBeNull();
    expect(nav.id).toBe('nav');
    expect(headerBlock.querySelector('.nav__section--brand')).not.toBeNull();
    expect(headerBlock.querySelector('.nav__section--links')).not.toBeNull();
    expect(headerBlock.querySelector('.nav__section--tools')).not.toBeNull();
    expect(headerBlock.querySelector('.nav__hamburger')).not.toBeNull();
  });

  it('should correctly handle sections with an empty default-content-wrapper', async () => {
    // Mock a fragment where the 'links' section has a wrapper, but it's empty
    const fragment = document.createElement('div');
    fragment.innerHTML = `
        <div><div class="default-content-wrapper"><p><a href="/" class="button">Brand</a></p></div></div>
        <div><div class="default-content-wrapper"></div></div>
        <div><div class="default-content-wrapper"><p><span class="icon icon-search"></span></p></div></div>
      `;
    loadFragment.mockResolvedValue(fragment);
    getMetadata.mockReturnValue('/nav');

    const headerBlock = document.querySelector('.header');
    await decorateHeader(headerBlock);

    // Assert that the nav was created
    const nav = headerBlock.querySelector('nav');
    expect(nav).not.toBeNull();

    // The section for 'links' should be created
    const linksSection = headerBlock.querySelector('.nav__section--links');
    expect(linksSection).not.toBeNull();

    // But it should be empty because its wrapper had no firstElementChild
    expect(linksSection.firstElementChild).toBeNull();
    expect(linksSection.innerHTML).toBe('');
  });

  it('should toggle the menu when the hamburger is clicked', async () => {
    // Arrange
    const fragment = document.createElement('div');
    fragment.innerHTML = `
        <div><div class="default-content-wrapper"><p>Brand</p></div></div>
        <div><div class="default-content-wrapper"><ul><li>Link</li></ul></div></div>
        <div><div class="default-content-wrapper"><p>Tools</p></div></div>
      `;
    loadFragment.mockResolvedValue(fragment);
    getMetadata.mockReturnValue('/nav');
    const headerBlock = document.querySelector('.header');

    // Act
    await decorateHeader(headerBlock);

    const nav = headerBlock.querySelector('nav');
    const hamburgerButton = headerBlock.querySelector('.nav__hamburger button');

    // Assert initial state
    expect(nav.getAttribute('aria-expanded')).toBe('false');

    // Act: Simulate click
    hamburgerButton.click();

    // Assert: Check for the effect of toggleMenu
    expect(nav.getAttribute('aria-expanded')).toBe('true');

    // Act: Click again
    hamburgerButton.click();

    // Assert: Check it toggles back
    expect(nav.getAttribute('aria-expanded')).toBe('false');
  });

  it('should adjust menu visibility on viewport change', async () => {
    // Arrange
    const fragment = document.createElement('div');
    fragment.innerHTML = `
        <div><div class="default-content-wrapper"><p>Brand</p></div></div>
        <div><div class="default-content-wrapper"><ul><li class="nav__link--with-children">Link</li></ul></div></div>
      `;
    loadFragment.mockResolvedValue(fragment);
    getMetadata.mockReturnValue('/nav');
    const headerBlock = document.querySelector('.header');

    mockMql.matches = true;
    await decorateHeader(headerBlock);
    const nav = headerBlock.querySelector('nav');

    expect(nav.getAttribute('aria-expanded')).toBe('false');

    mockMql.matches = false;
    mockMql.dispatchEvent(new Event('change'));

    expect(nav.getAttribute('aria-expanded')).toBe('false');

    mockMql.matches = true;
    mockMql.dispatchEvent(new Event('change'));

    expect(nav.getAttribute('aria-expanded')).toBe('true');
  });

  it('should toggle nav aria-expanded when nav__link is clicked in desktop view', async () => {
    const fragment = document.createElement('div');
    fragment.innerHTML = `
        <div><div class="default-content-wrapper"><p>Brand</p></div></div>
        <div><div class="default-content-wrapper"><ul><li class="nav__link--with-children">Link</li></ul></div></div>
      `;
    loadFragment.mockResolvedValue(fragment);
    getMetadata.mockReturnValue('/nav');
    const headerBlock = document.querySelector('.header');
    mockMql.matches = true;
    await decorateHeader(headerBlock);
    const nav = headerBlock.querySelector('nav');

    const listItem = nav.querySelector('.nav__link'); // Get one of the list items

    // Act
    listItem.click();

    // Assert
    expect(nav.getAttribute('aria-expanded')).toBe('true');

    // Act again to ensure it toggles back
    listItem.click();
    expect(nav.getAttribute('aria-expanded')).toBe('false');
  });
});

describe('updateBrandSection()', () => {
  it('should replace .button with .nav__brand', () => {
    const wrapper = document.createElement('div');
    const btn = document.createElement('button');
    btn.classList.add('button');
    wrapper.append(btn);
    const updated = updateBrandSection(wrapper);
    expect(updated.classList.contains('nav__brand')).toBe(true);
    expect(updated.classList.contains('button')).toBe(false);
  });

  it('should return block unchanged if no .button', () => {
    const wrapper = document.createElement('div');
    const unchanged = updateBrandSection(wrapper);
    expect(unchanged).toBe(wrapper);
  });
});

describe('updateLinksSection()', () => {
  let ul;

  beforeEach(() => {
    ul = document.createElement('ul');
    const li = document.createElement('li');
    li.textContent = 'Home';
    ul.append(li);
    const li2 = document.createElement('li');
    li2.classList.add('parent');
    const sub = document.createElement('ul');
    li2.append(document.createElement('span'));
    li2.append(sub);
    ul.append(li2);
  });

  it('should add nav__links class and nav__link classes', () => {
    const out = updateLinksSection(ul);
    expect(out.classList.contains('nav__links')).toBe(true);
    const lis = out.querySelectorAll('li');
    lis.forEach((li) => expect(li.classList.contains('nav__link')).toBe(true));
  });

  it('should add nav__link--with-children if li contains nested ul', () => {
    const out = updateLinksSection(ul);
    const parentLi = Array.from(out.querySelectorAll('li')).find((li) =>
      li.querySelector('ul'),
    );
    expect(parentLi.classList.contains('nav__link--with-children')).toBe(true);
    expect(parentLi.querySelector('ul').classList.contains('nav__links')).toBe(
      true,
    );
  });
});

describe('updateToolsSection()', () => {
  it('should wrap icon in nav__tools container', () => {
    const div = document.createElement('div');
    const icon = document.createElement('span');
    icon.classList.add('icon');
    div.append(icon);
    const out = updateToolsSection(div);
    expect(out !== div).toBe(true);
    expect(out.classList.contains('nav__tools')).toBe(true);
    expect(out.querySelector('.icon')).toBe(icon);
  });

  it('should return block unchanged if no .icon', () => {
    const div = document.createElement('div');
    const out = updateToolsSection(div);
    expect(out).toBe(div);
  });
});

describe('createMobileMenu()', () => {
  it('should render a .nav__hamburger with a button', () => {
    const menu = createMobileMenu();
    expect(menu.classList.contains('nav__hamburger')).toBe(true);
    const btn = menu.querySelector('button.nav__hamburger-button');
    expect(btn).toBeTruthy();
    expect(btn.getAttribute('aria-controls')).toBe('nav');
  });
});

describe('toggleMenu', () => {
  let isDesktop;
  let nav;
  let navSectionLinks;

  beforeEach(() => {
    document.body.innerHTML = `
        <nav id="nav" aria-expanded="false">
            <div class="nav__hamburger"><button></button></div>
            <div class="nav__section--links">
                <ul><li class="nav__link--with-children"></li></ul>
            </div>
        </nav>`;
    nav = document.getElementById('nav');
    navSectionLinks = nav.querySelector('.nav__section--links');
    isDesktop = window.matchMedia('(min-width: 900px)');
  });

  it('should expand the menu', () => {
    toggleMenu(nav, navSectionLinks, isDesktop);
    expect(nav.getAttribute('aria-expanded')).toBe('true');
    expect(document.body.style.overflowY).toBe('');
  });

  it('should collapse the menu', () => {
    nav.setAttribute('aria-expanded', 'true');
    toggleMenu(nav, navSectionLinks, isDesktop);
    expect(nav.getAttribute('aria-expanded')).toBe('false');
    expect(document.body.style.overflowY).toBe('');
  });

  it('should force the menu to be collapsed', () => {
    nav.setAttribute('aria-expanded', 'false');
    // forceExpanded = true means !forceExpanded is false
    toggleMenu(nav, navSectionLinks, isDesktop, false);
    expect(nav.getAttribute('aria-expanded')).toBe('false');
  });

  it('should force the menu to be expanded', () => {
    nav.setAttribute('aria-expanded', 'true');
    // forceExpanded = true means !forceExpanded is false
    toggleMenu(nav, navSectionLinks, isDesktop, true);
    expect(nav.getAttribute('aria-expanded')).toBe('true');
  });
});

describe('closeOnEscape', () => {
  let nav;
  let navSections;
  let isDesktopMock;

  // Helper to dispatch a keyboard event
  const dispatchEscape = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape' }));
  };

  beforeEach(() => {
    document.body.innerHTML = html`
      <nav id="nav" class="nav" aria-expanded="true">
        <div class="nav__hamburger">
          <button aria-label="Close navigation"></button>
        </div>
        <div class="nav__section nav__section--links">
          <ul class="nav__links">
            <li class="nav__link" aria-expanded="true">
              <a
                href="/tools/sidekick/library.html?plugin=blocks&amp;path=/block-collection/accordion&amp;index=0"
                title="Examples"
                >Examples</a
              >
            </li>
            <li class="nav__link">
              <a
                href="https://www.aem.live/developer/tutorial"
                title="Getting Started"
                >Getting Started</a
              >
            </li>
            <li class="nav__link">
              <a href="https://www.aem.live/docs/" title="Documentation"
                >Documentation</a
              >
            </li>
            <li class="nav__link">
              <a href="https://www.aem.live/docs/faq" title="FAQ">FAQ</a>
            </li>
          </ul>
        </div>
      </nav>
    `;
    nav = document.getElementById('nav');
    navSections = nav.querySelector('.nav__section--links');
    isDesktopMock = window.matchMedia('(min-width: 900px)'); // Use the mocked window.matchMedia
    jest.spyOn(nav, 'querySelector'); // Spy on querySelector to check focus
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should collapse an expanded nav section on desktop when Escape is pressed', () => {
    isDesktopMock.matches = true;
    const section1 = navSections.querySelector(
      '.nav__link[aria-expanded="true"]',
    );
    jest.spyOn(section1, 'focus'); // Spy on focus to ensure it's called

    dispatchEscape();

    expect(section1.getAttribute('aria-expanded')).toBe('false');
    expect(section1.focus).toHaveBeenCalled();
    expect(nav.getAttribute('aria-expanded')).toBe('true'); // Main nav should remain expanded on desktop
  });

  it('should close the entire nav on mobile when Escape is pressed', () => {
    isDesktopMock.matches = false;
    nav.setAttribute('aria-expanded', 'true'); // Ensure nav is open on mobile
    const hamburgerButton = nav.querySelector('button');
    jest.spyOn(hamburgerButton, 'focus');

    dispatchEscape();

    expect(nav.getAttribute('aria-expanded')).toBe('false');
    expect(document.body.style.overflowY).toBe(''); // Verify overflowY is reset
    expect(hamburgerButton.focus).toHaveBeenCalled();
  });

  it('should not do anything if no nav section is expanded on desktop', () => {
    isDesktopMock.matches = true;
    navSections
      .querySelector('.nav__link[aria-expanded="true"]')
      .setAttribute('aria-expanded', 'false');
    const section1 = navSections.querySelector('.nav__link');
    jest.spyOn(section1, 'focus');

    dispatchEscape();

    expect(
      navSections.querySelector('.nav__link[aria-expanded="true"]'),
    ).toBeNull();
    expect(section1.focus).not.toHaveBeenCalled();
    expect(nav.getAttribute('aria-expanded')).toBe('true'); // Main nav should remain expanded on desktop
  });

  it('should not do anything if nav is already closed on mobile', () => {
    isDesktopMock.matches = false;
    nav.setAttribute('aria-expanded', 'false');
    const hamburgerButton = nav.querySelector('button');
    jest.spyOn(hamburgerButton, 'focus');

    dispatchEscape();

    expect(nav.getAttribute('aria-expanded')).toBe('false');
    expect(hamburgerButton.focus).not.toHaveBeenCalled();
  });
});

describe('focusNavSection', () => {
  let mockActiveElement;

  beforeEach(() => {
    mockActiveElement = document.createElement('a');
    mockActiveElement.id = 'mockActiveElement';
    document.body.append(mockActiveElement);

    Object.defineProperty(document, 'activeElement', {
      configurable: true,
      value: mockActiveElement,
      writable: true,
    });

    jest.spyOn(mockActiveElement, 'addEventListener');
  });

  afterEach(() => {
    jest.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('should add a keydown event listener to the active element, calling openOnKeydown', () => {
    focusNavSection();
    expect(mockActiveElement.addEventListener).toHaveBeenCalledWith(
      'keydown',
      openOnKeydown,
    );
  });
});

describe('openOnKeydown', () => {
  let mockFocusedElement;
  let navSectionsContainer;

  beforeEach(() => {
    navSectionsContainer = document.createElement('div');
    navSectionsContainer.classList.add('nav__section--links');
    document.body.append(navSectionsContainer);

    mockFocusedElement = document.createElement('li');
    mockFocusedElement.classList.add('nav__link--with-children');
    mockFocusedElement.setAttribute('aria-expanded', 'false'); // Start collapsed
    navSectionsContainer.append(mockFocusedElement);

    Object.defineProperty(document, 'activeElement', {
      configurable: true,
      value: mockFocusedElement,
      writable: true,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('should expand the submenu when Enter is pressed on a collapsed nav__link--with-children', () => {
    const mockEvent = { code: 'Enter' };
    openOnKeydown(mockEvent);

    expect(mockFocusedElement.getAttribute('aria-expanded')).toBe('true');
  });

  it('should collapse the submenu when Enter is pressed on an expanded nav__link--with-children', () => {
    mockFocusedElement.setAttribute('aria-expanded', 'true'); // Start expanded
    const mockEvent = { code: 'Enter' };
    openOnKeydown(mockEvent);

    expect(mockFocusedElement.getAttribute('aria-expanded')).toBe('false');
  });

  it('should expand the submenu when Space is pressed on a collapsed nav__link--with-children', () => {
    const mockEvent = { code: 'Space' };
    openOnKeydown(mockEvent);

    expect(mockFocusedElement.getAttribute('aria-expanded')).toBe('true');
  });

  it('should collapse the submenu when Space is pressed on an expanded nav__link--with-children', () => {
    mockFocusedElement.setAttribute('aria-expanded', 'true'); // Start expanded
    const mockEvent = { code: 'Space' };
    openOnKeydown(mockEvent);

    expect(mockFocusedElement.getAttribute('aria-expanded')).toBe('false');
  });

  it('should do nothing if a non-Enter/Space key is pressed', () => {
    const mockEvent = { code: 'Tab' };
    openOnKeydown(mockEvent);

    expect(mockFocusedElement.getAttribute('aria-expanded')).toBe('false');
  });

  it('should do nothing if the focused element is not nav__link--with-children', () => {
    mockFocusedElement.classList.remove('nav__link--with-children');
    const mockEvent = { code: 'Enter' };
    openOnKeydown(mockEvent);

    expect(mockFocusedElement.getAttribute('aria-expanded')).toBe('false');
  });

  it('should handle case where focused element has no nav__section--links ancestor gracefully', () => {
    navSectionsContainer.removeChild(mockFocusedElement);
    document.body.append(mockFocusedElement);

    const mockEvent = { code: 'Enter' };
    openOnKeydown(mockEvent);

    expect(mockFocusedElement.getAttribute('aria-expanded')).toBe('true');
  });
});
