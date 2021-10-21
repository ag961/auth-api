'use strict';

const express = require('express');
const authRouter = express.Router();

const { users } = require('../models/index.js');
const basicAuth = require('../auth/middleware/basic.js')
const bearerAuth = require('../auth/middleware/bearer.js');
const permissions = require('../auth/middleware/acl.js')

authRouter.get('/', (req, res) => {
  res.status(200).send('Hello World')
})

authRouter.get('/listall', async (req, res, next) => {
  const allUsers = await users.findAll();
  const list = allUsers.map(user => user);
  res.status(200).json(list);
});

authRouter.delete('/destroy', async (req, res, next) => {
  await users.destroy({where: {}})
  res.status(200).send('destroyed all users');
})

authRouter.post('/signup', async (req, res, next) => {
  try {
    let userRecord = await users.create(req.body);
    const output = {
      user: userRecord,
      token: userRecord.token
    };
    res.status(201).json(output);
  } catch (e) {
    next(e.message);
  }
});

authRouter.post('/signin', basicAuth, (req, res, next) => {
  const user = {
    user: req.user,
    token: req.user.token
  };
  res.status(200).json(user);
});

authRouter.get('/users', bearerAuth, permissions('delete'), async (req, res, next) => {
  const allUsers = await users.findAll({});
  const list = allUsers.map(user => user.username);
  res.status(200).json(list);
});

authRouter.get('/secret', bearerAuth, async (req, res, next) => {
  res.status(200).send("Welcome to the secret area!")
});


module.exports = authRouter;