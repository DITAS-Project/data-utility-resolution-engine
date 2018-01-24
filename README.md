# Data Utility Resolution Engine
The goal of the component consists in filtering bluprints and raking them, based on the application developer requirements

## Input
* application developer requirements
* list of blueprints 

## Output
* list of blueprints 

## list of functionalities
* /api/filterBlueprints
  * description: the method receives in input a list of blueprints and outputs a filtered list of blueprints which satisfy the application developer requirements.
  * caller Resolution engine
  * input
    * application developer requirements
    * list of blueprints 
  * output
    * list of blueprints 
  

## Implementation language
Node.js

## Requirements
In order to work, this component requires the following modules to be installed:

* express
* body-parser

## Execution
To launch this component, execute the following command:
* node main.js [port]

[port] specifies the HTTP port number where the component will listen to requests. If not specified, default value 8081 will be used.