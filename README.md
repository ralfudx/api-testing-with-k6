# api-testing-with-k6

This project contains test cases for api endpoints using k6. The test cases are runnable both as functional tests and as smoke/load tests. In the first phase, tests cases will be written to run in the staging environment but the scope of this project will be expanded to run in a dedicated test environment and with any number of users/load.


# Install

`brew install k6`

Refer to this guide to install in other platforms - https://k6.io/docs/getting-started/installation

# Why K6 

- This is a high performance golang based framework. Framework is very mature and developers respond quickly to your query
- Developer friendly APIs and scripting in Javascript
- You can execute your functional tests, smoke tests and use the same scenarios to load testing by increasing the
number of virtual users and iterations
- Provides functionality that will help us to analyze the http requests performance and run tests with a small 
amount of load to continuously monitor the performance of our production environment.
- Provides plugins to visualize the test results 

`We want to expand the scope of api testing further and ask questions like`  

- What's the overall performance of our system?
- What's the average response time of each request?
- Are there any endpoints crashing under load?
- What's the maximum load our system can handle 

# Files

- `request.js`

  This file contains request wrapper for different endpoints that will be used multiple times in the tests and common functions.
  
- `prop.js`

  This file contains all the global parameters 

- `commons.js`

  This should not be executed. This contains common functions to complete a bigger objective.

- `start.js`

  Running this file will run all the tests cases in the project

# Running

Functional tests are run with only one virtual user and iterations

`docker-compose up --build` or  `k6 run start.js`

`k6 run start.js --vus 1 --iterations 1`

If you wish to see all the info about the http endpoint

`k6 run start.js --http-debug="full"`

if you want to upload the results to our cloud dashboard 

`K6_CLOUD_TOKEN= k6 run --out cloud api/checkout/user_application_checkout.js`

If you wish you run using docker container

`docker-compose build`

`docker-compose up`

# Running Load Test 

if you have access to the instance then on the home directory 

    
    export BASE_URL=https://${dedicated_test_env_url}
    cd ~
    cd platform-api-tests/

Before running the performance tests run some functional tests to make sure you're well setup
 
    k6 run api/tradeBFX/init.js --http-debug="full"
    
Modify `performance/completeBFXTransaction.js` for number of virtual users and duration. 
You can keep the number of iterations very high.
If all the functional tests pass then run the below command

    k6 run performance/completeBFXTransaction.js

You can change `completeBFXTransaction.js` file for number of virtual users, duration.

    export let options = {
      vus: 3000,
      duration: "1800s",
      iterations: 450000,
    };
