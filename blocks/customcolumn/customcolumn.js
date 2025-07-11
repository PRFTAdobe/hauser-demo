export default function decorate(block) {
  const numCols = parseInt(block.dataset.numColumns || 1, 10);
  const layout = block.dataset.layout;
  const customClass = block.dataset.customClass;

  // Add layout and custom class
  if (layout) block.classList.add(`layout-${layout}`);
  if (customClass) block.classList.add(customClass);
  block.classList.add(`columns-${numCols}-cols`);

  // Get child columns (already authored via UE)
  const row = block.firstElementChild;
  const cols = row ? [...row.children] : [];

  // Add fallback columns if less than required (only for initial state)
  while (cols.length < numCols) {
    const col = document.createElement('div');
    col.innerHTML = `<p>Column ${cols.length + 1}</p>`;
    row.append(col);
    cols.push(col);
  }

  // Optionally wrap row in container
  row?.classList.add('custom-columns-row');
  cols.forEach((col) => col.classList.add('custom-column'));
}
