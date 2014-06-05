[![Build Status](https://travis-ci.org/cyrusinnovation/CodeTestBotApp.svg?branch=master)](https://travis-ci.org/cyrusinnovation/CodeTestBotApp)
[![Code Climate](https://codeclimate.com/github/cyrusinnovation/CodeTestBotApp.png)](https://codeclimate.com/github/cyrusinnovation/CodeTestBotApp)
[![Stories in Ready](https://badge.waffle.io/cyrusinnovation/codetestbotapp.png?label=ready&title=Ready)](http://waffle.io/cyrusinnovation/codetestbotapp)

#####This is built using http://iamstef.net/ember-cli/#why

##Installing:

- ```brew install phantomjs```
- ```brew install node```
- ```npm install -g ember-cli```
- ```npm install -g bower```
- ```npm install```
- ```bower install```

####to run the server:
- ```ember server```

####to run the tests:
- ```ember test```

####to deploy:

- ```git remote add heroku git@heroku.com:codetestbot.git```
- ```./build-dist.sh```
- ```git commit the dist files that have appeared```
- ```git push origin master```
- ```git push heroku master```