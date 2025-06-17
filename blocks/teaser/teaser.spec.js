/**
 * @jest-environment jsdom
 */
import { describe, expect, jest, test } from '@jest/globals';

// Import the functions we are testing
import decorateTeaser from './teaser.js';

// We only need to provide a dummy implementation for the `html` utility function,
// as its source code is not provided. The `extractElements` function will be the real one.
jest.mock('../../scripts/tools.js', () => {
  return {
    ...jest.requireActual('../../scripts/tools.js'), // Import and retain the original extractElements
    html: (strings, ...values) => {
      return strings.map((string, i) => `${string}${values[i] || ''}`).join('');
    },
  };
});

describe('decorateTeaser', () => {
  // This function sets up the DOM with the provided HTML structure
  const setupDOM = (html) => {
    document.body.innerHTML = html;
    return document.querySelector('.teaser');
  };

  // The realistic HTML for the teaser block
  const initialBlockHTML = `
    <div class="teaser block" data-block-name="teaser" data-block-status="loaded">
      <div>
        <div><p>Pretitle</p></div>
      </div>
      <div>
        <div>
          <h2 id="teaser-title">Teaser Title</h2>
        </div>
      </div>
      <div>
        <div><p>Teaser Description</p></div>
      </div>
      <div>
        <div>
          <picture>
            <source type="image/webp" srcset="./media_1.jpg?width=750&format=webply&optimize=medium">
            <img loading="lazy" alt="Lava flowing into the ocean" src="./media_1.jpg?width=750&format=jpg&optimize=medium">
          </picture>
        </div>
      </div>
      <div>
        <div><p>true</p></div>
      </div>
      <div>
        <div><p><a href="https://example.com/main-link">Main Link</a></p></div>
      </div>
      <div>
        <div>_self</div>
      </div>
      <div>
        <div><p><a href="https://example.com/cta-one">CTA One</a></p></div>
      </div>
      <div>
        <div>_blank</div>
      </div>
      <div>
        <div><p>First Action</p></div>
      </div>
      <div>
        <div><p><a href="https://example.com/cta-two">CTA Two</a></p></div>
      </div>
      <div>
        <div></div>
      </div>
      <div>
        <div><p>Second Action</p></div>
      </div>
    </div>
  `;

  // Test case 1: Test with 'includeCallToAction' set to true
  test('should correctly decorate a teaser with two CTAs from realistic HTML', () => {
    const block = setupDOM(initialBlockHTML);

    // Call the function to be tested
    decorateTeaser(block);

    // Assertions for the content
    const content = block.querySelector('.teaser__content');
    expect(content).not.toBeNull();
    expect(block.querySelector('.teaser__pretitle').textContent).toBe(
      'Pretitle',
    );
    expect(block.querySelector('.teaser__title').textContent).toBe(
      'Teaser Title',
    );
    expect(block.querySelector('.teaser__description p').textContent).toBe(
      'Teaser Description',
    );
    // Check that the p tag inside description also gets the correct class
    expect(
      block.querySelector('.teaser__description .teaser__paragraph'),
    ).not.toBeNull();

    // Assertions for the action container and buttons
    const actionContainer = block.querySelector('.teaser__action-container');
    expect(actionContainer).not.toBeNull();

    const ctaLinks = actionContainer.querySelectorAll('.teaser__action-link');
    expect(ctaLinks.length).toBe(2);

    // Check CTA 1
    expect(ctaLinks[0].href).toBe('https://example.com/cta-one');
    expect(ctaLinks[0].textContent).toBe('First Action');
    expect(ctaLinks[0].title).toBe('First Action');
    expect(ctaLinks[0].target).toBe('_blank');

    // Check CTA 2
    expect(ctaLinks[1].href).toBe('https://example.com/cta-two');
    expect(ctaLinks[1].textContent).toBe('Second Action');
    expect(ctaLinks[1].title).toBe('Second Action');
    expect(ctaLinks[1].target).toBe('_self'); // Defaults to _self as its source cell was empty

    // Assertions for the media
    const media = block.querySelector('.teaser__media');
    expect(media).not.toBeNull();
    expect(block.classList.contains('teaser--with-media')).toBe(true);
    expect(media.querySelector('.teaser__image').alt).toBe(
      'Lava flowing into the ocean',
    );
  });

  // Test case 2: Test with 'includeCallToAction' set to false
  test('should wrap the teaser content in a single link when includeCallToAction is false', () => {
    const block = setupDOM(initialBlockHTML);

    // Modify the DOM to simulate 'includeCallToAction' being false
    const booleanCell = block.querySelectorAll(':scope > div > div')[4];
    booleanCell.textContent = 'false';

    // Call the function
    decorateTeaser(block);

    // The main block itself should now be a link
    const mainLink = block.querySelector('.teaser__link');
    expect(mainLink).not.toBeNull();
    expect(mainLink.tagName).toBe('A');
    expect(mainLink.href).toBe('https://example.com/main-link');
    expect(mainLink.target).toBe('_self');

    // There should be no separate action container
    expect(block.querySelector('.teaser__action-container')).toBeNull();

    // The content should be inside the main link
    const content = mainLink.querySelector('.teaser__content');
    expect(content).not.toBeNull();
    expect(content.querySelector('.teaser__title').textContent).toBe(
      'Teaser Title',
    );
  });

  // Test case 3: Handles missing title by using document.title
  test('should use document.title when a title element is not provided', () => {
    const block = setupDOM(initialBlockHTML);
    document.title = 'Default Page Title';

    // Remove the title element from the DOM
    const titleRow = block.querySelector('#teaser-title');
    titleRow.remove();

    // Re-run decoration
    decorateTeaser(block);

    const titleElement = block.querySelector('.teaser__title');
    expect(titleElement).not.toBeNull();
    expect(titleElement.textContent.trim()).toBe('Default Page Title');
  });
});
