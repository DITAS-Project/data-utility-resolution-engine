/**
 * Data Utility Resolution Engine (DURE) module
 * Code written by Giovanni Meroni (giovanni.meroni@polimi.it)
 *
 * Copyright 2018-19 Politecnico di Milano
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 * This is being developed for the DITAS Project: https://www.ditas-project.eu/
 */

var exports = module.exports = {};

var request = require('sync-request');
var config = require('./config.json');

var pse_module_url = config.PSEEndpoint; //"http://31.171.247.162:50008/filter";

exports.compareDUAttributes = function compareDUAttributes(requirement, attribute, optimum) {
    //attribute fulfills requirement
    if (module.exports.assessDUAttributes(requirement, attribute, undefined) > 0) {
        //no optimum attribute defined, thus current one is optimum
        if (optimum === undefined) {
            optimum = {};
            optimum.properties = {};
            for (var requirementProperty in requirement.properties) {
                console.log("optimum is "+ JSON.stringify(compareProperty(requirement.properties[requirementProperty], undefined, attribute.properties[requirementProperty])));
                optimum.properties[requirementProperty] = compareProperty(requirement.properties[requirementProperty], undefined, attribute.properties[requirementProperty]);
            }
        } else {
            for (requirementProperty in requirement.properties) {
                optimum.properties[requirementProperty] = compareProperty(requirement.properties[requirementProperty], optimum.properties[requirementProperty], attribute.properties[requirementProperty]);
            }
        }
    }
    return optimum;
}

function compareProperty(requirementProperty, optimumProperty, attributeProperty) {

    //exact match
    if (requirementProperty.value !== undefined) {
        //determine if attribute satisfies constraint
        if (optimumProperty == undefined && attributeProperty.value !== undefined) {
            if (attributeProperty.value == requirementProperty.value) {
                return attributeProperty.value;
            }
        }
        //maximize value
    } else if (requirementProperty.minimum !== undefined) {
        //determine if attribute is greater than requirement
        if (optimumProperty == undefined) {
            //find if best configuration (attributeProperty.maximum) has been specified
            if (attributeProperty.maximum !== undefined) {
                if (attributeProperty.maximum > requirementProperty.minimum) {
                    return attributeProperty.maximum;
                }
                //find if average (DITAS) configuration (attributeProperty.value) has been specified
            } else if (attributeProperty.value !== undefined) {
                if (attributeProperty.value > requirementProperty.minimum) {
                    return attributeProperty.value;
                }
                //find if worst configuration (attributeProperty.minimum) has been specified
            } else if (attributeProperty.minimum !== undefined) {
                if (attributeProperty.minimum > requirementProperty.minimum) {
                    return attributeProperty.minimum;
                }
            }
            //determine if attribute is lower than current optimum (which is lower than requirement by definition)
        } else {
            //find if best configuration (attributeProperty.maximum) has been specified
            if (attributeProperty.maximum !== undefined) {
                if (attributeProperty.maximum > optimumProperty) {
                    return attributeProperty.maximum;
                }
                //find if average (DITAS) configuration (attributeProperty.value) has been specified
            } else if (attributeProperty.value !== undefined) {
                if (attributeProperty.value > optimumProperty) {
                    return attributeProperty.value;
                }
                //find if worst configuration (attributeProperty.minimum) has been specified
            } else if (attributeProperty.minimum !== undefined) {
                if (attributeProperty.minimum > optimumProperty) {
                    return attributeProperty.minimum;
                }
            } 
        }
        //minimize value
    } else if (requirementProperty.maximum !== undefined) {
        //determine if attribute is lower than requirement
        if (optimumProperty == undefined) {
            //find if best configuration (attributeProperty.maximum) has been specified
            if (attributeProperty.maximum !== undefined) {
                if (attributeProperty.maximum < requirementProperty.maximum) {
                    return attributeProperty.minimum;
                }
                //find if average (DITAS) configuration (attributeProperty.value) has been specified
            } else if (attributeProperty.value !== undefined) {
                if (attributeProperty.value < requirementProperty.maximum) {
                    return attributeProperty.value;
                }
                //find if worst configuration (attributeProperty.minimum) has been specified
            } else if (attributeProperty.minimum !== undefined) {
                if (attributeProperty.minimum < requirementProperty.maximum) {
                    return attributeProperty.maximum;
                }
            }
            //determine if attribute is lower than current optimum (which is lower than requirement by definition)
        } else {
            //find if best configuration (attributeProperty.maximum) has been specified
            if (attributeProperty.maximum !== undefined) {
                if (attributeProperty.maximum < optimumProperty) {
                    return attributeProperty.maximum;
                }
                //find if average (DITAS) configuration (attributeProperty.value) has been specified
            } else if (attributeProperty.value !== undefined) {
                if (attributeProperty.value < optimumProperty) {
                    return attributeProperty.value;
                }
                //find if worst configuration (attributeProperty.minimum) has been specified
            } else if (attributeProperty.minimum !== undefined) {
                if (attributeProperty.minimum < optimumProperty) {
                    return attributeProperty.minimum;
                }
            }
        }
    }
    //current optimum is still the best case
    return optimumProperty;
}

