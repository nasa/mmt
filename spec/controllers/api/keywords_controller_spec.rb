describe Api::CmrKeywordsController do
  before do
    set_as_mmt_proper
    sign_in
  end
  it 'returns keywords' do
    allow_any_instance_of(Cmr::UrsClient).to receive(:validate_mmt_token).and_return(Faraday::Response.new(status: 200, body: '{"uid":"testuser"}', response_headers: {'Content-Type':'application/json; charset=utf-8'}))
    get :show, params: { id: 'science_keywords' }
    success_response = {
      "category": [
        {
          "value": "EARTH SCIENCE SERVICES",
          "subfields": [
            "topic"
          ],
          "topic": [
            {
              "value": "DATA ANALYSIS AND VISUALIZATION",
              "subfields": [
                "term"
              ],
              "term": [
                {
                  "value": "CALIBRATION/VALIDATION",
                  "uuid": "4f938731-d686-4d89-b72b-ff60474bb1f0"
                },
                {
                  "value": "GEOGRAPHIC INFORMATION SYSTEMS",
                  "uuid": "794e3c3b-791f-44de-9ff3-358d8ed74733",
                  "subfields": [
                    "variable_level_1"
                  ],
                  "variable_level_1": [
                    {
                      "value": "MOBILE GEOGRAPHIC INFORMATION SYSTEMS",
                      "uuid": "0dd83b2a-e83f-4a0c-a1ff-2fbdbbcce62d"
                    },
                    {
                      "value": "DESKTOP GEOGRAPHIC INFORMATION SYSTEMS",
                      "uuid": "565cb301-44de-446c-8fe3-4b5cce428315"
                    }
                  ]
                }
              ]
            },
            {
              "value": "DATA MANAGEMENT/DATA HANDLING",
              "subfields": [
                "term"
              ],
              "term": [
                {
                  "value": "CATALOGING",
                  "uuid": "434d40e2-4e0b-408a-9811-ff878f4f0fb0"
                }
              ]
            }
          ]
        },
        {
          "value": "EARTH SCIENCE",
          "subfields": [
            "topic"
          ],
          "topic": [
            {
              "value": "ATMOSPHERE",
              "subfields": [
                "term"
              ],
              "term": [
                {
                  "value": "AEROSOLS",
                  "subfields": [
                    "variable_level_1"
                  ],
                  "variable_level_1": [
                    {
                      "value": "AEROSOL OPTICAL DEPTH/THICKNESS",
                      "subfields": [
                        "variable_level_2"
                      ],
                      "variable_level_2": [
                        {
                          "value": "ANGSTROM EXPONENT",
                          "uuid": "6e7306a1-79a5-482e-b646-74b75a1eaa48"
                        }
                      ]
                    }
                  ]
                },
                {
                  "value": "ATMOSPHERIC TEMPERATURE",
                  "subfields": [
                    "variable_level_1"
                  ],
                  "variable_level_1": [
                    {
                      "value": "SURFACE TEMPERATURE",
                      "subfields": [
                        "variable_level_2"
                      ],
                      "variable_level_2": [
                        {
                          "value": "MAXIMUM/MINIMUM TEMPERATURE",
                          "subfields": [
                            "variable_level_3"
                          ],
                          "variable_level_3": [
                            {
                              "value": "24 HOUR MAXIMUM TEMPERATURE",
                              "uuid": "ce6a6b3a-df4f-4bd7-a931-7ee874ee9efe"
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "value": "SOLID EARTH",
              "subfields": [
                "term"
              ],
              "term": [
                {
                  "value": "ROCKS/MINERALS/CRYSTALS",
                  "subfields": [
                    "variable_level_1"
                  ],
                  "variable_level_1": [
                    {
                      "value": "SEDIMENTARY ROCKS",
                      "subfields": [
                        "variable_level_2"
                      ],
                      "variable_level_2": [
                        {
                          "value": "SEDIMENTARY ROCK PHYSICAL/OPTICAL PROPERTIES",
                          "subfields": [
                            "variable_level_3"
                          ],
                          "variable_level_3": [
                            {
                              "value": "LUMINESCENCE",
                              "uuid": "3e705ebc-c58f-460d-b5e7-1da05ee45cc1"
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
    parsed_body = JSON.parse(response.body)
    assert_equal(success_response.to_json, parsed_body.to_json)
  end
end
