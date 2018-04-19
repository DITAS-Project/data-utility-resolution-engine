var ranker = require("../app/ranker");

describe('ranker module unit test -> ', function () {
    describe('computeNodeScore function tests -> ', function () {
        it('one metric per goal, uniform weight', function () {
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
            var node = {
                "type": "AND",
                "children":
                [
                    {
                        "type": "OR",
                        "leaves": ["1", "4"]
                    },
                    {
                        "type": "AND",
                        "children":
                        [
                            {
                                "type": "OR",
                                "leaves":
                                [
                                    "3",
                                    "5"
                                ]
                            }
                        ],
                        "leaves":
                        [
                            "2"
                        ]
                    }
                ]
            };
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
            ];
            expect(ranker.computeScore(goalList, node, metrics, [])).toBe(5 / 5);
            goalList[0].metrics[0].properties[0].minimum = 97;
            expect(ranker.computeScore(goalList, node, metrics, [])).toBe(4 / 5);
            goalList[1].metrics[0].properties[0].maximum = 0.5;
            expect(ranker.computeScore(goalList, node, metrics, [])).toBe(0);
        });
        it('multiple metrics per goal, uniform weight', function () {
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
                    "name": "Complete Data and fast data process",
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
            var node = {
                "type": "OR",
                "children":
                [
                    {
                        "type": "AND",
                        "leaves": ["5", "2"]
                    },
                    {
                        "type": "OR",
                        "children":
                        [
                            {
                                "type": "AND",
                                "leaves":
                                [
                                    "1",
                                    "3"
                                ]
                            }
                        ],
                        "leaves":
                        [
                            "4"
                        ]
                    }
                ]
            };
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
            ];
            expect(ranker.computeScore(goalList, node, metrics, [])).toBe(5 / 5);
            metrics[3].properties[0].maximum = 0.7;
            expect(ranker.computeScore(goalList, node, metrics, [])).toBe(2 / 5);
            metrics[1].properties[0].maximum = 5000;
            expect(ranker.computeScore(goalList, node, metrics, [])).toBe(0);
        });
        it('one metric per goal, non-uniform weight', function () {
            var goalList = [
                {
                    "id": "1",
                    "name": "Service available",
                    "weight": 3,
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
                    "weight": 2,
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
                    "weight": 4,
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
                    "weight": 5,
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
            var node = {
                "type": "AND",
                "children":
                [
                    {
                        "type": "OR",
                        "leaves": ["1", "4"]
                    },
                    {
                        "type": "AND",
                        "children":
                        [
                            {
                                "type": "OR",
                                "leaves":
                                [
                                    "3",
                                    "5"
                                ]
                            }
                        ],
                        "leaves":
                        [
                            "2"
                        ]
                    }
                ]
            };
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
            ];
            expect(ranker.computeScore(goalList, node, metrics, [])).toBe(15 / 15);
            goalList[0].metrics[0].properties[0].minimum = 97;
            expect(ranker.computeScore(goalList, node, metrics, [])).toBe(12 / 15);
            goalList[4].metrics[0].properties[0].minimum = 95;
            expect(ranker.computeScore(goalList, node, metrics, [])).toBe(7 / 15);
            goalList[3].metrics[0].properties[0].maximum = 0.4;
            expect(ranker.computeScore(goalList, node, metrics, [])).toBe(0);
        });
        it('multiple metrics per goal, non-uniform weight', function () {
            var goalList = [
                {
                    "id": "1",
                    "name": "Service available and fast data process",
                    "weight": 4,
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
                    "weight": 2,
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
                    "weight": 3,
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
                    "name": "Complete Data and fast data process",
                    "weight": 5,
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
            var node = {
                "type": "OR",
                "children":
                [
                    {
                        "type": "AND",
                        "leaves": ["5", "2"]
                    },
                    {
                        "type": "OR",
                        "children":
                        [
                            {
                                "type": "AND",
                                "leaves":
                                [
                                    "1",
                                    "3"
                                ]
                            }
                        ],
                        "leaves":
                        [
                            "4"
                        ]
                    }
                ]
            };
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
            ];
            expect(ranker.computeScore(goalList, node, metrics, [])).toBe(15 / 15);
            metrics[0].properties[0].maximum = 100;
            expect(ranker.computeScore(goalList, node, metrics, [])).toBe(10 / 15);
            metrics[3].properties[0].maximum = 0.7;
            expect(ranker.computeScore(goalList, node, metrics, [])).toBe(7 /15);
            metrics[1].properties[0].maximum = 5000;
            expect(ranker.computeScore(goalList, node, metrics, [])).toBe(0);
        });
    });
});