const express = require('express');
const router = express.Router();
const dao = require("../dao/dao");
const jwt = require('jsonwebtoken');
const SECRET = 'secret';

const users_db = "./db_data/users_db.json";
const organizations_db = "./db_data/organizations_db.json";

router.get('/auth', (req, res) => {
    try {
        if (req.cookies && req.cookies.roomer_toker) {
            const jsonUsers = dao.readJson(users_db);
            const token = req.cookies.roomer_toker;
            const decoded = jwt.verify(token, SECRET);
            if (jsonUsers[decoded.username]) {
                const jsonOrganizations = dao.readJson(organizations_db);
                const username = decoded.username;
                const organization = jsonUsers[username].organization;
                res.status(200).json({
                    msg: 'Auth successful',
                    userData: jsonUsers[decoded.username],
                    organizationData: jsonOrganizations[organization]
                });
            } else {
                res.status(500).json({msg: 'Auth failed... there is no user with this token'});
            }
        } else {
            res.status(500).json({msg: 'Auth failed... there is no cookie'});
        }
    } catch (e) {
        res.status(500).json({msg: e.message});
    }
});

router.post('/login', (req, res) => {
    try {
        const {username, password, checkbox} = req.body;
        const jsonUsers = dao.readJson(users_db);
        if (jsonUsers[username] && jsonUsers[username].password === password) {
            const {organization} = jsonUsers[username];
            const jsonOrganizations = dao.readJson(organizations_db);
            if (jsonOrganizations[organization]) {
                if (checkbox) {
                    const token = jwt.sign({username}, SECRET);
                    res.cookie('roomer_toker', token);
                }
                return res.status(200).json({"msg": "Success", userData: jsonUsers[username], organizationData: jsonOrganizations[organization]});
            } else {
                return res.status(400).json({"msg": `Organization ${organization} does not exists`});
            }
        } else {
            return res.status(400).json({"msg": "Username or password is incorrect"});
        }
    } catch (e) {
        return res.status(400).json({"error": e.message});
    }
});

router.post('/signup', (req, res) => {
    try {
        const {username, password, organization, firstName, lastName, email} = req.body;
        const json = dao.readJson(users_db);
        if (username && !json[username]) {
            const newUser = {
                [username]: {
                    password,
                    organization,
                    firstName,
                    lastName,
                    email
                }
            };
            dao.updateJson(users_db, json, newUser);
            return res.status(200).json({"msg": "Success"});
        } else {
            return res.status(400).json({"msg": "Username is already taken"});
        }
    } catch (e) {
        return res.status(400).json({"error": e.message});
    }
});

module.exports = router;
