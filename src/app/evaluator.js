var exports = module.exports = {};

exports.compareDUAttributes = function compareDUAttributes(requirement, attribute, optimum) {
    //attribute fulfills requirement
    if (module.exports.assessDUAttributes(requirement, attribute, attribute)) {
        //no optimum attribute defined, thus current one is optimum
        if (optimum === undefined) {
            return requirement;
        } else {
            for (var requirementProperty in requirement.properties) {
                optimum.properties[requirementProperty] = compareProperty(requirement.properties[requirementProperty], optimum.properties[requirementProperty], attribute.properties[requirementProperty]);
            }
        }
    }
    return optimum;
}

function compareProperty(requirementProperty, optimumProperty, attributeProperty) {
    //minimum threshold defined for requirements
    if (requirementProperty.minimum !== undefined) {
        if (requirementProperty.maximum === undefined) {
            //determine if attribute is greater than current optimum
            if (optimumProperty.minimum !== undefined && attributeProperty.minimum !== undefined) {
                if (optimumProperty.minimum < attributeProperty.minimum) {
                    return attributeProperty;
                }
            } else if (optimumProperty.value !== undefined && attributeProperty.value !== undefined) {
                if (optimumProperty.value < attributeProperty.value) {
                    return attributeProperty;
                }
            } else if (optimumProperty.minimum !== undefined && attributeProperty.value !== undefined) {
                if (optimumProperty.minimum < attributeProperty.value) {
                    return attributeProperty;
                }
            } else if (optimumProperty.value !== undefined && attributeProperty.minimum !== undefined) {
                if (optimumProperty.value < attributeProperty.minimum) {
                    return attributeProperty;
                }
            }
        }
        //maximum threshold defined for requirements
    } else if (requirementProperty.maximum !== undefined) {
        //determine if attribute is lower than current optimum
        if (optimumProperty.maximum !== undefined && attributeProperty.maximum !== undefined) {
            if (optimumProperty.maximum > attributeProperty.maximum) {
                return attributeProperty;
            }
        } else if (optimumProperty.value !== undefined && attributeProperty.value !== undefined) {
            if (optimumProperty.value > attributeProperty.value) {
                return attributeProperty;
            }
        } else if (optimumProperty.maximum !== undefined && attributeProperty.value !== undefined) {
            if (optimumProperty.maximum > attributeProperty.value) {
                return attributeProperty;
            }
        } else if (optimumProperty.value !== undefined && attributeProperty.maximum !== undefined) {
            if (optimumProperty.value > attributeProperty.maximum) {
                return attributeProperty;
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
        console.log("goal score is " + goalScore);
        //look for a requirement whose name is identical to goalReq
        for (var requirement in requirements) {
            if (requirements[requirement].id === goal.attributes[goalReq]) {
                //look for blueprint attributes compatible with the one indicated in the goal
                for (var attribute in attributes) {
                    if (attributes[attribute].type === requirements[requirement].type) {
                        var tempScore = 0;
                        if (optimum === undefined) {
                            //TODO invocare PSE TUB, al momento sempre vero
                            tempScore = 1;
                        } else {
                            //if the attributes were not fulfilled (or not found), also the whole goal is not
                            tempScore = module.exports.assessDUAttributes(requirements[requirement], attributes[attribute], optimum[requirements[requirement].id])
                        }
                        if (tempScore > reqScore) {
                            reqScore = tempScore;
                        }
                        console.log("req score is now " + reqScore);
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
    console.log("here we are");
    console.log("goal score is " + goalScore);
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
            //compute score
            console.log(requirementProperty);
            score = score * module.exports.assessProperty(goalRequirement.properties[requirementProperty], blueprintAttribute.properties[requirementProperty], optimumAttribute.properties[requirementProperty])
        } else {
            // property is missing, attribute is not fulfilled
            return 0;
        }        
    }
    console.log(score);
    return score;
}

exports.assessProperty = function assessProperty(goalProperty, blueprintProperty, optimumProperty) {
    //minimum threshold was specified for goal property
    if (goalProperty.minimum !== undefined) {
        //minimum threshold was specified for blueprint property
        if (blueprintProperty.minimum !== undefined) {
            //verify if property is not within threshold
            if (goalProperty.minimum > blueprintProperty.minimum) {
                //goal metric is not fulfilled
                return 0;
            }
            
        } else {
            //a fixed value is defined for the blueprint
            if (blueprintProperty.value !== undefined) {
                //verify if property is not within threshold
                if (goalProperty.minimum > blueprintProperty.value) {
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
    if (goalProperty.maximum !== undefined) {
        //maximum threshold was specified for blueprint property
        if (blueprintProperty.maximum !== undefined) {
            //verify if property is not within threshold
            if (goalProperty.maximum < blueprintProperty.maximum) {
                //goal property is not fulfilled
                return 0
            }
            
        } else {
            //a fixed value is defined for the blueprint
            if (blueprintProperty.value !== undefined) {
                //verify if property is not within threshold
                if (goalProperty.maximum < blueprintProperty.value) {
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
    if (goalProperty.value !== undefined) {
        //a specific value was specified for blueprint property
        if (blueprintProperty.value !== undefined) {
            //verify if both values are the same
            if (goalProperty.value !== blueprintProperty.value) {
                //goal property is not fulfilled
                return 0
            }
            //no specific value was specified for the blueprint property
        } else {
            //goal property is not fulfilled
            return 0
        }
    }
    //all checks were passed, property was fulfilled
    return 1;
}

