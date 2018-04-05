var exports = module.exports = {};

exports.assessGoal = function assessGoal(goalList, goalName, metrics, generalMetrics) {
    //look for a goal whose name is identical to goalName
    for (var goal in goalList) {
        if (goalList[goal].id === goalName) {
            //verify if all metrics belonging to that goal are fulfilled
            for (var goalMetric in goalList[goal].metrics) {
                //look for blueprint metrics compatible with the one indicated in the goal
                var compatibleMetrics = [];
                for (var metric in metrics) {
                    if (metrics[metric].type === goalList[goal].metrics[goalMetric].type) {
                        compatibleMetrics.push(metrics[metric]);
                    }
                }
                //a compatible metric was not found
                if (compatibleMetrics.length === 0) {
                    //look into general metrics
                    for (metric in generalMetrics) {
                        if (generalMetrics[metric].type === goalList[goal].metrics[goalMetric].type) {
                            compatibleMetrics.push(generalMetrics[metric]);
                        }
                    }
                }
                //if the metric was not fulfilled (or not found), also the whole goal is not
                if (!assessMetric(goalList[goal].metrics[goalMetric], compatibleMetrics)) {
                    return 0;
                }
            }
            //if we reached the end of the cycle, then the goal is fulfilled
            //thus, return the weight
            return goalList[goal].weight;
        }
    }
    //application requirements are malformed
    return 0;
}

exports.assessMetric = function assessMetric(goalMetric, blueprintMetrics) {
    //solo per data quality, su security e privacy invocare ws TUB
    for (var goalProperty in goalMetric.properties) {
        var fulfilled = false;
        for (var metric in blueprintMetrics) {
            for (var blueprintProperty in blueprintMetrics[metric].properties) {
                if (goalMetric.properties[property].name === blueprintMetrics[metric].properties[blueprintProperty].name) {
                    if (assessProperty(goalMetric.properties[goalProperty], blueprintMetrics[metric].properties[blueprintProperty])) {
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

