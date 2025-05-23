/* eslint-disable no-restricted-globals */
const extractElements = (block) => {
  const blockElements = block.querySelectorAll(':scope > div > div');
  return Array.from(blockElements).map((blockElement) => {
    const isRichText =
      blockElement.childNodes.length > 1 ||
      blockElement.querySelector(':scope > p').innerHTML !==
        blockElement.querySelector(':scope > p').innerText;
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

export { extractElements };
