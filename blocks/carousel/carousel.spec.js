import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { fetchPlaceholders } from '../../scripts/placeholders.js';
import decorateCarousel from './carousel.js';

jest.mock('../../scripts/placeholders.js', () => {
  return {
    fetchPlaceholders: jest.fn(),
  };
});

beforeEach(() => {
  document.body.innerHTML = '';
  fetchPlaceholders.mockResolvedValue({
    carousel: 'Test Carousel',
    carouselSlideControls: 'Test Controls',
    nextSlide: 'Next',
    of: 'of',
    previousSlide: 'Previous',
    showSlide: 'Show Slide',
  });

  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;
});

describe('decorate the carousel', () => {
  it('should decorate a carousel block with a single slide', async () => {
    const block = document.createElement('div');
    const slide = document.createElement('div');
    slide.innerHTML =
      '<div><img src="image.jpg" /></div><div><h2 id="title">Title</h2><p>Content</p></div>';
    block.appendChild(slide);

    await decorateCarousel(block);

    expect(block.getAttribute('role')).toBe('region');
    expect(block.getAttribute('aria-roledescription')).toBe('Test Carousel');
    expect(block.querySelector('.carousel__slides-container')).toBeTruthy();
    expect(block.querySelector('.carousel__slide')).toBeTruthy();
    expect(
      block.querySelector('.carousel__slide').getAttribute('aria-labelledby'),
    ).toBe('title');
    expect(block.querySelector('.carousel__indicators')).toBeFalsy(); // no indicators for single slide
  });

  it('should decorate a carousel block with multiple slides and create navigation', async () => {
    const block = document.createElement('div');

    for (let i = 0; i < 3; i++) {
      const slide = document.createElement('div');
      slide.innerHTML = `<div><img src="img-${i}.jpg" /></div><div><h2 id="heading-${i}">Slide ${i}</h2></div>`;
      block.appendChild(slide);
    }

    await decorateCarousel(block);

    const indicators = block.querySelectorAll('.carousel__indicator');
    expect(indicators.length).toBe(3);

    const prevBtn = block.querySelector('.slide-prev');
    const nextBtn = block.querySelector('.slide-next');

    expect(prevBtn).toBeTruthy();
    expect(prevBtn.getAttribute('aria-label')).toBe('Previous');
    expect(nextBtn.getAttribute('aria-label')).toBe('Next');
  });

  it('should bind indicator buttons to showSlide', async () => {
    Element.prototype.scrollTo = () => {};
    const block = document.createElement('div');

    for (let i = 0; i < 2; i++) {
      const slide = document.createElement('div');
      slide.innerHTML = `<div><img src="img-${i}.jpg" /></div><div><h2 id="heading-${i}">Slide ${i}</h2></div>`;
      block.appendChild(slide);
    }

    await decorateCarousel(block);

    const indicators = block.querySelectorAll('.carousel__indicator button');
    expect(indicators.length).toBe(2);

    const scrollSpy = jest
      .spyOn(Element.prototype, 'scrollTo')
      .mockImplementation(() => {});

    indicators[1].click();

    expect(scrollSpy).toHaveBeenCalled();
    scrollSpy.mockRestore();
  });

  it('should cycle slides with next and previous buttons', async () => {
    const block = document.createElement('div');

    for (let i = 0; i < 2; i++) {
      const slide = document.createElement('div');
      slide.innerHTML = `<div><img src="img-${i}.jpg" /></div><div><h2 id="heading-${i}">Slide ${i}</h2></div>`;
      block.appendChild(slide);
    }

    await decorateCarousel(block);

    const nextBtn = block.querySelector('.slide-next');
    const scrollSpy = jest
      .spyOn(Element.prototype, 'scrollTo')
      .mockImplementation(() => {});

    block.dataset.activeSlide = '0';
    nextBtn.click();

    expect(scrollSpy).toHaveBeenCalled();
    scrollSpy.mockRestore();
  });
});
