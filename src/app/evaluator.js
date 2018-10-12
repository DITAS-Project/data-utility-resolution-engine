/**
 * Data Utility Resolution Engine (DURE) module
 * Code written by Giovanni Meroni (giovanni.meroni@polimi.it)
 *
 * Copyright 2018 Politecnico di Milano
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

const pse_module_url = "http://31.171.247.162:50008/filter";

exports.compareDUAttributes = function compareDUAttributes(requirement, attribute, optimum) {
    //attribute fulfills requirement
    if (module.exports.assessDUAttributes(requirement, attribute, attribute) > 0) {
        //no optimum attribute defined, thus current one is optimum
        if (optimum === undefined) {
            optimum = {};
            optimum.properties = {};
            for (var requirementProperty in requirement.properties) {
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
    //minimum threshold defined for requirements
    if (requirementProperty.minimum !== undefined) {
        //no maximum threshold, so it is not a range
        if (requirementProperty.maximum === undefined) {
            //determine if attribute is greater than current optimum
            if (optimumProperty !== undefined && attributeProperty.minimum !== undefined) {
                if (optimumProperty < attributeProperty.minimum) {
                    return attributeProperty.minimum;
                }
            } else if (optimumProperty !== undefined && attributeProperty.value !== undefined) {
                if (optimumProperty < attributeProperty.value) {
                    return attributeProperty.value;
                }
            } else if (optimumProperty === undefined && attributeProperty.minimum !== undefined) {
                return attributeProperty.minimum;
            } else if (optimumProperty === undefined && attributeProperty.value !== undefined) {
                return attributeProperty.value;
            }
        }
        //maximum threshold defined for requirements
    } else if (requirementProperty.maximum !== undefined) {
        //determine if attribute is lower than current optimum
        if (optimumProperty !== undefined && attributeProperty.maximum !== undefined) {
            if (optimumProperty > attributeProperty.maximum) {
                return attributeProperty.maximum;
            }
        } else if (optimumProperty !== undefined && attributeProperty.value !== undefined) {
            if (optimumProperty > attributeProperty.value) {
                return attributeProperty.value;
            }
        } else if (optimumProperty === undefined && attributeProperty.maximum !== undefined) {
            return attributeProperty.maximum;
        } else if (optimumProperty === undefined && attributeProperty.value !== undefined) {
            return attributeProperty.value;
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
        if (blueprintAttribute.properties[requirementProperty] !== undefined && optimumAttribute !== undefined) {
            //compute score
            score = score * module.exports.assessProperty(goalRequirement.properties[requirementProperty], blueprintAttribute.properties[requirementProperty], optimumAttribute.properties[requirementProperty])
        } else {
            // property is missing, attribute is not fulfilled
            return 0;
        }        
    }
    return score;
}

exports.assessProperty = function assessProperty(requirementProperty, blueprintProperty, optimumProperty) {
    //minimum threshold was specified for goal property
    if (requirementProperty.minimum !== undefined) {
        //minimum threshold was specified for blueprint property
        if (blueprintProperty.minimum !== undefined) {
            //verify if property is not within threshold
            if (requirementProperty.minimum > blueprintProperty.minimum) {
                //goal metric is not fulfilled
                return 0;
            } 
        } else {
            //a fixed value is defined for the blueprint
            if (blueprintProperty.value !== undefined) {
                //verify if property is not within threshold
                if (requirementProperty.minimum > blueprintProperty.value) {
                    //goal metric is not fulfilled
                    return 0;
                }
                //no minimum threshold was specified for the blueprint property
            } else {
                return 0;
            }
        }
    }
    //maximum threshold was specified for goal property
    if (requirementProperty.maximum !== undefined) {
        //maximum threshold was specified for blueprint property
        if (blueprintProperty.maximum !== undefined) {
            //verify if property is not within threshold
            if (requirementProperty.maximum < blueprintProperty.maximum) {
                //goal property is not fulfilled
                return 0
            }
            
        } else {
            //a fixed value is defined for the blueprint
            if (blueprintProperty.value !== undefined) {
                //verify if property is not within threshold
                if (requirementProperty.maximum < blueprintProperty.value) {
                    //goal metric is not fulfilled
                    return 0;
                }
                //no maximum threshold was specified for the blueprint property
            } else {
                return 0;
            }
        }
    }
    //a specific value was specified for goal property
    if (requirementProperty.value !== undefined) {
        //a specific value was specified for blueprint property
        if (blueprintProperty.value !== undefined) {
            //verify if both values are the same
            if (requirementProperty.value !== blueprintProperty.value) {
                //goal property is not fulfilled
                return 0
            }
            //no specific value was specified for the blueprint property
        } else {
            //goal property is not fulfilled
            return 0
        }
    }
    //all checks were passed, property was fulfilled, now determine score
    //lower bound
    if (optimumProperty !== undefined) {
        if (requirementProperty.minimum !== undefined) {
            //no upper bound
            if (requirementProperty.maximum === undefined && (optimumProperty - requirementProperty.minimum > 0) ) {
                //compute score: the closer the property is to the optimum, the best the result is
                if (blueprintProperty.minimum !== undefined) {
                    return 0.5 + 0.5 * ((blueprintProperty.minimum - requirementProperty.minimum) / (optimumProperty - requirementProperty.minimum))
                } else if (blueprintProperty.value !== undefined) {
                    return 0.5 + 0.5 * ((blueprintProperty.value - requirementProperty.minimum) / (optimumProperty - requirementProperty.minimum))
                }
            }
            //upper bound
        } else if (requirementProperty.maximum !== undefined) {
            if ((requirementProperty.maximum - optimumProperty) > 0) {
                //compute score: the closer the property is to the optimum, the best the result is
                if (blueprintProperty.maximum !== undefined) {
                    return 0.5 + 0.5 * ((requirementProperty.maximum - blueprintProperty.maximum) / (requirementProperty.maximum - optimumProperty))
                } else if (blueprintProperty.value !== undefined) {
                    return 0.5 + 0.5 * ((requirementProperty.maximum - blueprintProperty.value) / (requirementProperty.maximum - optimumProperty))
                }
            }
        }
    }
    //no comparison is possible, binary decision
    return 1;
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
    console.log("body is " + res.body)
    console.log("data are " + body);
    console.log("length is " + body.length)

    if (body.length > 0) {
        return 1;
    } else {
        return 0;
    }
    
} 

