require('dotenv').config();
const crypto = require('crypto');
const fs = require("fs");

const configFile = 'process-configuration.json';
const processData = require(`../${configFile}`);

const getEncryptionKey = require('../services/vault').getEncryptionKey;

const encryptComponent = (algorithm, encryptionKey, component) => 
{
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, encryptionKey, iv);

    let configurationsString = JSON.stringify(component.configurations);
    let encryptedConfigurations = 
        cipher.update(configurationsString, 'utf8', 'hex');
    encryptedConfigurations += cipher.final('hex');

    component.configurations = {
        data: encryptedConfigurations,
        iv: iv.toString('hex')
    };
};

const encryptConfigurations = () =>
{        
    const algorithm = 'aes-256-cbc';

    return getEncryptionKey()
        .then(encryptionKey => {
            processData.processes.forEach(process => {
                process.configuredComponents.forEach(component => {
                    encryptComponent(algorithm, encryptionKey, component);
                });
            });

            return JSON.stringify(processData);
        });
};

encryptConfigurations()
    .then(encryptedData =>
        fs.writeFile(configFile, encryptedData, (err) => {
            if (err) 
                throw err;
            console.log('The file has been saved!');
        }));

