var unirest = require('unirest');

describe('REST service unit test -> ', function () {
    describe('rankBlueprints method tests -> ', function () {
        describe('medicalApp test case -> ', function () {

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
            
            it('one blueprint perfectly matching the requirements', function (done) {
                
                var bp = {
                    "UUID": "id_2",
                    "INTERNAL_STRUCTURE": {
                        "Overview": {
                            "name": "VDC_2",
                            "description": "This VDC provides information about the weather in Athens, Greece",
                            "topic": "Weather",
                            "keywords": [
                                "Athens",
                                "Weather"
                            ]
                        },
                        "Data_Sources": [
                            {
                                "name": "MinioDS1",
                                "type": "sql",
                                "parameters": {
                                    "hostname": "localhost",
                                    "port": "8000",
                                    "proxy-hostname": "localhost",
                                    "proxy-port": "9800",
                                    "username": "user1",
                                    "password": "pass1"
                                }
                            }
                        ],
                        "Flow": {
                            "platform": "NodeRED",
                            "source_code": [
                                {
                                    "id": "266d1e0.2f202e2",
                                    "type": "http in",
                                    "z": "edca8e77.6ea5e",
                                    "name": "[http rest web servive in]   CAF",
                                    "url": "/CAF",
                                    "method": "post",
                                    "upload": false,
                                    "swaggerDoc": "",
                                    "x": 147.78973388671875,
                                    "y": 194.3920373916626,
                                    "wires": [
                                        [
                                            "e78e4849.721ba8"
                                        ]
                                    ]
                                },
                                {
                                    "id": "a0810829.8d5538",
                                    "type": "http response",
                                    "z": "edca8e77.6ea5e",
                                    "name": "[http rest web servive out]   CAF",
                                    "statusCode": "",
                                    "headers": {

                                    },
                                    "x": 686.7812347412109,
                                    "y": 302.5482864379883,
                                    "wires": [

                                    ]
                                },
                                {
                                    "id": "218f7e99.a6fc42",
                                    "type": "wunderground",
                                    "z": "edca8e77.6ea5e",
                                    "name": "",
                                    "lon": "",
                                    "lat": "",
                                    "city": "Athens",
                                    "country": "Greece",
                                    "x": 404.79258728027344,
                                    "y": 332.3210220336914,
                                    "wires": [
                                        [
                                            "a0810829.8d5538"
                                        ]
                                    ]
                                },
                                {
                                    "id": "e78e4849.721ba8",
                                    "type": "switch",
                                    "z": "edca8e77.6ea5e",
                                    "name": "[switch]   select VDC exposed method",
                                    "property": "payload.method_name",
                                    "propertyType": "msg",
                                    "rules": [
                                        {
                                            "t": "eq",
                                            "v": "get_weather",
                                            "vt": "str"
                                        }
                                    ],
                                    "checkall": "true",
                                    "outputs": 1,
                                    "x": 485.7925796508789,
                                    "y": 156.26419639587402,
                                    "wires": [
                                        [
                                            "218f7e99.a6fc42"
                                        ]
                                    ]
                                }
                            ]
                        },
                        "Testing_Output_Data": [
                            {
                                "method_name": "get_weather",
                                "data": {
                                    "weather": "Clear",
                                    "tempk": 288.3,
                                    "tempc": 15.1,
                                    "tempf": 59.2,
                                    "humidity": "50%",
                                    "windspeed": 3.1,
                                    "winddirection": 220,
                                    "location": "Vyronas, Viron, ",
                                    "epoch": "1517917694",
                                    "description": "The weather in Athens at coordinates: 37.97999954, 23.72999954 is Clear",
                                    "forecast": "Athens : Tuesday : Plenty of sunshine. High around 15C. Winds E at 10 to 15 km/h."
                                }
                            }
                        ]
                    },
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

                    },
                    "ABSTRACT_PROPERTIES": {
                        "Product_Properties": {
                            "data_administrator_reputation": 5,
                            "vdc_blueprint_popularity": 2,
                            "vdc_blueprint_rating": 4,
                            "price": [
                                {
                                    "lower_limit": 0,
                                    "upper_limit": 500,
                                    "price": 0.8
                                }
                            ]
                        },
                        "Quality_Properties": {
                            "scalability": false,
                            "elasticity": false
                        }
                    },
                    "COOKBOOK_APPENDIX": {

                    },
                    "EXPOSED_API": {
                        "Methods": [
                            {
                                "name": "get_weather",
                                "description": "The method returns information about the weather in Athens, Greece",
                                "attributes": [
                                    "purpose",
                                    "requester_id"
                                ],
                                "HTTP_REST_API": {
                                    "Method": "POST",
                                    "Body": {
                                        "method_name": "get_weather",
                                        "attributes": {
                                            "$schema": "http://json-schema.org/draft-06/schema#",
                                            "title": "Attributes",
                                            "description": "The attributes of the exposed VDC method",
                                            "type": "object",
                                            "properties": {
                                                "purpose": {
                                                    "type": "string"
                                                },
                                                "requester_id": {
                                                    "type": "string"
                                                }
                                            },
                                            "additionalProperties": false,
                                            "required": [
                                                "purpose",
                                                "requester_id"
                                            ]
                                        },
                                        "example": {
                                            "method_name": "get_weather",
                                            "attributes": {
                                                "purpose": "research",
                                                "requester_id": "ntua"
                                            }
                                        }
                                    },
                                    "Headers": [
                                        {
                                            "Content-Type": "application/json"
                                        }
                                    ]
                                },
                                "output_schema": {
                                    "$schema": "http://json-schema.org/draft-06/schema#",
                                    "title": "weather in Athens, Greece",
                                    "type": "object",
                                    "properties": {
                                        "weather": {
                                            "type": "string"
                                        },
                                        "tempk": {
                                            "type": "number",
                                            "minimum": 0,
                                            "description": "the temperature in Kelvin"
                                        },
                                        "tempc": {
                                            "type": "number",
                                            "minimum": -273.15,
                                            "description": "the temperature in Celsius"
                                        },
                                        "tempf": {
                                            "type": "number",
                                            "minimum": -459.67,
                                            "description": "the temperature in Fahrenheit"
                                        },
                                        "humidity": {
                                            "type": "string",
                                            "description": "this is a percentage"
                                        },
                                        "windspeed": {
                                            "type": "number"
                                        },
                                        "winddirection": {
                                            "type": "number"
                                        },
                                        "location": {
                                            "type": "string"
                                        },
                                        "epoch": {
                                            "type": "string",
                                            "description": "the observation time in epoch format"
                                        },
                                        "description": {
                                            "type": "string"
                                        },
                                        "forecast": {
                                            "type": "string"
                                        }
                                    },
                                    "additionalProperties": false,
                                    "required": [
                                        "weather",
                                        "tempk",
                                        "tempc",
                                        "tempf",
                                        "humidity",
                                        "windspeed",
                                        "winddirection",
                                        "location",
                                        "epoch",
                                        "description",
                                        "forecast"
                                    ]
                                }
                            }
                        ],
                        "URI": {
                            "format": "hostname:port/CAF",
                            "example": "localhost:1880/CAF"
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

                unirest.post("http://localhost:8080/api/rankBlueprints")
                    .headers({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
                    .send(args)
                    .end(function (response) {
                        console.log(response.body);
                        expect(response.body).not.toBe(undefined);
                        expect(response.body[0].blueprintUUID).toBe(bp.UUID);
                        expect(response.body[0].methodName).toBe("GetAllBloodTests");
                        expect(response.body[0].score).toBe(1);
                        expect(response.body[0].fulfilledRequirements).toEqual(req);
                        if (response.error != false) {
                            console.log("looks like the web server is not listening to requests");
                            console.log("make sure you started the web service before running the tests");
                        }
                        done();
                    });
                
            });
        });

        describe('researchApp test case -> ', function () {

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
                                "id": "8",
                                "name": "Data volume",
                                "weight": 1,
                                "metrics":
                                [
                                    {
                                        "id": "10",
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
                                "id": "9",
                                "name": "Temporal validity",
                                "weight": 1,
                                "metrics":
                                [
                                    {
                                        "id": "11",
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
                                "id": "11",
                                "name": "Completeness",
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
                        ],
                        "treeStructure":
                        {
                            "type": "AND",
                            "children":
                            [
                                {
                                    "type": "AND",
                                    "leaves": ["8", "9", "11"]
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

            it('one blueprint perfectly matching the requirements', function (done) {

                var bp = {
                    "UUID": "id_2",
                    "INTERNAL_STRUCTURE": {
                        "Overview": {
                            "name": "VDC_2",
                            "description": "This VDC provides information about the weather in Athens, Greece",
                            "topic": "Weather",
                            "keywords": [
                                "Athens",
                                "Weather"
                            ]
                        },
                        "Data_Sources": [
                            {
                                "name": "MinioDS1",
                                "type": "sql",
                                "parameters": {
                                    "hostname": "localhost",
                                    "port": "8000",
                                    "proxy-hostname": "localhost",
                                    "proxy-port": "9800",
                                    "username": "user1",
                                    "password": "pass1"
                                }
                            }
                        ],
                        "Flow": {
                            "platform": "NodeRED",
                            "source_code": [
                                {
                                    "id": "266d1e0.2f202e2",
                                    "type": "http in",
                                    "z": "edca8e77.6ea5e",
                                    "name": "[http rest web servive in]   CAF",
                                    "url": "/CAF",
                                    "method": "post",
                                    "upload": false,
                                    "swaggerDoc": "",
                                    "x": 147.78973388671875,
                                    "y": 194.3920373916626,
                                    "wires": [
                                        [
                                            "e78e4849.721ba8"
                                        ]
                                    ]
                                },
                                {
                                    "id": "a0810829.8d5538",
                                    "type": "http response",
                                    "z": "edca8e77.6ea5e",
                                    "name": "[http rest web servive out]   CAF",
                                    "statusCode": "",
                                    "headers": {

                                    },
                                    "x": 686.7812347412109,
                                    "y": 302.5482864379883,
                                    "wires": [

                                    ]
                                },
                                {
                                    "id": "218f7e99.a6fc42",
                                    "type": "wunderground",
                                    "z": "edca8e77.6ea5e",
                                    "name": "",
                                    "lon": "",
                                    "lat": "",
                                    "city": "Athens",
                                    "country": "Greece",
                                    "x": 404.79258728027344,
                                    "y": 332.3210220336914,
                                    "wires": [
                                        [
                                            "a0810829.8d5538"
                                        ]
                                    ]
                                },
                                {
                                    "id": "e78e4849.721ba8",
                                    "type": "switch",
                                    "z": "edca8e77.6ea5e",
                                    "name": "[switch]   select VDC exposed method",
                                    "property": "payload.method_name",
                                    "propertyType": "msg",
                                    "rules": [
                                        {
                                            "t": "eq",
                                            "v": "get_weather",
                                            "vt": "str"
                                        }
                                    ],
                                    "checkall": "true",
                                    "outputs": 1,
                                    "x": 485.7925796508789,
                                    "y": 156.26419639587402,
                                    "wires": [
                                        [
                                            "218f7e99.a6fc42"
                                        ]
                                    ]
                                }
                            ]
                        },
                        "Testing_Output_Data": [
                            {
                                "method_name": "get_weather",
                                "data": {
                                    "weather": "Clear",
                                    "tempk": 288.3,
                                    "tempc": 15.1,
                                    "tempf": 59.2,
                                    "humidity": "50%",
                                    "windspeed": 3.1,
                                    "winddirection": 220,
                                    "location": "Vyronas, Viron, ",
                                    "epoch": "1517917694",
                                    "description": "The weather in Athens at coordinates: 37.97999954, 23.72999954 is Clear",
                                    "forecast": "Athens : Tuesday : Plenty of sunshine. High around 15C. Winds E at 10 to 15 km/h."
                                }
                            }
                        ]
                    },
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
                                            "id": "10",
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
                                            "id": "11",
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

                    },
                    "ABSTRACT_PROPERTIES": {
                        "Product_Properties": {
                            "data_administrator_reputation": 5,
                            "vdc_blueprint_popularity": 2,
                            "vdc_blueprint_rating": 4,
                            "price": [
                                {
                                    "lower_limit": 0,
                                    "upper_limit": 500,
                                    "price": 0.8
                                }
                            ]
                        },
                        "Quality_Properties": {
                            "scalability": false,
                            "elasticity": false
                        }
                    },
                    "COOKBOOK_APPENDIX": {

                    },
                    "EXPOSED_API": {
                        "Methods": [
                            {
                                "name": "get_weather",
                                "description": "The method returns information about the weather in Athens, Greece",
                                "attributes": [
                                    "purpose",
                                    "requester_id"
                                ],
                                "HTTP_REST_API": {
                                    "Method": "POST",
                                    "Body": {
                                        "method_name": "get_weather",
                                        "attributes": {
                                            "$schema": "http://json-schema.org/draft-06/schema#",
                                            "title": "Attributes",
                                            "description": "The attributes of the exposed VDC method",
                                            "type": "object",
                                            "properties": {
                                                "purpose": {
                                                    "type": "string"
                                                },
                                                "requester_id": {
                                                    "type": "string"
                                                }
                                            },
                                            "additionalProperties": false,
                                            "required": [
                                                "purpose",
                                                "requester_id"
                                            ]
                                        },
                                        "example": {
                                            "method_name": "get_weather",
                                            "attributes": {
                                                "purpose": "research",
                                                "requester_id": "ntua"
                                            }
                                        }
                                    },
                                    "Headers": [
                                        {
                                            "Content-Type": "application/json"
                                        }
                                    ]
                                },
                                "output_schema": {
                                    "$schema": "http://json-schema.org/draft-06/schema#",
                                    "title": "weather in Athens, Greece",
                                    "type": "object",
                                    "properties": {
                                        "weather": {
                                            "type": "string"
                                        },
                                        "tempk": {
                                            "type": "number",
                                            "minimum": 0,
                                            "description": "the temperature in Kelvin"
                                        },
                                        "tempc": {
                                            "type": "number",
                                            "minimum": -273.15,
                                            "description": "the temperature in Celsius"
                                        },
                                        "tempf": {
                                            "type": "number",
                                            "minimum": -459.67,
                                            "description": "the temperature in Fahrenheit"
                                        },
                                        "humidity": {
                                            "type": "string",
                                            "description": "this is a percentage"
                                        },
                                        "windspeed": {
                                            "type": "number"
                                        },
                                        "winddirection": {
                                            "type": "number"
                                        },
                                        "location": {
                                            "type": "string"
                                        },
                                        "epoch": {
                                            "type": "string",
                                            "description": "the observation time in epoch format"
                                        },
                                        "description": {
                                            "type": "string"
                                        },
                                        "forecast": {
                                            "type": "string"
                                        }
                                    },
                                    "additionalProperties": false,
                                    "required": [
                                        "weather",
                                        "tempk",
                                        "tempc",
                                        "tempf",
                                        "humidity",
                                        "windspeed",
                                        "winddirection",
                                        "location",
                                        "epoch",
                                        "description",
                                        "forecast"
                                    ]
                                }
                            }
                        ],
                        "URI": {
                            "format": "hostname:port/CAF",
                            "example": "localhost:1880/CAF"
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

                unirest.post("http://localhost:8080/api/rankBlueprints")
                    .headers({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
                    .send(args)
                    .end(function (response) {
                        console.log(response.body);
                        expect(response.body).not.toBe(undefined);
                        expect(response.body[0].blueprintUUID).toBe(bp.UUID);
                        expect(response.body[0].methodName).toBe("GetAllBloodTests");
                        expect(response.body[0].score).toBe(1);
                        expect(response.body[0].fulfilledRequirements).toEqual(req);
                        if (response.error != false) {
                            console.log("looks like the web server is not listening to requests");
                            console.log("make sure you started the web service before running the tests");
                        }
                        done();
                    });

            });
        });
    });
});