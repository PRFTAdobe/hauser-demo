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
    const footerContent = document.createElement('div');
    footerContent.textContent = 'Footer Content';
    fragment.appendChild(footerContent);

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
    const fallbackContent = document.createElement('div');
    fallbackContent.textContent = 'Default Footer';
    fragment.appendChild(fallbackContent);

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
    fragment.appendChild(document.createElement('div'));
    loadFragment.mockResolvedValue(fragment);

    await decorateFooter(block);

    expect(block.querySelectorAll('p').length).toBe(0); // old child removed
    expect(block.querySelector('div')).not.toBeNull(); // new footer added
  });
});
