import { describe, expect, it } from '@jest/globals';

import decorateSampleBlock from './sample-block.js';

describe('decorateSampleBlock', () => {
  it('should decorate the block correctly with heading and text', () => {
    document.body.innerHTML =
      '<div class="sample-block block" data-block-name="sample-block"><div><div><h2 id="sample-block">Sample Block</h2></div></div><div><div><p>Lorem ipsum dolor sit amet.</p></div></div></div>';

    const block = document.querySelector('.sample-block');
    decorateSampleBlock(block);
    expect(block.outerHTML).toBe(
      '<div class="sample-block block" data-block-name="sample-block"><h2 id="sample-block">Sample Block</h2><div class="rich-text"><p>Lorem ipsum dolor sit amet.</p></div></div>',
    );
  });
  it('should show default text when heading and text are empty', () => {
    document.body.innerHTML =
      '<div class="sample-block block" data-block-name="sample-block"><div><div></div></div><div><div></div></div></div>';

    const block = document.querySelector('.sample-block');
    decorateSampleBlock(block);
    expect(block.outerHTML).toBe(
      '<div class="sample-block block" data-block-name="sample-block"><p>Sample Block Component</p></div>',
    );
  });
});
