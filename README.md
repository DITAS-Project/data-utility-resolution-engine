# Data Utility Resolution Engine
The goal of the component consists in filtering and ranking blueprints and raking them, based on the application developer requirements

## List of functionalities
* /api/filterBlueprints
  * description: the method receives in input the application requirements, the blueprints satisfying the functional requirements, 
  and a subset of the method exposed by these blueprints. It then filters and ranks blueprints according to the non-functional requirements.
  * caller Resolution engine
  * input
    * application developer requirements
    * list of pairs candidate blueprint - method
	  * candidate blueprint: blueprint that meets the functional requirements
	  * method: method exposed by the candidate blueprint that meets the functional requirements
  * output
    * list of tuples chosen blueprint UUID - method - score - fulfilled requirements
	  * chosen blueprint UUID: UUID of a blueprint that meets the non functional requirements
	  * method: method exposed by the candidate blueprint that meets the non functional requirements
	  * score: rank assigned to the blueprint, based on how well it responds to the non functional requirements
	  * fulfilled requirements: subset of the application developer requirements, that is fulfilled by the blueprint
  
## API definition
API definition in [SwaggerHub](https://app.swaggerhub.com/apis/ditas-project/DataUtilityResolutionEngine/0.0.1).

## Implementation language
Node.js

## Requirements
In order to work, this component requires the following modules to be installed:

* express
* body-parser

## Execution
To launch this component, execute the following command:
* node main.js [port]

[port] specifies the HTTP port number where the component will listen to requests. If not specified, default value 8080 will be used.
