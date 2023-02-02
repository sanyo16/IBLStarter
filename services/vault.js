const getEncryptionKey = () => 
{
    const vault = require("node-vault")({
        apiVersion: "v1",
        endpoint: process.env.VAULT_ADDRESS,
    });
     
    const roleId = process.env.ROLE_ID;
    const secretId = process.env.SECRET_ID;

    return vault.approleLogin({
        role_id: roleId,
        secret_id: secretId,
    })
        .then(result => vault.token = result.auth.client_token)
        .then(() =>
            vault.read("secret/data/ibl")
                .then(result => result.data.encryptionkey ))
                .catch(err => console.error("/data",err));
};

module.exports = {
    getEncryptionKey,
};
