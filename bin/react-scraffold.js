#!/usr/bin/env node
'use strict'
/**
 * 
 */

const program = require('commander');
const path = require("path");
const chalk = require("chalk");
const init = require("./../scripts/init");
const addView = require("./../scripts/addView");
const templatePath = path.resolve(__dirname, "./../template");

const componentTypes = ["class component", "pure function component", "view component"];
const abbreviateType = ["C", "PC", "V"];

program
    .version('0.1.0', '-v, --version')
    // .option("-t, --type <component type>", `add some component type, current limt ${chalk.green("C、PC、V")}`)

// 必须在.parse()之前，因为node的emit()是即时的

program
    .command("init")
    .alias("i")
    .description("init project")
    .action(() => {
        init({
            templatePath,
        })
    })
program
    .command("add <viewname>")
    .alias("av")
    .description("add a component")
    .option("-t, --type <component type>", "Which exec type component to add")
    .action((viewname, options) => {
        console.log(options.type);
        if (abbreviateType.indexOf(options.type) === -1) {
            console.error(`  ${chalk.red('add a component error, limit type ')}`);
            console.log(`  ${chalk.green(abbreviateType[0])} => ${chalk.green(componentTypes[0])}`);
            console.log(`  ${chalk.green(abbreviateType[1])} => ${chalk.green(componentTypes[1])}`);
            console.log(`  ${chalk.green(abbreviateType[2])} => ${chalk.green(componentTypes[2])}`);
            return;
        }
        switch (options.type) {
            case "C":
                break;
            case "PC":
                break;
            case "V":
                addView({
                    viewname
                })
                break;
        }
    })









program.parse(process.argv);
