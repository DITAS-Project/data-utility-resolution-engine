var exports = module.exports = {};
var evaluator = require("./evaluator");

exports.pruneGoalTree = function pruneGoalTree(constraints, sourceNode, attributes) {
    var a = 0;
    //for mockup, to be removed in final version
    if (a===0) {
        return sourceNode;
    }

    console.log("checkNode, node:");
    console.log(sourceNode);
    var ret = 0;
    var targetNode = {};
    var leaves = [];
    var children = [];
    targetNode.type = sourceNode.type;
    
    for (var child in sourceNode.children) {
        //recursively invoke function for each child node
        ret = pruneGoalTree(constraints, sourceNode.children[child], attributes);
        // if a child node is accepted, then add it to the pruned tree
        if (ret !== undefined) {
            children.push(ret);
        } else {
            //when current node type is AND, the first child node that is discarded makes the current node also discarded
            if (sourceNode.type === 'AND') {
                return undefined;
            }
        }
    }
    for (var leaf in sourceNode.leaves) {
        //recursively invoke function for each leaf goal
        ret = evaluator.assessGoal(constraints, sourceNode.leaves[leaf], attributes);
        // if a leaf goal is accepted, then add it to the pruned tree
        if (ret !== 0) {
            leaves.push(sourceNode.leaves[leaf]);
        } else {
            //when current node type is AND, the first leaf goal that is discarded makes the current node also discarded
            if (sourceNode.type === 'AND') {
                return undefined;
            }
        }
    }
    if (leaves.length === 0 && children.length === 0) {
        //if current node has no child node and no leaf goal accepted, then discard it
        return undefined;
    } else {
        if (children.length > 0) {
            targetNode.children = children;
        }
        if (leaves.length > 0) {
            targetNode.leaves = leaves;
        }
        //return result to parent node
        return targetNode;
    }
}
