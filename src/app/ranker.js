var exports = module.exports = {};
var evaluator = require("./evaluator");

exports.computeGlobalScore = function computeGlobalScore(dataUtilityScore, securityScore, privacyScore) {
    if (securityScore > 0 && privacyScore > 0) {
        return dataUtilityScore;
    } else {
        return 0;
    }
}

exports.computeNodeScore = function computeNodeScore(goalList, node, metrics, generalMetrics) {
    console.log("checkNode, node:");
    console.log(node);
    var scoreboard = [];
    var ret = 0;
    for (var child in node.children) {
        //recursively invoke function for each child node
        ret = computeNodeScore(goalList, node.children[child], metrics, generalMetrics);
        //when current node type is AND, the first child node that is not satisfied makes the current node also not satisfied
        if (ret === 0 && node.type === 'AND') {
            return 0;
        } else {
            scoreboard.push(ret);
        }
    }
    for (var leaf in node.leaves) {
        //recursively invoke function for each leaf goal
        ret = evaluator.assessGoal(goalList, node.leaves[leaf], metrics, generalMetrics);
        //when current node type is AND, the first leaf goal that is not satisfied makes the current node also not satisfied
        if (ret === 0 && node.type === 'AND') {
            return 0;
        } else {
            scoreboard.push(ret);
        }
    }
    //return result to parent node
    return scoreboard.reduce(function (a, b) {
        return a + b;
    }, 0) / scoreboard.length;
}