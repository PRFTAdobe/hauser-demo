/* eslint-disable no-restricted-globals */
const extractElements = (block, richTextItems = []) => {
  const blockElements = block.querySelectorAll(':scope > div > div');
  return Array.from(blockElements).map((blockElement, index) => {
    const isRichText = richTextItems.includes(index);
    const text = blockElement.textContent.trim();
    if (text === 'true' || text === 'false') {
      return text === 'true';
    }
    if (!isNaN(text)) {
      return Number(text);
    }

    if (isRichText) {
      blockElement.classList.add('rich-text');
      return blockElement;
    }

    const textAsDate = text.replace('T00:00:00.000Z', ' 12:00:00 UTC');
    if (!isNaN(Date.parse(textAsDate))) {
      return new Date(textAsDate);
    }
    return text;
  });
};

const html = (strings, ...values) => String.raw({ raw: strings }, ...values);

export { extractElements, html };
