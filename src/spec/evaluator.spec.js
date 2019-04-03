/*
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

var evaluator = require("../app/evaluator");

describe('evaluator module unit test', () => {
    describe('assessProperty function tests', () => {
        test('checks for equality', () => {
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
            expect(evaluator.assessProperty(goalProperty, blueprintPropertyTrue)).toBe(1);
            expect(evaluator.assessProperty(goalProperty, blueprintPropertyFalse)).toBe(0);
        });

        test('checks for within range', () => {
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
            
            expect(evaluator.assessProperty(goalPropertyRange, blueprintPropertyRange)).toBe(1);
            expect(evaluator.assessProperty(goalPropertyLower, blueprintPropertyLower)).toBe(1);
            expect(evaluator.assessProperty(goalPropertyUpper, blueprintPropertyUpper)).toBe(1);
            expect(evaluator.assessProperty(goalPropertyUpper, blueprintPropertyUpper2)).toBe(1);
        });

        test('checks for out of range', () => {
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

            expect(evaluator.assessProperty(goalPropertyRange, blueprintPropertyRange)).toBe(0);
            expect(evaluator.assessProperty(goalPropertyRange, blueprintPropertyRange2)).toBe(0);
            expect(evaluator.assessProperty(goalPropertyRange, blueprintPropertyRange3)).toBe(0);
            expect(evaluator.assessProperty(goalPropertyLower, blueprintPropertyLower)).toBe(0);
            expect(evaluator.assessProperty(goalPropertyUpper, blueprintPropertyUpper)).toBe(0);
        });
    });

    describe('assessDUAttributes function tests', () => {
        test('attribute with single property', () => {
            var goalAttribute = {
                "id": "1",
                "name": "Availability 90-99",
                "type": "Availability",
                "properties": {
                    "Availability": {
                        "unit": "percentage",
                        "minimum": 90,
                        "maximum": 99
                    }
                }
            };
            var blueprintAttribute1 = {
                "id": "1",
                "name": "Availability 92-95",
                "type": "Availability",
                "properties": {
                    "Availability": {
                        "unit": "percentage",
                        "minimum": 92,
                        "maximum": 95
                    }
                }
            };
            var blueprintAttribute2 = {
                "id": "1",
                "name": "Availability 90-100",
                "type": "Availability",
                "properties": {
                    "Availability": {
                        "unit": "percentage",
                        "minimum": 90,
                        "maximum": 100
                    }
                }
            };
            var blueprintAttribute3 = {
                "id": "1",
                "name": "Availability 80-95",
                "type": "Availability",
                "properties": {
                    "Availability": {
                        "unit": "percentage",
                        "minimum": 80,
                        "maximum": 95
                    }
                }
            };
            expect(evaluator.assessDUAttributes(goalAttribute, blueprintAttribute1, blueprintAttribute1)).toBe(1);
            expect(evaluator.assessDUAttributes(goalAttribute, blueprintAttribute2, blueprintAttribute2)).toBe(0);
            expect(evaluator.assessDUAttributes(goalAttribute, blueprintAttribute3, blueprintAttribute3)).toBe(0);
        });
    });

});