const joi = require("joi");


//Validation de l'inscription
const inscriptionValide = data => {
    const schema = joi.object({
        username: joi.string().min(4).required(),
        email: joi.string().email().required(),
        nom: joi.string().required(),
        prenom: joi.string().required(),
        password: joi.string().min(9).required(),
        password1: joi.string().min(9).required()
    });

    return schema.validate(data)
};

const loginValide = data => {
    const schema = joi.object({
        username: joi.string().required(),
        password: joi.string().required()
    });

    return schema.validate(data)
};

module.exports.inscriptionValide = inscriptionValide;
module.exports.loginValide = loginValide;