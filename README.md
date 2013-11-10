Symposia 
========

<img src="https://travis-ci.org/posbo/symposia.png?branch=master">


### Introduction

Symposia is a framework for developing loosely coupled, modular applications by bringing together a number of design patterns including the Mediator, Observer, Module and Sandbox. It is based on the [Patterns of Large Scale JavaScript Applications](http://addyosmani.com/largescalejavascript/) by Addy Osmani and was created to solve a problem I was having at work, where my jQuery applications were becoming too tightly coupled, and a headache to both maintain and extend.

It contains the following open source libraries in its core.

- [Crossroads](http://millermedeiros.github.io/crossroads.js/) by [Miller Medeiros](https://github.com/millermedeiros)
- [PostalJS](https://github.com/postaljs/postal.js) by [Jim Cowart](https://github.com/ifandelse)

### Usage

Symposia has a few dependencies.

- [Installation](#installation)
- [Dependencies](#dependencies)
- [Modules](#modules)

### Installation

Reference Symposia in your RequireJS configuration:

```javascript
paths: {
  "symposia": 'bower_components/symposia/dist/symposia'
}
```

Then simply require it.

```javascript
define(function (require) {
  var symposia = require('symposia');
});
```
