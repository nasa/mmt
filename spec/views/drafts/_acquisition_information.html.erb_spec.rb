# MMT-296

# View specs are described here: https://robots.thoughtbot.com/how-we-test-rails-applications#view-specs

require 'rails_helper'
include DraftsHelper

template_path = 'drafts/previews/_acquisition_information.html.erb'

describe template_path, type: :view do
  context 'when the acquisition information data' do
    context 'is empty' do
      before do
        assign(:draft, build(:draft, draft: {}))
        render :template => template_path, :locals=>{draft: {}}
      end

      it 'does not crash or have acquisition information data' do
        expect(rendered).to have_content('Acquisition Information')
        expect(rendered).to_not have_content('Platform')
        expect(rendered).to_not have_content('Project')
      end
    end

    context 'is populated' do
      draft_json = {}
      before do
        draft_json['Project'] = [
            {"ShortName"=>"test 1 ShortName", "LongName"=>"test 1 LongName", "Campaign"=>["test 1a Campaign", "test 1b Campaign"], "StartDate"=>"2015-07-01", "EndDate"=>"2015-12-25"},
            {"ShortName"=>"test 2 ShortName", "LongName"=>"test 2 LongName", "Campaign"=>["test 2a Campaign", "test 2b Campaign"], "StartDate"=>"2015-07-01", "EndDate"=>"2015-12-25"}
        ]

        draft_json['Platform'] =
        [
          {
            "Type"=>"test 1 Type", "ShortName"=>"test 1 P ShortName", "LongName"=>"test 1 P LongName",
            "Characteristics"=>
            [
              {"Name"=>"test 1 PC Name", "Description"=>"test 1 PC Description", "Value"=>"test 1 PC Value", "Unit"=>"test 1 PC Unit", "DataType"=>"test 1 PC DataType"},
              {"Name"=>"test 2 PC Name", "Description"=>"test 2 PC Description", "Value"=>"test 2 PC Value", "Unit"=>"test 2 PC Unit", "DataType"=>"test 2 PC DataType"}
            ],
            "Instruments"=>
            [
               {"ShortName"=>"test 1 PI ShortName", "LongName"=>"test 1 PI LongName",
                "Characteristics"=>
                [
                   {"Name"=>"test 1 PI Name", "Description"=>"test 1 PI Description", "Value"=>"test 1 PI Value", "Unit"=>"test 1 PI Unit", "DataType"=>"test 1 PI DataType"},
                   {"Name"=>"test 2 PI Name", "Description"=>"test 2 PI Description", "Value"=>"test 2 PI Value", "Unit"=>"test 2 PI Unit", "DataType"=>"test 2 PI DataType"}
                ],
                "Technique"=>"test 1 PI Technique", "NumberOfSensors"=>234,
                "Sensors"=>[
                  {
                    "ShortName"=>"test 1 PS ShortName", "LongName"=>"test 1 PS LongName","Technique"=>"test 1 PS Technique",
                    "Characteristics"=>
                    [
                      {"Name"=>"test 1 PS Name", "Description"=>"test 1 PS Description", "Value"=>"test 1 PS Value", "Unit"=>"test 1 PS Unit", "DataType"=>"test 1 PS DataType"},
                      {"Name"=>"test 2 PS Name", "Description"=>"test 2 PS Description", "Value"=>"test 2 PS Value", "Unit"=>"test 2 PS Unit", "DataType"=>"test 2 PS DataType"}
                    ]
                  },
                  {
                    "ShortName"=>"test 1b PS ShortName", "LongName"=>"test 1b PS LongName","Technique"=>"test 1b PS Technique",
                    "Characteristics"=>
                        [
                            {"Name"=>"test 1b PS Name", "Description"=>"test 1b PS Description", "Value"=>"test 1b PS Value", "Unit"=>"test 1b PS Unit", "DataType"=>"test 1b PS DataType"},
                            {"Name"=>"test 2b PS Name", "Description"=>"test 2b PS Description", "Value"=>"test 2b PS Value", "Unit"=>"test 2b PS Unit", "DataType"=>"test 2b PS DataType"}
                        ]
                  }
                ],
                "OperationalMode"=>[
                    "test 1a OperationalMode", "test 1b OperationalMode"
                ]
               },

               {"ShortName"=>"test 1d PI ShortName", "LongName"=>"test 1d PI LongName",
                "Characteristics"=>
                    [
                        {"Name"=>"test 1d PI Name", "Description"=>"test 1d PI Description", "Value"=>"test 1d PI Value", "Unit"=>"test 1d PI Unit", "DataType"=>"test 1d PI DataType"},
                        {"Name"=>"test 2d PI Name", "Description"=>"test 2d PI Description", "Value"=>"test 2d PI Value", "Unit"=>"test 2d PI Unit", "DataType"=>"test 2d PI DataType"}
                    ],
                "Technique"=>"test 1d PI Technique", "NumberOfSensors"=>345,
                "Sensors"=>[
                    {
                        "ShortName"=>"test 1d PS ShortName", "LongName"=>"test 1d PS LongName","Technique"=>"test 1d PS Technique",
                        "Characteristics"=>
                            [
                                {"Name"=>"test 1d PS Name", "Description"=>"test 1d PS Description", "Value"=>"test 1d PS Value", "Unit"=>"test 1d PS Unit", "DataType"=>"test 1d PS DataType"},
                                {"Name"=>"test 2d PS Name", "Description"=>"test 2d PS Description", "Value"=>"test 2d PS Value", "Unit"=>"test 2d PS Unit", "DataType"=>"test 2d PS DataType"}
                            ]
                    },
                    {
                        "ShortName"=>"test 1db PS ShortName", "LongName"=>"test 1db PS LongName","Technique"=>"test 1db PS Technique",
                        "Characteristics"=>
                            [
                                {"Name"=>"test 1db PS Name", "Description"=>"test 1db PS Description", "Value"=>"test 1db PS Value", "Unit"=>"test 1db PS Unit", "DataType"=>"test 1db PS DataType"},
                                {"Name"=>"test 2db PS Name", "Description"=>"test 2db PS Description", "Value"=>"test 2db PS Value", "Unit"=>"test 2db PS Unit", "DataType"=>"test 2db PS DataType"}
                            ]
                    }
                ],
                "OperationalMode"=>[
                    "test 1da OperationalMode", "test 1db OperationalMode"
                ]
               }

            ]
          },

          {
              "Type"=>"test a1 Type", "ShortName"=>"test a1 P ShortName", "LongName"=>"test a1 P LongName",
              "Characteristics"=>
              [
                  {"Name"=>"test a1 PC Name", "Description"=>"test a1 PC Description", "Value"=>"test a1 PC Value", "Unit"=>"test a1 PC Unit", "DataType"=>"test a1 PC DataType"},
                  {"Name"=>"test a2 PC Name", "Description"=>"test a2 PC Description", "Value"=>"test a2 PC Value", "Unit"=>"test a2 PC Unit", "DataType"=>"test a2 PC DataType"}
              ],
              "Instruments"=>
              [
                  {"ShortName"=>"test a1 PI ShortName", "LongName"=>"test a1 PI LongName",
                   "Characteristics"=>
                   [
                       {"Name"=>"test a1 PI Name", "Description"=>"test a1 PI Description", "Value"=>"test a1 PI Value", "Unit"=>"test a1 PI Unit", "DataType"=>"test a1 PI DataType"},
                       {"Name"=>"test a2 PI Name", "Description"=>"test a2 PI Description", "Value"=>"test a2 PI Value", "Unit"=>"test a2 PI Unit", "DataType"=>"test a2 PI DataType"}
                   ],
                   "Technique"=>"test a1 PI Technique", "NumberOfSensors"=>456,
                   "Sensors"=>[
                   {
                       "ShortName"=>"test a1 PS ShortName", "LongName"=>"test a1 PS LongName","Technique"=>"test a1 PS Technique",
                       "Characteristics"=>
                       [
                           {"Name"=>"test a1 PS Name", "Description"=>"test a1 PS Description", "Value"=>"test a1 PS Value", "Unit"=>"test a1 PS Unit", "DataType"=>"test a1 PS DataType"},
                           {"Name"=>"test a2 PS Name", "Description"=>"test a2 PS Description", "Value"=>"test a2 PS Value", "Unit"=>"test a2 PS Unit", "DataType"=>"test a2 PS DataType"}
                       ]
                   },
                   {
                       "ShortName"=>"test a1b PS ShortName", "LongName"=>"test a1b PS LongName","Technique"=>"test a1b PS Technique",
                       "Characteristics"=>
                       [
                           {"Name"=>"test a1b PS Name", "Description"=>"test a1b PS Description", "Value"=>"test a1b PS Value", "Unit"=>"test a1b PS Unit", "DataType"=>"test a1b PS DataType"},
                           {"Name"=>"test a2b PS Name", "Description"=>"test a2b PS Description", "Value"=>"test a2b PS Value", "Unit"=>"test a2b PS Unit", "DataType"=>"test a2b PS DataType"}
                       ]
                   }
                   ],
                   "OperationalMode"=>[
                       "test a1a OperationalMode", "test a1b OperationalMode"
                   ]
                  },

                  {"ShortName"=>"test a1d PI ShortName", "LongName"=>"test a1d PI LongName",
                   "Characteristics"=>
                   [
                       {"Name"=>"test a1d PI Name", "Description"=>"test a1d PI Description", "Value"=>"test a1d PI Value", "Unit"=>"test a1d PI Unit", "DataType"=>"test a1d PI DataType"},
                       {"Name"=>"test a2d PI Name", "Description"=>"test a2d PI Description", "Value"=>"test a2d PI Value", "Unit"=>"test a2d PI Unit", "DataType"=>"test a2d PI DataType"}
                   ],
                   "Technique"=>"test a1d PI Technique", "NumberOfSensors"=>567,
                   "Sensors"=>[
                       {
                           "ShortName"=>"test a1d PS ShortName", "LongName"=>"test a1d PS LongName","Technique"=>"test a1d PS Technique",
                           "Characteristics"=>
                           [
                               {"Name"=>"test a1d PS Name", "Description"=>"test a1d PS Description", "Value"=>"test a1d PS Value", "Unit"=>"test a1d PS Unit", "DataType"=>"test a1d PS DataType"},
                               {"Name"=>"test a2d PS Name", "Description"=>"test a2d PS Description", "Value"=>"test a2d PS Value", "Unit"=>"test a2d PS Unit", "DataType"=>"test a2d PS DataType"}
                           ]
                       },
                       {
                           "ShortName"=>"test a1db PS ShortName", "LongName"=>"test a1db PS LongName","Technique"=>"test a1db PS Technique",
                           "Characteristics"=>
                           [
                               {"Name"=>"test a1db PS Name", "Description"=>"test a1db PS Description", "Value"=>"test a1db PS Value", "Unit"=>"test a1db PS Unit", "DataType"=>"test a1db PS DataType"},
                               {"Name"=>"test a2db PS Name", "Description"=>"test a2db PS Description", "Value"=>"test a2db PS Value", "Unit"=>"test a2db PS Unit", "DataType"=>"test a2db PS DataType"}
                           ]
                       }
                   ],
                   "OperationalMode"=>[
                       "test a1da OperationalMode", "test a1db OperationalMode"
                   ]
                  }

              ]
          }

        ]

        assign(:draft, build(:draft, draft: draft_json))
        render :template => template_path, :locals=>{draft: draft_json}
      end

      it 'shows the values in the correct places and formats in the draft preview page' do
        rendered_node = Capybara.string(rendered)
        root_css_path = "ul.acquisition-information-preview"
        draft_json.each do |key, value|
          check_css_path_for_display_of_values(rendered_node, value, key, root_css_path, {  })
        end

      end

    end

  end

end


