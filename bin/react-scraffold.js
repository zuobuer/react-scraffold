#!/usr/bin/env node
'use strict'
/**
 * 
 */

const program = require('commander');
const path = require("path");
const fs = require("fs-extra");
const chalk = require("chalk");
const init = require("./../scripts/init");
const addVCC = require("../scripts/add-view-component");
const addSFC = require("../scripts/add-sfc-component");
const addPCC = require("../scripts/add-pure-component");

const componentTypes = ["stateless function component", "pure class component", "view class component"];
const abbreviateType = ["SFC", "PCC", "VCC"];

// 当前工作目录
const appPath = path.resolve();
const jsonPath = path.resolve("package.json");
const viewsPath = path.resolve("./src/views");
const componentsPath = path.resolve("./src/components");
const templatePath = path.resolve(__dirname, "./../template");

program
    .version('0.1.0', '-v, --version')
// .option("-t, --type <component type>", `add some component type, current limt ${chalk.green("C、PC、V")}`)

// 必须在.parse()之前，因为node的emit()是即时的

program
    .command("init <project-name>")
    .alias("i")
    .description("init project")
    .action((projectName) => {
        // console.log(projectName)
        init({
            templatePath,
            appPath,
            projectName,
        })
    })

program
    .command("add")
    .alias("a")
    .description("add a component")
    .option("-t, --type <component type>", `which type component to add, you can use ${chalk.green(abbreviateType)} map to ${chalk.green(componentTypes)}`)
    .option("-n, --name <component name>", "which name to set for component")
    .action((options) => {
        if (!fs.existsSync(jsonPath)) {
            console.error(`${chalk.red(`there is no package.json in ${appPath}/`)}`)
            console.error(`${chalk.white(`you can run ${chalk.green(' react-scraffold init ')} first`)}`)
            return;
        }
        const type = options.type.toUpperCase();
        const name = options.name;
        if (abbreviateType.indexOf(type) === -1) {
            console.error(`  ${chalk.red('add a component error, limit type ')}`);
            console.log(`  ${chalk.green(abbreviateType[0])} => ${chalk.green(componentTypes[0])}`);
            console.log(`  ${chalk.green(abbreviateType[1])} => ${chalk.green(componentTypes[1])}`);
            console.log(`  ${chalk.green(abbreviateType[2])} => ${chalk.green(componentTypes[2])}`);
            return;
        }
        switch (type) {
            case "SFC":
                // create a function componnet 
                addSFC({
                    name,
                    componentsPath
                })
                break;
            case "PCC":
                // create a pure component
                addPCC({
                    name,
                    componentsPath
                })
                break;
            case "VCC":
                // create a  view component
                addVCC({
                    name,
                    viewsPath,
                })
                break;
        }
    })









program.parse(process.argv);
