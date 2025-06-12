import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { fetchPlaceholders } from '../../scripts/placeholders.js';
import decorateCarousel, { updateActiveSlide } from './carousel.js';

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
    let scrollSpy = jest
      .spyOn(Element.prototype, 'scrollTo')
      .mockImplementation(() => {});

    block.dataset.activeSlide = '0';
    nextBtn.click();

    expect(scrollSpy).toHaveBeenCalled();
    scrollSpy.mockRestore();

    const nextPrevious = block.querySelector('.slide-prev');
    scrollSpy = jest
      .spyOn(Element.prototype, 'scrollTo')
      .mockImplementation(() => {});

    block.dataset.activeSlide = '0';
    nextPrevious.click();

    expect(scrollSpy).toHaveBeenCalled();
    scrollSpy.mockRestore();
  });

  it('should call observer on each carousel slide', async () => {
    const observeMock = jest.fn();
    window.IntersectionObserver = jest.fn(() => {
      return {
        observe: observeMock,
      };
    });

    const block = document.createElement('div');
    for (let i = 0; i < 2; i++) {
      const slide = document.createElement('div');
      slide.innerHTML = `<div><img src="img-${i}.jpg" /></div><div><h2 id="heading-${i}">Slide ${i}</h2></div>`;
      block.appendChild(slide);
    }

    await decorateCarousel(block);

    const slides = block.querySelectorAll('.carousel__slide');
    expect(observeMock).toHaveBeenCalledTimes(slides.length);
  });

  it('should wrap around to first slide if index >= slide count', async () => {
    Element.prototype.scrollTo = jest.fn();
    const block = document.createElement('div');
    for (let i = 0; i < 2; i++) {
      const slide = document.createElement('div');
      slide.innerHTML = `<div><img src="img-${i}.jpg" /></div><div><h2 id="heading-${i}">Slide ${i}</h2><a href="#">Link</a></div>`;
      block.appendChild(slide);
    }

    await decorateCarousel(block);

    block.dataset.activeSlide = '1';
    const nextBtn = block.querySelector('.slide-next');
    nextBtn.click(); // This will call showSlide with index 2, which is >= slides.length

    expect(Element.prototype.scrollTo).toHaveBeenCalled();
  });

  it('should update slide visibility and indicator states correctly', async () => {
    const block = document.createElement('div');
    for (let i = 0; i < 2; i++) {
      const slide = document.createElement('div');
      slide.innerHTML = `<div><img src="img-${i}.jpg" /></div><div><h2 id="heading-${i}">Slide ${i}</h2><a href="#">Link</a></div>`;
      block.appendChild(slide);
    }

    await decorateCarousel(block);
    block.classList.add('carousel');

    const slides = block.querySelectorAll('.carousel__slide');
    const indicators = block.querySelectorAll('.carousel__indicator');

    // Simulate IntersectionObserver activating second slide
    const secondSlide = slides[1];
    updateActiveSlide(secondSlide);

    // mimic what updateActiveSlide would do
    slides.forEach((slide, i) => {
      expect(slide.getAttribute('aria-hidden')).toBe(
        i === 1 ? 'false' : 'true',
      );
    });

    indicators.forEach((ind, i) => {
      const btn = ind.querySelector('button');
      expect(btn.hasAttribute('disabled')).toBe(i === 1);
    });
  });
});
