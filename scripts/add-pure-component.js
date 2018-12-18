const chalk = require('chalk');
const fs = require("fs-extra");

module.exports = ({ name, componentsPath }) => {

    const jsxClassName = name[0].toUpperCase() + name.slice(1, name.length);
    const cPath = `${componentsPath}/${name}`;
    if (fs.existsSync(cPath)) {
        console.log(`${chalk.white(name)} ${chalk.red(`component already exist`)}`);
        return;
    }
    console.log(`${chalk.green("start add a pure class component, locate at ", `${cPath}/index.js`)}`);

    const indexContent = `
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './style.scss';
    
class ${jsxClassName} extends PureComponent {
    render() {
        return (
            <div className='com-${name}-root'>
                    
            </div>
        );
        
    }
}
    
${jsxClassName}.propTypes = {
    
};
    
export default ${jsxClassName};
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
            console.log(`${chalk.green("add react pure class component (SFC) template success ")}`);
            console.log(`${chalk.green("relate style.scss to CCC success")}`);
            console.log(`add ${chalk.green(name)} success`)
        })
        .catch(err => console.error(`${chalk.red(err)}`))

}