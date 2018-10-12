# Data Utility Resolution Engine
The goal of the component consists in filtering and ranking blueprints and raking them, based on the application developer requirements.

This component is being developed for the DITAS Project: https://www.ditas-project.eu/

Copyright 2018 Politecnico di Milano

## List of functionalities
* /api/filterBlueprints
  * description: the method receives in input the application requirements, the blueprints satisfying the functional requirements, 
  and a subset of the methods exposed by these blueprints. It then filters and ranks blueprints according to the non-functional requirements.
  * caller Resolution engine
  * input
    * application developer requirements
    * list of pairs candidate blueprint - method names
	  * candidate blueprint: blueprint that meets the functional requirements
	  * method names: list of methods exposed by the candidate blueprint that meet the functional requirements
  * output
    * list of tuples updated blueprint - score - method names
	  * updated blueprint: blueprint with updated non-functional requirements
	  * score: rank assigned to the blueprint, based on how well it responds to the non-functional requirements
	  * method names: list of methods exposed by the candidate blueprint that meet the functional requirements
  
## API definition
API definition in [SwaggerHub](https://app.swaggerhub.com/apis/ditas-project/DataUtilityResolutionEngine/0.0.1).

## Implementation language
Node.js

## Requirements
In order to work, this component requires Node.js 6.14 LTS to be installed.

## Execution
To launch this component, execute the following command inside the src directory:
* npm start

## Testing
To test this component, execute the following command inside the src directory:
* npm test