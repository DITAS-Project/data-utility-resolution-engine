var exports = module.exports = {};

exports.assessGoal = function assessGoal(requirements, goal, attributes, category) {
    //verify if all requirements belonging to that goal are fulfilled
    for (var goalReq in goal.attributes) {
        //look for a requirement whose name is identical to goalReq
        for (var requirement in requirements) {
            if (requirements[requirement].id === goal.attributes[goalReq]) {
                //look for blueprint attributes compatible with the one indicated in the goal
                var compatibleAttrs = [];
                for (var attribute in attributes) {
                    if (attributes[attribute].type === requirements[requirement].type) {
                        compatibleAttrs.push(attributes[attribute]);
                    }
                }

                if (category === "security" || category === "privacy") {
                    //INVOCARE PSE TUB
                } else {
                    //if the attributes were not fulfilled (or not found), also the whole goal is not
                    if (!module.exports.assessDUAttributes(requirements[requirement], compatibleAttrs)) {
                        return 0;
                    }
                }
            }
        }
    }
    //if we reached the end of the cycle, then the goal is fulfilled
    //thus, return the weight
    if (goal.weight !== undefined) {
        return goal.weight;
    } else {
        return 1;
    }
}

exports.assessDUAttributes = function assessDUAttributes(goalAttribute, blueprintAttributes) {
    for (var goalProperty in goalAttribute.properties) {
        
        var fulfilled = false;
        for (var attribute in blueprintAttributes) {
            for (var blueprintProperty in blueprintAttributes[attribute].properties) {
                if (goalProperty === blueprintProperty) {
                    if (module.exports.assessProperty(goalAttribute.properties[goalProperty], blueprintAttributes[attribute].properties[blueprintProperty])) {
                        fulfilled = true;
                    }
                }
            }
        }
        if (!fulfilled) {
            return false;
        }
    }
    return true;
}

exports.assessProperty = function assessProperty(goalProperty, blueprintProperty) {
    //minimum threshold was specified for goal property
    if (goalProperty.minimum !== undefined) {
        //minimum threshold was specified for blueprint property
        if (blueprintProperty.minimum !== undefined) {
            //verify if property is not within threshold
            if (goalProperty.minimum > blueprintProperty.minimum) {
                //goal metric is not fulfilled
                return false
            }
            //no minimum threshold was specified for the blueprint property
        } else {
            //goal property is not fulfilled
            return false
        }
    }
    //maximum threshold was specified for goal property
    if (goalProperty.maximum !== undefined) {
        //maximum threshold was specified for blueprint property
        if (blueprintProperty.maximum !== undefined) {
            //verify if property is not within threshold
            if (goalProperty.maximum < blueprintProperty.maximum) {
                //goal property is not fulfilled
                return false
            }
            //no maximum threshold was specified for the blueprint property
        } else {
            //goal property is not fulfilled
            return false
        }
    }
    //a specific value was specified for goal property
    if (goalProperty.value !== undefined) {
        //a specific value was specified for blueprint property
        if (blueprintProperty.value !== undefined) {
            //verify if both values are the same
            if (goalProperty.value !== blueprintProperty.value) {
                //goal property is not fulfilled
                return false
            }
            //no specific value was specified for the blueprint property
        } else {
            //goal property is not fulfilled
            return false
        }
    }
    //all checks were passed, property was fulfilled
    return true;
}