exports.assessGoal = function assessGoal(requirements, goal, attributes, optimum) {
    //verify if all requirements belonging to that goal are fulfilled
    var goalScore = 1;
    for (var goalReq in goal.attributes) {
        var reqScore = 0;
        //look for a requirement whose name is identical to goalReq
        for (var requirement in requirements) {
            if (requirements[requirement].id === goal.attributes[goalReq]) {
                //look for blueprint attributes compatible with the one indicated in the goal
                for (var attribute in attributes) {
                    if (attributes[attribute].type === requirements[requirement].type) {
                        var tempScore = 0;
                        if (optimum === undefined) {
                            //assess privacy and security
                            tempScore = module.exports.invokePSE(requirements[requirement], attributes[attribute]);
                        } else {
                            //assess data utility
                            //if the attributes were not fulfilled (or not found), also the whole goal is not
                            tempScore = module.exports.assessDUAttributes(requirements[requirement], attributes[attribute], optimum[requirements[requirement].id])
                        }
                        if (tempScore > reqScore) {
                            reqScore = tempScore;
                        }
                    }
                }
            }
        }
        if (reqScore === 0) {
            return 0;
        } else {
            goalScore = goalScore * reqScore;
        }
    }
    //if we reached the end of the cycle, then the goal is fulfilled
    //thus, return the weight
    if (goal.weight !== undefined) {
        return goal.weight * goalScore;
    } else {
        return goalScore;
    }
}

exports.assessDUAttributes = function assessDUAttributes(goalRequirement, blueprintAttribute, optimumAttribute) {
    var score = 1;
    for (var requirementProperty in goalRequirement.properties) {
        // a property exists
        if (blueprintAttribute.properties[requirementProperty] !== undefined) {
            console.log("examining property: " + JSON.stringify(requirementProperty));
            //compute score
            if (optimumAttribute !== undefined) {
                score = score * module.exports.assessProperty(goalRequirement.properties[requirementProperty], blueprintAttribute.properties[requirementProperty], optimumAttribute.properties[requirementProperty]);
                console.log("score is " + score);
            } else {
                score = score * module.exports.assessProperty(goalRequirement.properties[requirementProperty], blueprintAttribute.properties[requirementProperty], undefined);
                console.log("score is " + score);
            }
        } else {
            // property is missing, attribute is not fulfilled
            return 0;
        }        
    }
    return score;
}

