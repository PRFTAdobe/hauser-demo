import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import decorateFooter from './footer.js';

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

describe('decorateFooter', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  it('loads footer from metadata-specified path and appends it to block', async () => {
    // Arrange
    const block = document.createElement('div');
    document.body.appendChild(block);

    getMetadata.mockReturnValue('/custom-footer');

    const fragment = document.createElement('main');
    const section0 = document.createElement('div');
    section0.classList.add('section');
    section0.textContent = 'Brand Section';
    fragment.appendChild(section0);

    const section1 = document.createElement('div');
    section1.classList.add('section');
    const defaultContentWrapper = document.createElement('div');
    defaultContentWrapper.classList.add('default-content-wrapper');
    const footerContent = document.createElement('p');
    footerContent.textContent = 'Footer Content';
    defaultContentWrapper.appendChild(footerContent);
    section1.appendChild(defaultContentWrapper);
    fragment.appendChild(section1);

    loadFragment.mockResolvedValue(fragment);

    // Act
    await decorateFooter(block);

    // Assert
    expect(getMetadata).toHaveBeenCalledWith('footer');
    expect(loadFragment).toHaveBeenCalledWith('/custom-footer');
    expect(block.querySelector('div')).not.toBeNull();
    expect(block.textContent).toContain('Footer Content');
  });

  it('loads footer from default path when no metadata is present', async () => {
    const block = document.createElement('div');
    document.body.appendChild(block);

    getMetadata.mockReturnValue('');

    const fragment = document.createElement('main');
    const section0 = document.createElement('div');
    section0.classList.add('section');
    fragment.appendChild(section0);

    const section1 = document.createElement('div');
    section1.classList.add('section');
    const defaultContentWrapper = document.createElement('div');
    defaultContentWrapper.classList.add('default-content-wrapper');
    const fallbackContent = document.createElement('p');
    fallbackContent.textContent = 'Default Footer';
    defaultContentWrapper.appendChild(fallbackContent);
    section1.appendChild(defaultContentWrapper);
    fragment.appendChild(section1);

    loadFragment.mockResolvedValue(fragment);

    await decorateFooter(block);

    expect(loadFragment).toHaveBeenCalledWith('/footer');
    expect(block.textContent).toContain('Default Footer');
  });

  it('clears existing children from block before appending footer', async () => {
    const block = document.createElement('div');
    block.appendChild(document.createElement('p')); // existing child

    getMetadata.mockReturnValue('');
    const fragment = document.createElement('main');
    const section0 = document.createElement('div');
    section0.classList.add('section');
    fragment.appendChild(section0);

    const section1 = document.createElement('div');
    section1.classList.add('section');
    const defaultContentWrapper = document.createElement('div');
    defaultContentWrapper.classList.add('default-content-wrapper');
    section1.appendChild(defaultContentWrapper);
    fragment.appendChild(section1);

    loadFragment.mockResolvedValue(fragment);

    await decorateFooter(block);

    expect(block.querySelectorAll('p').length).toBe(0); // old child removed
    expect(block.querySelector('div')).not.toBeNull(); // new footer added
  });
});
