'use strict';

process.env.Q_SERVER = 'https://q-js401.herokuapp.com';

const express = require('express');
const QueueClient = require('@nmq/q/client');
const runners = require('@johnfellows/unsafe-code-runner');

const config = require('./config.json');

const app = express();

const FUNCTIONS_PATH = `${__dirname}/functions`;

// Dynamically build up the event listeners
Object.keys(config.triggers.events).forEach( listener => {

  const[q,event] = listener.split(':');

  let language = config.triggers.events[listener].language;
  let fn = `${FUNCTIONS_PATH}/${config.triggers.events[listener].function}`;

  const queue = new QueueClient(q);

  queue.subscribe(event, (payload) => runners[language](payload, fn));

});

// Dynamically build up the route handlers
Object.keys(config.triggers.routes).forEach( route => {

  let language = config.triggers.routes[route].language;
  let fn = `${FUNCTIONS_PATH}/${config.triggers.routes[route].function}`;

  app.get(route, (request,response) => {
    const context = {
      headers:request.headers,
      body: request.body,
      params: request.params,
      query: request.query,
    };
    runners[language](context, fn)
      .then( data => {
        response.status(200).send(data);
      })
      .catch( console.error );
  });

});

app.listen(3000, () => console.log('server up'));