exports.assessProperty = function assessProperty(requirementProperty, blueprintProperty, optimumProperty) {
    //exact match is required
    if (requirementProperty.value !== undefined) {
        if (blueprintProperty.value !== undefined) {
            if (requirementProperty.value == blueprintProperty.value) {
                return 1;
            }
        }
    //maximize value
    } else if (requirementProperty.minimum !== undefined) {
        //determine if attribute is greater than requirement
        if (optimumProperty == undefined) {
            //find if best configuration (blueprintProperty.maximum) has been specified
            if (blueprintProperty.maximum !== undefined) {
                if (blueprintProperty.maximum > requirementProperty.minimum) {
                    return 1;
                }
                //find if average (DITAS) configuration (blueprintProperty.value) has been specified
            } else if (blueprintProperty.value !== undefined) {
                if (blueprintProperty.value > requirementProperty.minimum) {
                    return 1;
                }
                //find if worst configuration (blueprintProperty.minimum) has been specified
            } else if (blueprintProperty.minimum !== undefined) {
                if (blueprintProperty.minimum > requirementProperty.minimum) {
                    return 1;
                }
            }
            //determine if attribute is lower than current optimum (which is lower than requirement by definition)
        } else {
            //find if best configuration (blueprintProperty.maximum) has been specified
            if (blueprintProperty.maximum !== undefined) {
                if (blueprintProperty.maximum > requirementProperty.minimum) {
                    return 0.5 + 0.5 * ((blueprintProperty.maximum - requirementProperty.minimum) / (optimumProperty - requirementProperty.minimum));
                }
                //find if average (DITAS) configuration (blueprintProperty.value) has been specified
            } else if (blueprintProperty.value !== undefined) {
                if (blueprintProperty.value > requirementProperty.minimum) {
                    return 0.5 + 0.5 * ((blueprintProperty.value - requirementProperty.minimum) / (optimumProperty - requirementProperty.minimum));
                }
                //find if worst configuration (blueprintProperty.minimum) has been specified
            } else if (blueprintProperty.minimum !== undefined) {
                if (blueprintProperty.minimum > requirementProperty.minimum) {
                    return 0.5 + 0.5 * ((blueprintProperty.minimum - requirementProperty.minimum) / (optimumProperty - requirementProperty.minimum));
                }
            }
        }
        //minimize value
    } else if (requirementProperty.maximum !== undefined) {
        //determine if attribute is lower than requirement
        if (optimumProperty == undefined) {
            //find if best configuration (blueprintProperty.maximum) has been specified
            if (blueprintProperty.maximum !== undefined) {
                if (blueprintProperty.maximum < requirementProperty.maximum) {
                    return 1;
                }
                //find if average (DITAS) configuration (blueprintProperty.value) has been specified
            } else if (blueprintProperty.value !== undefined) {
                if (blueprintProperty.value < requirementProperty.maximum) {
                    return 1;
                }
                //find if worst configuration (blueprintProperty.minimum) has been specified
            } else if (blueprintProperty.minimum !== undefined) {
                if (blueprintProperty.minimum < requirementProperty.maximum) {
                    return 1;
                }
            }
            //determine if attribute is lower than current optimum (which is lower than requirement by definition)
        } else {
            //find if best configuration (blueprintProperty.maximum) has been specified
            if (blueprintProperty.maximum !== undefined) {
                if (blueprintProperty.maximum < requirementProperty.maximum) {
                    return 0.5 + 0.5 * ((requirementProperty.maximum - blueprintProperty.maximum) / (requirementProperty.maximum - optimumProperty))
                }
                //find if average (DITAS) configuration (blueprintProperty.value) has been specified
            } else if (blueprintProperty.value !== undefined) {
                if (blueprintProperty.value < requirementProperty.maximum) {
                    return 0.5 + 0.5 * ((requirementProperty.maximum - blueprintProperty.value) / (requirementProperty.maximum - optimumProperty))
                }
                //find if worst configuration (blueprintProperty.minimum) has been specified
            } else if (blueprintProperty.minimum !== undefined) {
                if (blueprintProperty.minimum < requirementProperty.maximum) {
                    return 0.5 + 0.5 * ((requirementProperty.maximum - blueprintProperty.minimum) / (requirementProperty.maximum - optimumProperty))
                }
            }
        }
    }

    //constraint is not satisfied
    return 0;
}

exports.invokePSE = function assessPSE(goalRequirement, blueprintAttribute) {

    var args = {
        requirement: goalRequirement,
        blueprintAttributes: [blueprintAttribute]
    };

    var res = request('POST', pse_module_url, {
        json: args
    });

    var body = JSON.parse(res.body);
    /*
    console.log("body is " + res.body)
    console.log("data are " + body);
    console.log("length is " + body.length)
    */
    if (body.length > 0) {
        return 1;
    } else {
        return 0;
    }
    
} 

