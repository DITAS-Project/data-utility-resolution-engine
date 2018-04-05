var evaluator = require("../app/evaluator");

describe('evaluator module unit test -> ', function () {
    describe('assessProperty function tests -> ', function () {
        it('checks for equality', function () {
            var goalProperty = {
                "name": "Algorithm",
                "unit": "enum",
                "value": "AES"
            };
            var blueprintPropertyTrue = {
                "name": "Algorithm",
                "unit": "enum",
                "value": "AES"
            };
            var blueprintPropertyFalse = {
                "name":"Algorithm",
                "unit":"enum",
                "value":"RSA"
            }
            expect(evaluator.assessProperty(goalProperty, blueprintPropertyTrue)).toBe(true);
            expect(evaluator.assessProperty(goalProperty, blueprintPropertyFalse)).toBe(false);
        });

        it('checks for within range', function () {
            var goalPropertyRange = {
                "name": "Availability",
                "unit": "percentage",
                "minimum": 90,
                "maximum": 99
            };
            var blueprintPropertyRange = {
                "name": "Availability",
                "unit": "percentage",
                "minimum": 95,
                "maximum": 98
            };
            var goalPropertyLower = {
                "name": "Availability",
                "unit": "percentage",
                "minimum": 90
            };
            var blueprintPropertyLower = {
                "name": "Availability",
                "unit": "percentage",
                "minimum": 95
            };
            var goalPropertyUpper = {
                "name": "ResponseTime",
                "maximum": 1,
                "unit": "second"
            };
            var blueprintPropertyUpper = {
                "name": "ResponseTime",
                "maximum": 1,
                "unit": "second"
            };
            var blueprintPropertyUpper2 = {
                "name": "ResponseTime",
                "maximum": 0.5,
                "unit": "second"
            };
            
            expect(evaluator.assessProperty(goalPropertyRange, blueprintPropertyRange)).toBe(true);
            expect(evaluator.assessProperty(goalPropertyLower, blueprintPropertyLower)).toBe(true);
            expect(evaluator.assessProperty(goalPropertyUpper, blueprintPropertyUpper)).toBe(true);
            expect(evaluator.assessProperty(goalPropertyUpper, blueprintPropertyUpper2)).toBe(true);
        });

        it('checks for out of range', function () {
            var goalPropertyRange = {
                "name": "Availability",
                "unit": "percentage",
                "minimum": 90,
                "maximum": 95
            };
            var blueprintPropertyRange = {
                "name": "Availability",
                "unit": "percentage",
                "minimum": 80,
                "maximum": 99
            };
            var blueprintPropertyRange2 = {
                "name": "Availability",
                "unit": "percentage",
                "minimum": 91,
                "maximum": 99
            };
            var blueprintPropertyRange3 = {
                "name": "Availability",
                "unit": "percentage",
                "minimum": 80,
                "maximum": 94
            };
            var goalPropertyLower = {
                "name": "Availability",
                "unit": "percentage",
                "minimum": 90
            };
            var blueprintPropertyLower = {
                "name": "Availability",
                "unit": "percentage",
                "minimum": 85
            };
            var goalPropertyUpper = {
                "name": "ResponseTime",
                "maximum": 1,
                "unit": "second"
            };
            var blueprintPropertyUpper = {
                "name": "ResponseTime",
                "maximum": 2,
                "unit": "second"
            };

            expect(evaluator.assessProperty(goalPropertyRange, blueprintPropertyRange)).toBe(false);
            expect(evaluator.assessProperty(goalPropertyRange, blueprintPropertyRange2)).toBe(false);
            expect(evaluator.assessProperty(goalPropertyRange, blueprintPropertyRange3)).toBe(false);
            expect(evaluator.assessProperty(goalPropertyLower, blueprintPropertyLower)).toBe(false);
            expect(evaluator.assessProperty(goalPropertyUpper, blueprintPropertyUpper)).toBe(false);
        });
    });
});