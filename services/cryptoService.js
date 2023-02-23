const crypto = require("crypto");
const algorithm = "aes-256-cbc";

const encrypt = (jsonData, secretKey) => 
{    
    const iv = crypto.randomBytes(16);    
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

    const data = JSON.stringify(jsonData);
    const encryptedData = 
        cipher.update(data, "utf8", "hex") + cipher.final("hex");

    return { data: encryptedData, iv: iv.toString("hex") };
};

const decrypt = (jsonData, secretKey) => 
{
    const algorithm = "aes-256-cbc";        
    const iv = Buffer.from(jsonData.iv, "hex");
    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);

    const decryptedConfigurations = 
        decipher.update(jsonData.data, "hex", "utf8") + decipher.final("utf8");

    return JSON.parse(decryptedConfigurations);        
};

module.exports = {  
    encrypt,
    decrypt
};
