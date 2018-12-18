const chalk = require('chalk');
const fs = require("fs-extra");

module.exports = ({ name, componentsPath }) => {

    const cPath = `${componentsPath}/${name}`;
    if (fs.existsSync(cPath)) {
        console.log(`${chalk.green(name)} ${chalk.red(`component already exist`)}`);
        return;
    }
    console.log(`${chalk.white("start add a sfc component, locate at ", `${cPath}/index.js`)}`);

    const indexContent = `
import React from 'react';

import './style.scss';

export default ({})=>{
    return <div className='com-${name}-root'>
            ${name} sfc component
    </div>
};

`
    // append page root css class
    const cssContent = `
.com-${name}-root{

}
`
    Promise.all([
        fs.createFile(cPath + '/index.js'),
        fs.createFile(cPath + '/style.scss'),
    ])
        .then(() => {
            return Promise.all([
                fs.appendFile(cPath + '/index.js', indexContent),
                fs.appendFile(cPath + '/style.scss', cssContent)
            ])
        })
        .then(() => {
            console.log(`${chalk.green("add react stateless function component (SFC) template success ")}`);
            console.log(`${chalk.green("relate style.scss to CCC success")}`);
            console.log(`add ${chalk.green(name)} success`)
        })
        .catch(err => console.error(`${chalk.red(err)}`))

}