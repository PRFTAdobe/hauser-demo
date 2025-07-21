/* eslint-disable no-restricted-globals */
const extractElements = (block, elementTypes = []) => {
  const blockElements = block.querySelectorAll(':scope > div > div');
  return Array.from(blockElements).map((blockElement, index) => {
    const type = elementTypes[index]; // Get the type for the current element
    const text = blockElement.textContent.trim();

    switch (type) {
      case 'boolean':
        return text === 'true';
      case 'date': {
        const textAsDate = text.replace('T00:00:00.000Z', ' 12:00:00 UTC');
        return !isNaN(Date.parse(textAsDate)) ? new Date(textAsDate) : null;
      }
      case 'html':
        return blockElement;
      case 'multiText':
        return text.split(',');
      case 'number':
        return text && !isNaN(text) ? Number(text) : 0;
      case 'text':
      default:
        return text;
    }
  });
};

const registerSvgIcons = () => {
  const inAnIframe = window.self !== window.top;
  const svgIcons = html`
    <div style="display: none;">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        id="Instagram"
        viewBox="0 0 39 39"
      >
        <path
          d="M31.48 37.5H7.52c-3.32 0-6.01-2.7-6.02-6.02V7.52c0-3.31 2.7-6.02 6.02-6.02h23.96c3.31 0 6.02 2.71 6.02 6.02v23.96c0 3.32-2.68 6.01-6 6.02z"
          fill="#ffffff"
          stroke="#000712"
          stroke-width="3"
        />
        <path
          d="M12.54 26.04c1.74 1.74 4.06 2.7 6.53 2.7s4.77-.96 6.53-2.7a9.15 9.15 0 0 0 2.7-6.53c0-2.45-.97-4.8-2.7-6.53a9.15 9.15 0 0 0-6.53-2.7c-2.47 0-4.79.96-6.53 2.7a9.15 9.15 0 0 0-2.7 6.53c0 2.47.96 4.79 2.7 6.53ZM30.1 9.96c.98 0 1.77-.79 1.77-1.77s-.79-1.77-1.77-1.77-1.77.79-1.77 1.77.79 1.77 1.77 1.77Z"
          fill="#ffffff"
          stroke="#000712"
          stroke-width="3"
        />
      </svg>
    </div>
  `;

  document.body.insertAdjacentHTML('afterbegin', svgIcons);
  if (inAnIframe) {
    window.parent.document.body.insertAdjacentHTML('afterbegin', svgIcons);
  }
};

const html = (strings, ...values) => String.raw({ raw: strings }, ...values);

export { extractElements, html, registerSvgIcons };
