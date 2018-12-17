const chalk = require('chalk');
const fs = require("fs-extra");

module.exports = (config) => {
    console.log(`${chalk.green("start add a view...")}`);
    const projectSrcPath = `./src/views/${config.viewname}/`;
    Promise.all([
        fs.createFile(projectSrcPath + 'index.js'),
        fs.createFile(projectSrcPath +  'style.scss'),
    ])
    .then(() => console.log("add view success"))
    .catch(err => console.error(err))
}