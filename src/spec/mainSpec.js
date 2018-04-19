var unirest = require('unirest');

describe('REST service unit test -> ', function () {
    describe('rankBlueprints method tests -> ', function () {
        it('one metric per goal, uniform weight', function (done) {
            
            var req = {
                "functionalRequirements":
                {
                    "keywords": ["Restaurant in Milan", "Milan", "Restaurant"],
                    "schema":
                    {
                        "attributes": ["city", "date", "state"]
                    }

                },
                "goalTrees":
                {
                    "dataUtility":
                    {
                        "goals":
                        [
                            {
                                "id": "1",
                                "name": "Service available",
                                "weight": 1,
                                "metrics":
                                [
                                    {
                                        "id": "1",
                                        "name": "Availability 99",
                                        "type": "Availability",
                                        "properties": [
                                            {
                                                "name": "Availability",
                                                "unit": "percentage",
                                                "minimum": 99
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
                            }
                        ],
                        "treeStructure":
                        {
                            "type": "AND",
                            "children":
                            [
                                {
                                    "type": "AND",
                                    "children":
                                    [
                                        {
                                            "type": "OR",
                                            "leaves":
                                            [
                                                "1"
                                            ]
                                        },
                                        {
                                            "type": "OR",
                                            "leaves":
                                            [
                                                "2"
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    },
                    "security":
                    {
                        "goals":
                        [
                            {
                                "id": "1",
                                "name": "Encryption",
                                "weight": 1,
                                "metrics": [
                                    {
                                        "id": "1",
                                        "name": "Encryption AES 128",
                                        "type": "Encryption",
                                        "properties": [
                                            {
                                                "name": "Algorithm",
                                                "unit": "enum",
                                                "value": "AES"
                                            },
                                            {
                                                "name": "Keylength",
                                                "unit": "number",
                                                "minimum": 128
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "id": "2",
                                "name": "Tracing",
                                "weight": 1,
                                "metrics":
                                [
                                    {
                                        "id": "2",
                                        "name": "Tracing",
                                        "type": "Tracing",
                                        "properties":
                                        [
                                            {
                                                "name": "Level",
                                                "unit": "enum",
                                                "value": "datasource"
                                            },
                                            {
                                                "name": "SampleRate",
                                                "unit": "percentage",
                                                "minimum": 99,
                                                "maximum": 100
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "id": "3",
                                "name": "ACL rolebased readOnly",
                                "weight": 1,
                                "metrics":
                                [
                                    {
                                        "id": "3",
                                        "name": "ACL rolebased readOnly",
                                        "type": "ACL",
                                        "properties":
                                        [
                                            {
                                                "name": "Kind",
                                                "unit": "enum",
                                                "value": "rolebased"
                                            },
                                            {
                                                "name": "Role",
                                                "unit": "enum",
                                                "value": "readOnly"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "id": "4",
                                "name": "ACL rolebased readNonPersonal",
                                "weight": 1,
                                "metrics":
                                [
                                    {
                                        "id": "4",
                                        "name": "ACL rolebased readNonPersonal",
                                        "type": "ACL",
                                        "properties":
                                        [
                                            {
                                                "name": "Kind",
                                                "unit": "enum",
                                                "value": "rolebased"
                                            },
                                            {
                                                "name": "Role",
                                                "unit": "enum",
                                                "value": "readNonPersonal"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        "treeStructure":
                        {
                            "type": "AND",
                            "children":
                            [
                                {
                                    "type": "OR",
                                    "leaves":
                                    [
                                        "1",
                                        "2"
                                    ]
                                }
                            ],
                            "leaves": [
                                "3",
                                "4"
                            ]
                        }
                    },
                    "privacy":
                    {
                        "goals":
                        [
                            {
                                "id": "1",
                                "name": "PurposeControl",
                                "weight": 1,
                                "metrics": [
                                    {
                                        "id": "1",
                                        "name": "PurposeControl NonCommercial Government",
                                        "type": "PurposeControl",
                                        "properties":
                                        [
                                            {
                                                "name": "AllowedPurpose",
                                                "unit": "enum",
                                                "value": "NonCommercial"
                                            },
                                            {
                                                "name": "AllowedGuarantor",
                                                "unit": "enum",
                                                "value": "Government"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        "treeStructure":
                        {
                            "type": "OR",
                            "leaves":
                            [
                                "1"
                            ]
                        }
                    }

                }
            };
            var bp = {
                "UUID": "id_2",
                "DATA_MANAGEMENT": {
                    "functionalProperties":
                    {
                        "tbd": "tbd"
                    },
                    "methods":
                    [
                        {
                            "name": "GetAllBloodTests",
                            "metrics":
                            {
                                "dataUtility":
                                [
                                    {
                                        "id": "1",
                                        "name": "Availability 99",
                                        "type": "Availability",
                                        "properties": [
                                            {
                                                "name": "Availability",
                                                "unit": "percentage",
                                                "minimum": 99
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
                                ],
                                "security":
                                [
                                    {
                                        "id": "1",
                                        "name": "Encryption AES 128",
                                        "type": "Encryption",
                                        "properties": [
                                            {
                                                "name": "Algorithm",
                                                "unit": "enum",
                                                "value": "AES"
                                            },
                                            {
                                                "name": "Keylength",
                                                "unit": "number",
                                                "minimum": 128
                                            }
                                        ]
                                    },
                                    {
                                        "id": "2",
                                        "name": "Tracing",
                                        "type": "Tracing",
                                        "properties":
                                        [
                                            {
                                                "name": "Level",
                                                "unit": "enum",
                                                "value": "datasource"
                                            },
                                            {
                                                "name": "SampleRate",
                                                "unit": "percentage",
                                                "minimum": 99,
                                                "maximum": 100
                                            }
                                        ]
                                    },
                                    {
                                        "id": "3",
                                        "name": "ACL rolebased readOnly",
                                        "type": "ACL",
                                        "properties":
                                        [
                                            {
                                                "name": "Kind",
                                                "unit": "enum",
                                                "value": "rolebased"
                                            },
                                            {
                                                "name": "Role",
                                                "unit": "enum",
                                                "value": "readOnly"
                                            }
                                        ]
                                    },
                                    {
                                        "id": "4",
                                        "name": "ACL rolebased readNonPersonal",
                                        "type": "ACL",
                                        "properties":
                                        [
                                            {
                                                "name": "Kind",
                                                "unit": "enum",
                                                "value": "rolebased"
                                            },
                                            {
                                                "name": "Role",
                                                "unit": "enum",
                                                "value": "readNonPersonal"
                                            }
                                        ]
                                    }
                                ],
                                "privacy":
                                [
                                    {
                                        "id": "1",
                                        "name": "PurposeControl NonCommercial Government",
                                        "type": "PurposeControl",
                                        "properties":
                                        [
                                            {
                                                "name": "AllowedPurpose",
                                                "unit": "enum",
                                                "value": "NonCommercial"
                                            },
                                            {
                                                "name": "AllowedGuarantor",
                                                "unit": "enum",
                                                "value": "Government"
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    ],
                    "generalMetrics":
                    {
                        "dataUtility":
                        [
                        ],
                        "security":
                        [
                        ],
                        "privacy":
                        [
                        ]
                    }

                }
            };

            var args = {
                    applicationRequirements: req,
                    candidates: [{
                        blueprint: bp,
                        methodName: "GetAllBloodTests"
                    }]
            };

            console.log("before");
            
            unirest.post("http://localhost:8080/api/rankBlueprints")
                .headers({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
                .send(args)
                .end(function (response) {
                    console.log(response.body);
                    expect(response.body).not.toBe(undefined);
                    if (response.error != false) {
                        console.log("looks like the web server is not listening to requests");
                        console.log("make sure you started the web service before running the tests");
                    }
                    done();
                });

            console.log("after");
            
        });
    });
});