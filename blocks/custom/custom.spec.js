import { describe, expect, it } from '@jest/globals';

import decorateCustom from './custom.js';

describe('decorateCustom', () => {
  it('should decorate the block correctly with heading and text', () => {
    document.body.innerHTML =
      '<div class="custom block" data-block-name="custom"><div><div><h2 id="custom">Custom</h2></div></div><div><div><p>Lorem ipsum dolor sit amet.</p></div></div></div>';

    const block = document.querySelector('.custom');
    decorateCustom(block);
    expect(block.outerHTML).toBe(
      '<div class="custom block" data-block-name="custom"><h2 id="custom">Custom</h2><div><p>Lorem ipsum dolor sit amet.</p></div></div>',
    );
  });
  it('should show default text when heading and text are empty', () => {
    document.body.innerHTML =
      '<div class="custom block" data-block-name="custom"><div><div></div></div><div><div></div></div></div>';

    const block = document.querySelector('.custom');
    decorateCustom(block);
    expect(block.outerHTML).toBe(
      '<div class="custom block" data-block-name="custom"><p>Custom Component</p></div>',
    );
  });
});
