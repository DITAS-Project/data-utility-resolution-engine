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

    describe('assessMetric function tests -> ', function () {
        it('metric with single property', function () {
            var goalMetric = {
                "id": "1",
                "name": "Availability 90-99",
                "type": "Availability",
                "properties": [
                    {
                        "name": "Availability",
                        "unit": "percentage",
                        "minimum": 90,
                        "maximum": 99
                    }
                ]
            };
            var blueprintMetric1 = {
                "id": "1",
                "name": "Availability 92-95",
                "type": "Availability",
                "properties": [
                    {
                        "name": "Availability",
                        "unit": "percentage",
                        "minimum": 92,
                        "maximum": 95
                    }
                ]
            };
            var blueprintMetric2 = {
                "id": "1",
                "name": "Availability 90-100",
                "type": "Availability",
                "properties": [
                    {
                        "name": "Availability",
                        "unit": "percentage",
                        "minimum": 90,
                        "maximum": 100
                    }
                ]
            };
            var blueprintMetric3 = {
                "id": "1",
                "name": "Availability 80-95",
                "type": "Availability",
                "properties": [
                    {
                        "name": "Availability",
                        "unit": "percentage",
                        "minimum": 80,
                        "maximum": 95
                    }
                ]
            };
            expect(evaluator.assessMetric(goalMetric, [blueprintMetric1, blueprintMetric2])).toBe(true);
            expect(evaluator.assessMetric(goalMetric, [blueprintMetric1, blueprintMetric3])).toBe(true);
            expect(evaluator.assessMetric(goalMetric, [blueprintMetric2, blueprintMetric3])).toBe(false);
        });
    });

    describe('assessGoal function tests -> ', function () {
        it('goals with single metric', function () {
            var goalList = [
                {
                    "id": "1",
                    "name": "Service available",
                    "weight": 1,
                    "metrics":
                    [
                        {
                            "id": "1",
                            "name": "Availability 95-99",
                            "type": "Availability",
                            "properties": [
                                {
                                    "name": "Availability",
                                    "unit": "percentage",
                                    "minimum": 95,
                                    "maximum": 99
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "2",
                    "name": "Fast data process",
                    "weight": 1,
                    "metrics":
                    [
                        {
                            "id": "2",
                            "name": "ResponseTime 1",
                            "type": "ResponseTime",
                            "properties": [
                                {
                                    "name": "ResponseTime",
                                    "maximum": 1,
                                    "unit": "second"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "3",
                    "name": "Data volume",
                    "weight": 1,
                    "metrics":
                    [
                        {
                            "id": "3",
                            "name": "volume 10000",
                            "type": "volume",
                            "properties": [
                                {
                                    "name": "volume",
                                    "value": "10000",
                                    "unit": "tuple"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "4",
                    "name": "Temporal validity",
                    "weight": 1,
                    "metrics":
                    [
                        {
                            "id": "4",
                            "name": "Timeliness 0.6",
                            "type": "Timeliness",
                            "properties": [
                                {
                                    "name": "Timeliness",
                                    "maximum": 0.6,
                                    "unit": "NONE"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "5",
                    "name": "Amount of Data",
                    "weight": 1,
                    "metrics":
                    [
                        {
                            "id": "5",
                            "name": "Process completeness 90",
                            "type": "Process completeness",
                            "properties": [
                                {
                                    "name": "Process completeness",
                                    "minimum": 90,
                                    "unit": "percentage"
                                }
                            ]
                        }
                    ]
                }
            ];
            var metrics = [
                {
                    "id": "1",
                    "name": "Availability 95-99",
                    "type": "Availability",
                    "properties": [
                        {
                            "name": "Availability",
                            "unit": "percentage",
                            "minimum": 95,
                            "maximum": 99
                        }
                    ]
                },
                {
                    "id": "2",
                    "name": "ResponseTime 1",
                    "type": "ResponseTime",
                    "properties": [
                        {
                            "name": "ResponseTime",
                            "maximum": 1,
                            "unit": "second"
                        }
                    ]
                },
                {
                    "id": "3",
                    "name": "volume 10000",
                    "type": "volume",
                    "properties": [
                        {
                            "name": "volume",
                            "value": "5000",
                            "unit": "tuple"
                        }
                    ]
                },
                {
                    "id": "4",
                    "name": "Timeliness 0.6",
                    "type": "Timeliness",
                    "properties": [
                        {
                            "name": "Timeliness",
                            "maximum": 0.6,
                            "unit": "NONE"
                        }
                    ]
                },
                {
                    "id": "5",
                    "name": "Process completeness 90",
                    "type": "Process completeness",
                    "properties": [
                        {
                            "name": "Process completeness",
                            "minimum": 80,
                            "unit": "percentage"
                        }
                    ]
                }
            ];
            expect(evaluator.assessGoal(goalList, "undefinedGoal", metrics, [])).toBe(0);
            expect(evaluator.assessGoal(goalList, "1", metrics, [])).toBe(1);
            expect(evaluator.assessGoal(goalList, "2", metrics, [])).toBe(1);
            expect(evaluator.assessGoal(goalList, "3", metrics, [])).toBe(0);
            expect(evaluator.assessGoal(goalList, "4", metrics, [])).toBe(1);
            expect(evaluator.assessGoal(goalList, "5", metrics, [])).toBe(0);
            expect(evaluator.assessGoal(goalList, "undefinedGoal", [], metrics)).toBe(0);
            expect(evaluator.assessGoal(goalList, "1", [], metrics)).toBe(1);
            expect(evaluator.assessGoal(goalList, "2", [], metrics)).toBe(1);
            expect(evaluator.assessGoal(goalList, "3", [], metrics)).toBe(0);
            expect(evaluator.assessGoal(goalList, "4", [], metrics)).toBe(1);
            expect(evaluator.assessGoal(goalList, "5", [], metrics)).toBe(0);
        });
        it('goals with multiple metrics', function () {
            var goalList = [
                {
                    "id": "1",
                    "name": "Service available and fast data process",
                    "weight": 1,
                    "metrics":
                    [
                        {
                            "id": "1",
                            "name": "Availability 95-99",
                            "type": "Availability",
                            "properties": [
                                {
                                    "name": "Availability",
                                    "unit": "percentage",
                                    "minimum": 95,
                                    "maximum": 99
                                }
                            ]
                        },
                        {
                            "id": "2",
                            "name": "ResponseTime 1",
                            "type": "ResponseTime",
                            "properties": [
                                {
                                    "name": "ResponseTime",
                                    "maximum": 1,
                                    "unit": "second"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "2",
                    "name": "Fast data process and high data volume",
                    "weight": 1,
                    "metrics":
                    [
                        {
                            "id": "1",
                            "name": "ResponseTime 1",
                            "type": "ResponseTime",
                            "properties": [
                                {
                                    "name": "ResponseTime",
                                    "maximum": 1,
                                    "unit": "second"
                                }
                            ]
                        },
                        {
                            "id": "3",
                            "name": "volume 10000",
                            "type": "volume",
                            "properties": [
                                {
                                    "name": "volume",
                                    "value": "10000",
                                    "unit": "tuple"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "3",
                    "name": "Data volume and temporal validity",
                    "weight": 1,
                    "metrics":
                    [
                        {
                            "id": "3",
                            "name": "volume 10000",
                            "type": "volume",
                            "properties": [
                                {
                                    "name": "volume",
                                    "value": "10000",
                                    "unit": "tuple"
                                }
                            ]
                        },
                        {
                            "id": "4",
                            "name": "Timeliness 0.6",
                            "type": "Timeliness",
                            "properties": [
                                {
                                    "name": "Timeliness",
                                    "maximum": 0.6,
                                    "unit": "NONE"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "4",
                    "name": "Temporal validity and fast data process",
                    "weight": 1,
                    "metrics":
                    [
                        {
                            "id": "1",
                            "name": "ResponseTime 1",
                            "type": "ResponseTime",
                            "properties": [
                                {
                                    "name": "ResponseTime",
                                    "maximum": 1,
                                    "unit": "second"
                                }
                            ]
                        },
                        {
                            "id": "4",
                            "name": "Timeliness 0.6",
                            "type": "Timeliness",
                            "properties": [
                                {
                                    "name": "Timeliness",
                                    "maximum": 0.6,
                                    "unit": "NONE"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "5",
                    "name": "Amount of Data and temporal validity",
                    "weight": 1,
                    "metrics":
                    [
                        {
                            "id": "1",
                            "name": "ResponseTime 1",
                            "type": "ResponseTime",
                            "properties": [
                                {
                                    "name": "ResponseTime",
                                    "maximum": 1,
                                    "unit": "second"
                                }
                            ]
                        },
                        {
                            "id": "5",
                            "name": "Process completeness 90",
                            "type": "Process completeness",
                            "properties": [
                                {
                                    "name": "Process completeness",
                                    "minimum": 90,
                                    "unit": "percentage"
                                }
                            ]
                        }
                    ]
                }
            ];
            var metrics = [
                {
                    "id": "1",
                    "name": "Availability 95-99",
                    "type": "Availability",
                    "properties": [
                        {
                            "name": "Availability",
                            "unit": "percentage",
                            "minimum": 95,
                            "maximum": 99
                        }
                    ]
                },
                {
                    "id": "2",
                    "name": "ResponseTime 1",
                    "type": "ResponseTime",
                    "properties": [
                        {
                            "name": "ResponseTime",
                            "maximum": 1,
                            "unit": "second"
                        }
                    ]
                },
                {
                    "id": "3",
                    "name": "volume 10000",
                    "type": "volume",
                    "properties": [
                        {
                            "name": "volume",
                            "value": "5000",
                            "unit": "tuple"
                        }
                    ]
                },
                {
                    "id": "4",
                    "name": "Timeliness 0.6",
                    "type": "Timeliness",
                    "properties": [
                        {
                            "name": "Timeliness",
                            "maximum": 0.6,
                            "unit": "NONE"
                        }
                    ]
                },
                {
                    "id": "5",
                    "name": "Process completeness 90",
                    "type": "Process completeness",
                    "properties": [
                        {
                            "name": "Process completeness",
                            "minimum": 80,
                            "unit": "percentage"
                        }
                    ]
                }
            ];
            expect(evaluator.assessGoal(goalList, "undefinedGoal", metrics, [])).toBe(0);
            expect(evaluator.assessGoal(goalList, "1", metrics, [])).toBe(1);
            expect(evaluator.assessGoal(goalList, "2", metrics, [])).toBe(0);
            expect(evaluator.assessGoal(goalList, "3", metrics, [])).toBe(0);
            expect(evaluator.assessGoal(goalList, "4", metrics, [])).toBe(1);
            expect(evaluator.assessGoal(goalList, "5", metrics, [])).toBe(0);
            expect(evaluator.assessGoal(goalList, "undefinedGoal", [], metrics)).toBe(0);
            expect(evaluator.assessGoal(goalList, "1", [], metrics)).toBe(1);
            expect(evaluator.assessGoal(goalList, "2", [], metrics)).toBe(0);
            expect(evaluator.assessGoal(goalList, "3", [], metrics)).toBe(0);
            expect(evaluator.assessGoal(goalList, "4", [], metrics)).toBe(1);
            expect(evaluator.assessGoal(goalList, "5", [], metrics)).toBe(0);
        });
    });
});