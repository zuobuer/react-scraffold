const chalk = require('chalk');
const fs = require("fs-extra");

module.exports = (config) => {
    const v = config.component;
    const jsxClassName = v[0].toUpperCase() + v.slice(1, v.length);
    const projectSrcPath = `./src/views/${v}/`;
    console.log(`${chalk.green("start add a view component, locate at ", `./src/views/${v}/index.js`)}`);
    if (fs.existsSync(projectSrcPath)) {
        console.log(`${chalk.green(v)} ${chalk.red('view already exist')}`);
        return;
    }
    // init react class component template
    const indexContent = `
import React, { Component } from 'react';

class ${jsxClassName} extends Component {
    render() {
        return (
            <div className="view-${v}-root">
                    
            </div>
        );
    }
}

export default ${jsxClassName};

`

    // append page root css class
    const cssContent = `
.view-${v}-root{

}
`

    Promise.all([
        fs.createFile(projectSrcPath + 'index.js'),
        fs.createFile(projectSrcPath + 'style.scss'),
    ])
        .then(() => {
            return Promise.all([
                fs.appendFile(projectSrcPath + 'index.js', indexContent),
                fs.appendFile(projectSrcPath + 'style.scss', cssContent)
            ])
        })
        .then(() => {
            console.log(`${chalk.green("add react class component template success ")}`);
            console.log(`${chalk.green("add view page css style root class template success")}`);
            console.log("add view success")
        })
        .catch(err => console.error(`${chalk.red(err)}`))
}