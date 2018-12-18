const chalk = require('chalk');
const fs = require("fs-extra");

module.exports = config => {
    console.log(`${chalk.green(`init project to ${config.appPath}`)}`);
    fs.copy(config.templatePath, config.appPath)
        .then(() => console.log('success!'))
        .catch(err => console.error(err))
}