import { beforeEach, describe, expect, it } from '@jest/globals';

import decorateColumns from './columns.js';

describe('decorateColumns', () => {
  let block;

  beforeEach(() => {
    // Reset the DOM before each test
    document.body.innerHTML = '';
    block = document.createElement('div');
    const row = document.createElement('div');
    block.appendChild(row);
  });

  it('should add a class based on number of columns', () => {
    const row = block.firstElementChild;

    const col1 = document.createElement('div');
    const col2 = document.createElement('div');
    row.appendChild(col1);
    row.appendChild(col2);

    decorateColumns(block);

    expect(block.classList.contains('columns-2-cols')).toBe(true);
  });

  it('should add columns__image-column class if picture is only content in a column', () => {
    const row = block.firstElementChild;
    const col = document.createElement('div');
    const picture = document.createElement('picture');
    col.appendChild(picture);
    row.appendChild(col);

    decorateColumns(block);

    expect(col.classList.contains('columns__image-column')).toBe(true);
  });

  it('should not add image-column class if picture is not only child', () => {
    const row = block.firstElementChild;
    const col = document.createElement('div');
    const picture = document.createElement('picture');
    const extra = document.createElement('p');
    col.appendChild(picture);
    col.appendChild(extra);
    row.appendChild(col);

    decorateColumns(block);

    expect(col.classList.contains('columns__image-column')).toBe(false);
  });

  it('should handle blocks with multiple rows and columns', () => {
    // Add second row
    const row2 = document.createElement('div');
    const col1 = document.createElement('div');
    const col2 = document.createElement('div');
    const pic = document.createElement('picture');
    col2.appendChild(pic);
    row2.appendChild(col1);
    row2.appendChild(col2);
    block.appendChild(row2);

    // First row with one column
    const col0 = document.createElement('div');
    block.firstElementChild.appendChild(col0);

    decorateColumns(block);

    expect(block.classList.contains('columns-1-cols')).toBe(true);
    expect(col2.classList.contains('columns__image-column')).toBe(true);
  });
});
