/* eslint-disable no-undef,import/no-extraneous-dependencies,no-console */
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

const updateSectionFilter = (filePath, componentName) => {
  try {
    // Read file
    const fullPath = path.resolve(filePath);
    const data = fs.readFileSync(fullPath, 'utf-8');
    const json = JSON.parse(data);

    // Modify data
    const sectionFilter = json.filters.find(
      (filter) => filter.id === 'section',
    );
    if (sectionFilter && !sectionFilter.components.includes(componentName)) {
      sectionFilter.components.push(componentName);
      sectionFilter.components.sort();
    }

    // Write updated JSON back to file
    fs.writeFileSync(fullPath, JSON.stringify(json, null, 2), 'utf-8');
    console.log(
      `${chalk.green(`✓ ${componentName}`)} added successfully to ${chalk.green(
        `✓ ${filePath}`,
      )}!`,
    );
  } catch (error) {
    console.log(
      `${chalk.red(`✓ ${componentName}`)} added not added to ${chalk.red(
        `✓ ${filePath}`,
      )}`,
      error,
    );
  }
};

module.exports = updateSectionFilter;
