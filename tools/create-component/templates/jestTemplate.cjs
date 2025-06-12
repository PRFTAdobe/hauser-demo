const javaScriptTemplate = ({ kebabCase, pascalCase, uppercase }) => {
  return `import { describe, expect, it } from '@jest/globals';

import decorate${pascalCase} from './${kebabCase}.js';

describe('decorate${pascalCase}', () => {
  it('should decorate the block correctly with heading and text', () => {
    document.body.innerHTML =
      '<div class="${kebabCase} block" data-block-name="${kebabCase}"><div><div><h2 id="${kebabCase}">${uppercase}</h2></div></div><div><div><p>Lorem ipsum dolor sit amet.</p></div></div></div>';

    const block = document.querySelector('.${kebabCase}');
    decorate${pascalCase}(block);
    expect(block.outerHTML).toBe(
      '<div class="${kebabCase} block" data-block-name="${kebabCase}"><h2 id="${kebabCase}">${uppercase}</h2><div><p>Lorem ipsum dolor sit amet.</p></div></div>',
    );
  });
  it('should show default text when heading and text are empty', () => {
    document.body.innerHTML =
      '<div class="${kebabCase} block" data-block-name="${kebabCase}"><div><div></div></div><div><div></div></div></div>';

    const block = document.querySelector('.${kebabCase}');
    decorate${pascalCase}(block);
    expect(block.outerHTML).toBe(
      '<div class="${kebabCase} block" data-block-name="${kebabCase}"><p>${uppercase} Component</p></div>',
    );
  });
});
`;
};

// eslint-disable-next-line no-undef
module.exports = javaScriptTemplate;
