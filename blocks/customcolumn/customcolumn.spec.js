/**
 * @jest-environment jsdom
 */

import decorate from './custom-columns.js';

describe('custom-columns block', () => {
  let block;

  const createBlock = (attributes = {}) => {
    const block = document.createElement('div');
    block.classList.add('block', 'custom-columns');
    Object.entries(attributes).forEach(([key, value]) => {
      block.dataset[key] = value;
    });

    const row = document.createElement('div');
    block.appendChild(row);
    return { block, row };
  };

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('applies layout and custom class', () => {
    const { block } = createBlock({
      numColumns: '3',
      layout: 'full-width',
      customClass: 'with-border',
    });

    const row = document.createElement('div');
    block.append(row);

    decorate(block);

    expect(block.classList.contains('layout-full-width')).toBe(true);
    expect(block.classList.contains('with-border')).toBe(true);
    expect(block.classList.contains('columns-3-cols')).toBe(true);
  });

  test('generates fallback columns when fewer exist', () => {
    const { block, row } = createBlock({ numColumns: '2' });
    block.append(row);

    decorate(block);

    const columns = row.querySelectorAll('.custom-column');
    expect(columns.length).toBe(2);
    expect(columns[0].textContent).toContain('Column 1');
    expect(columns[1].textContent).toContain('Column 2');
  });

  test('does not overwrite existing authored columns', () => {
    const { block, row } = createBlock({ numColumns: '2' });

    const col1 = document.createElement('div');
    col1.textContent = 'Authored 1';
    const col2 = document.createElement('div');
    col2.textContent = 'Authored 2';
    row.append(col1, col2);
    block.append(row);

    decorate(block);

    const columns = row.querySelectorAll('.custom-column');
    expect(columns.length).toBe(2);
    expect(columns[0].textContent).toContain('Authored 1');
    expect(columns[1].textContent
