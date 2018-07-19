var exports = module.exports = {};
var evaluator = require("./evaluator");

exports.pruneGoalTree = function pruneGoalTree(constraints, sourceNode, attributes, optimum) {
    var ret = 0;
    var targetNode = {};
    var leaves = [];
    var children = [];
    if (sourceNode === undefined) {
        return targetNode;
    }
    targetNode.type = sourceNode.type;
    for (var child in sourceNode.children) {
        //recursively invoke function for each child node
        ret = pruneGoalTree(constraints, sourceNode.children[child], attributes, optimum);
        // if a child node is accepted, then add it to the pruned tree
        if (ret !== undefined) {
            if (ret.leaves === undefined) {
                //returned node is a leaf goal
                leaves.push(ret);
            } else {
                children.push(ret);
            }
        } else {
            //when current node type is AND, the first child node that is discarded makes the current node also discarded
            if (sourceNode.type === 'AND') {
                return undefined;
            }
        }
    }
    for (var leaf in sourceNode.leaves) {
        //recursively invoke function for each leaf goal
        ret = evaluator.assessGoal(constraints, sourceNode.leaves[leaf], attributes, optimum);
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
    } else if (leaves.length === 0 && children.length === 1) {
        return children[0];
    } else if (leaves.length === 1 && children.length === 0) {
        return leaves[0];
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
