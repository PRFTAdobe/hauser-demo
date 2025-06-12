import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import decorateCards from './cards.js';

jest.mock('../../scripts/aem.js', () => {
  return {
    createOptimizedPicture: jest.fn(),
  };
});

jest.mock('../../scripts/scripts.js', () => {
  return {
    moveInstrumentation: jest.fn(),
  };
});

describe('decorateCards', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  it('transforms block children into a list of cards', () => {
    // Arrange
    const block = document.createElement('div');

    const row1 = document.createElement('div');
    const div1 = document.createElement('div');
    const picture1 = document.createElement('picture');
    const img1 = document.createElement('img');
    img1.src = '/test.jpg';
    img1.alt = 'Test image';
    picture1.appendChild(img1);
    div1.appendChild(picture1);
    row1.appendChild(div1);

    const row2 = document.createElement('div');
    const div2 = document.createElement('div');
    const content = document.createTextNode('Some content');
    div2.appendChild(content);
    row2.appendChild(div2);

    block.appendChild(row1);
    block.appendChild(row2);

    // Mock createOptimizedPicture return
    const mockOptimizedPic = document.createElement('picture');
    const mockOptimizedImg = document.createElement('img');
    mockOptimizedImg.classList.add('card__image');
    mockOptimizedPic.appendChild(mockOptimizedImg);
    createOptimizedPicture.mockReturnValue(mockOptimizedPic);

    // Act
    decorateCards(block);

    // Assert
    const ul = block.querySelector('ul.cards__unordered-list');
    expect(ul).not.toBeNull();
    const cards = ul.querySelectorAll('li.card');
    expect(cards.length).toBe(2);
    expect(moveInstrumentation).toHaveBeenCalledTimes(3); // 2 li + 1 optimized img

    const cardMedia = ul.querySelector('.card__media');
    const cardContent = ul.querySelector('.card__content');
    expect(cardMedia).not.toBeNull();
    expect(cardContent).not.toBeNull();

    expect(createOptimizedPicture).toHaveBeenCalledWith(
      'http://localhost/test.jpg',
      'Test image',
      false,
      [{ width: '750' }],
    );

    expect(mockOptimizedImg.classList.contains('card__image')).toBe(true);
  });
});
