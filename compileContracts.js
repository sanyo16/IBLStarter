const componentData = require('./process-configuration.json');
const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

const buildFolderPath = path.resolve(__dirname, 'build');

function getContractSource(contractFileName) 
{    
    return fs.readFileSync(contractFileName, 'utf8');
};

function getSources() 
{
    function addSource(dir) 
    {
        if (!fs.existsSync(dir))
            return;

        var list = fs.readdirSync(dir);
        
        list.forEach(function (file) {
            file = `${dir}/${file}`;
            sources = {
                ...sources,
                [file]: {
                    content: getContractSource(file)
                }
            };                
        });    
    };

    let sources = {};

    componentData.processes.forEach((process, index, array) => 
    {
        process.components.forEach((component, i, list) => 
        {
            addSource(path.resolve(__dirname, `node_modules/${component.importFrom}/contracts`)); 
        });
    });

    return sources;
}

function findImports(path) {    
    return { contents: `${fs.readFileSync("node_modules/" + path)}` }    
}

function compileContracts() 
{
    const input = {
        language: 'Solidity',
        sources: getSources(),
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            }
        }
    }

    console.log('\nCompiling contracts...');
    const output = JSON.parse(
        solc.compile(JSON.stringify(input), { import: findImports })
    );
    console.log('Done');

    if (output.errors) {
        console.error(output.errors);
        return;        
    }

    createFiles(input, output);    
}

function createFiles(input, output) 
{
    console.log('\nBuilding please wait...');

    fs.removeSync(buildFolderPath);
    fs.ensureDirSync(buildFolderPath);

    for (let contractFile in input.sources) {
        var outputFile = output.contracts[contractFile];
        for (let key in outputFile) {
            fs.outputJsonSync(
                path.resolve(buildFolderPath, `${key}.json`),
                {
                    abi: outputFile[key]["abi"],
                    bytecode: outputFile[key]["evm"]["bytecode"]["object"]
                }
            );
        }
    }
    console.log('Build finished successfully!\n');
}

compileContracts();
