import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { extractElements } from '../../scripts/tools.js';
import decorateHero from './hero.js';

jest.mock('../../scripts/tools.js', () => {
  return {
    extractElements: jest.fn(),
  };
});

describe('decorateHero', () => {
  let block;
  let pictureWrapper;
  let headingWrapper;
  let img;
  let heading;

  beforeEach(() => {
    // Set up a mock block
    block = document.createElement('div');

    // Create mock structure for extractElements
    pictureWrapper = document.createElement('div');
    const picture = document.createElement('picture');
    img = document.createElement('img');
    picture.appendChild(img);
    pictureWrapper.appendChild(picture);

    headingWrapper = document.createElement('div');
    heading = document.createElement('h1');
    heading.textContent = 'Hero Heading';
    headingWrapper.appendChild(heading);

    // Mock extractElements to return our stubs
    extractElements.mockReturnValue([pictureWrapper, headingWrapper]);

    // Simulate original children (which will be removed)
    block.appendChild(document.createElement('div'));
  });

  it('should remove all existing children from the block', () => {
    decorateHero(block);
    expect(block.children.length).toBe(2); // Only picture and heading should be appended
  });

  it('should add correct classes to hero image and heading', () => {
    decorateHero(block);

    expect(img.classList.contains('hero__image')).toBe(true);
    expect(heading.classList.contains('hero__heading')).toBe(true);
  });

  it('should add correct class to hero picture wrapper', () => {
    decorateHero(block);

    const heroPicture = block.querySelector('picture');
    expect(heroPicture.classList.contains('hero__media')).toBe(true);
  });

  it('should append picture and heading in correct order', () => {
    decorateHero(block);

    const [first, second] = block.children;
    expect(first.tagName.toLowerCase()).toBe('picture');
    expect(second.tagName.toLowerCase()).toMatch(/^h[1-6]$/);
  });
});
