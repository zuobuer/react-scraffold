const chalk = require('chalk');
const fs = require("fs-extra");

module.exports = config => {
    console.log(`${chalk.green("start init project...")}`);
    fs.copy(config.templatePath, './')
        .then(() => console.log('success!'))
        .catch(err => console.error(err))
}