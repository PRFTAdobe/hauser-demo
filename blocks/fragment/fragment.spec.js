/* eslint-disable no-undef */
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import { loadSections } from '../../scripts/aem.js';
import { decorateMain } from '../../scripts/scripts.js';
import decorateFragment, { loadFragment } from './fragment.js';

// Mock dependencies
jest.mock('../../scripts/aem.js', () => {
  return {
    loadSections: jest.fn(),
  };
});

jest.mock('../../scripts/scripts.js', () => {
  return {
    decorateMain: jest.fn(),
  };
});

describe('loadFragment', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns null for invalid path', async () => {
    const result = await loadFragment('');
    expect(result).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('fetches and returns parsed HTML content on success', async () => {
    const htmlContent = '<div class="section"><p>Test Fragment</p></div>';
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: jest.fn().mockResolvedValue(htmlContent),
    });

    const result = await loadFragment('/test/path');
    expect(fetch).toHaveBeenCalledWith('/test/path.plain.html');
    expect(decorateMain).toHaveBeenCalled();
    expect(loadSections).toHaveBeenCalled();
    expect(result).not.toBeNull();
    expect(result.querySelector('p').textContent).toBe('Test Fragment');
  });

  it('returns null on fetch failure', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
    });

    const result = await loadFragment('/bad/path');
    expect(fetch).toHaveBeenCalledWith('/bad/path.plain.html');
    expect(result).toBeNull();
  });
});

describe('decorateFragment', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('decorates a fragment block with content from a link', async () => {
    const block = document.createElement('div');
    block.innerHTML = '<a href="/fragment/path">Fragment</a>';
    const fragmentHTML = '<div class="section test-class"><p>Hello</p></div>';

    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: jest.fn().mockResolvedValue(fragmentHTML),
    });

    await decorateFragment(block);

    expect(fetch).toHaveBeenCalledWith('/fragment/path.plain.html');
    expect(block.querySelector('p').textContent).toBe('Hello');
    expect(block.classList.contains('test-class')).toBe(true);
  });

  it('does not modify block if fragment loading fails', async () => {
    const block = document.createElement('div');
    block.textContent = '/broken/path';

    global.fetch.mockResolvedValueOnce({ ok: false });

    await decorateFragment(block);
    expect(fetch).toHaveBeenCalledWith('/broken/path.plain.html');
    expect(block.innerHTML).toBe('/broken/path');
  });
});
