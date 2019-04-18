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

var evaluator = require("../app/evaluatorV2");

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

        test('checks for lower bound', () => {
            var goalPropertyLowerBound = {
                "name": "Availability",
                "unit": "percentage",
                "minimum": 90
            };
            var blueprintPropertyMinMaxOk = {
                "name": "Availability",
                "unit": "percentage",
                "minimum": 95,
                "maximum": 98
            };
            var blueprintPropertyMinMaxValOk = {
                "name": "Availability",
                "unit": "percentage",
                "minimum": 95,
                "value": 97,
                "maximum": 98
            };
            var blueprintPropertyMinKoMaxValOk = {
                "name": "Availability",
                "unit": "percentage",
                "minimum": 89,
                "value": 97,
                "maximum": 98
            };
            var blueprintPropertyMinValKoMaxOk = {
                "name": "Availability",
                "unit": "percentage",
                "minimum": 80,
                "value": 85,
                "maximum": 92
            };
            var blueprintPropertyMinOk = {
                "name": "Availability",
                "unit": "percentage",
                "minimum": 95
            };
            var blueprintPropertyMaxOk = {
                "name": "Availability",
                "maximum": 92,
                "unit": "percentage"
            };
            var blueprintPropertyMaxKo = {
                "name": "Availability",
                "maximum": 85,
                "unit": "percentage"
            };
            
            expect(evaluator.assessProperty(goalPropertyLowerBound, blueprintPropertyMinMaxOk)).toBe(1);
            expect(evaluator.assessProperty(goalPropertyLowerBound, blueprintPropertyMinOk)).toBe(1);
            expect(evaluator.assessProperty(goalPropertyLowerBound, blueprintPropertyMaxOk)).toBe(1);
            expect(evaluator.assessProperty(goalPropertyLowerBound, blueprintPropertyMinMaxValOk)).toBe(1);
            expect(evaluator.assessProperty(goalPropertyLowerBound, blueprintPropertyMinKoMaxValOk)).toBe(1);
            expect(evaluator.assessProperty(goalPropertyLowerBound, blueprintPropertyMinValKoMaxOk)).toBe(1);
            expect(evaluator.assessProperty(goalPropertyLowerBound, blueprintPropertyMaxKo)).toBe(0);
        });

        test('checks for upper bound', () => {
            var goalPropertyUpperBound = {
                "name": "ResponseTime",
                "maximum": 0.2,
                "unit": "second"
            };
            var blueprintPropertyMinMaxOk = {
                "name": "ResponseTime",
                "unit": "second",
                "minimum": 0.1,
                "maximum": 0.05
            };
            var blueprintPropertyMinMaxValOk = {
                "name": "ResponseTime",
                "unit": "second",
                "minimum": 0.1,
                "value": 0.05,
                "maximum": 0.01
            };
            var blueprintPropertyMinKoMaxValOk = {
                "name": "ResponseTime",
                "unit": "second",
                "minimum": 0.5,
                "value": 0.1,
                "maximum": 0.05
            };
            var blueprintPropertyMinValKoMaxOk = {
                "name": "ResponseTime",
                "unit": "second",
                "minimum": 0.8,
                "value": 0.5,
                "maximum": 0.1
            };
            var blueprintPropertyMinOk = {
                "name": "ResponseTime",
                "unit": "second",
                "minimum": 0.1
            };
            var blueprintPropertyMaxOk = {
                "name": "ResponseTime",
                "maximum": 0.1,
                "unit": "second"
            };
            var blueprintPropertyMaxKo = {
                "name": "ResponseTime",
                "maximum": 0.5,
                "unit": "second"
            };

            expect(evaluator.assessProperty(goalPropertyUpperBound, blueprintPropertyMinMaxOk)).toBe(1);
            expect(evaluator.assessProperty(goalPropertyUpperBound, blueprintPropertyMinOk)).toBe(1);
            expect(evaluator.assessProperty(goalPropertyUpperBound, blueprintPropertyMaxOk)).toBe(1);
            expect(evaluator.assessProperty(goalPropertyUpperBound, blueprintPropertyMinMaxValOk)).toBe(1);
            expect(evaluator.assessProperty(goalPropertyUpperBound, blueprintPropertyMinKoMaxValOk)).toBe(1);
            expect(evaluator.assessProperty(goalPropertyUpperBound, blueprintPropertyMinValKoMaxOk)).toBe(1);
            expect(evaluator.assessProperty(goalPropertyUpperBound, blueprintPropertyMaxKo)).toBe(0);
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
                        "minimum": 90
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
                        "maximum": 90
                    }
                }
            };
            expect(evaluator.assessDUAttributes(goalAttribute, blueprintAttribute1)).toBe(1);
            expect(evaluator.assessDUAttributes(goalAttribute, blueprintAttribute2)).toBe(1);
            expect(evaluator.assessDUAttributes(goalAttribute, blueprintAttribute3)).toBe(0);
        });
    });

});