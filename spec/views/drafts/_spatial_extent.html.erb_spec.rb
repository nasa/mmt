# MMT-297

# View specs are described here: https://robots.thoughtbot.com/how-we-test-rails-applications#view-specs

require 'rails_helper'
include DraftsHelper

template_path = 'drafts/previews/_spatial_extent.html.erb'

describe template_path, type: :view do
  context 'when the spatial extent data' do
    context 'is empty' do
      before do
        assign(:draft, build(:draft, draft: {}))
        render :template => template_path, :locals=>{draft: {}}
      end

      it 'does not crash or have spatial extent data' do
        expect(rendered).to have_content('Spatial Extent')
        expect(rendered).to_not have_content('Spatial Keyword')
        expect(rendered).to_not have_content('Tiling Identification')
      end
    end

    context 'is populated' do
      draft_json = {}
      before do
        draft_json['SpatialExtent'] = {"SpatialCoverageType"=>"HORIZONTAL",
                                       "HorizontalSpatialDomain"=>
                                           {"ZoneIdentifier"=>"Zone ID",
                                            "Geometry"=>
                                               {"CoordinateSystem"=>"CARTESIAN",

                                                'Points'=>[{'Longitude'=>-77.047878,'Latitude'=>38.805407},
                                                           {'Longitude'=>-76.9284587,'Latitude'=>38.968602}
                                                ],

                                                'BoundingRectangles'=>[{'CenterPoint'=>{'Longitude'=>0.0,'Latitude'=>0.0},
                                                  'WestBoundingCoordinate'=>-180.0,
                                                  'NorthBoundingCoordinate'=>90.0,
                                                  'EastBoundingCoordinate'=>180.0,
                                                  'SouthBoundingCoordinate'=>-90.0},
                                                 {'CenterPoint'=>{'Longitude'=>20.0,'Latitude'=>10.0},
                                                  'WestBoundingCoordinate'=>-96.9284587,
                                                  'NorthBoundingCoordinate'=>58.968602,
                                                  'EastBoundingCoordinate'=>-56.9284587,
                                                  'SouthBoundingCoordinate'=>18.968602}
                                                ],

                                                "GPolygons"=>[
                                                  {"CenterPoint"=>{"Longitude"=>0.0, "Latitude"=>0.0},
                                                    "Boundary"=>{"Points"=>[
                                                        {"Longitude"=>10.0, "Latitude"=>10.0},
                                                        {"Longitude"=>-10.0, "Latitude"=>10.0},
                                                        {"Longitude"=>-10.0, "Latitude"=>-10.0},
                                                        {"Longitude"=>10.0, "Latitude"=>-10.0}
                                                    ]},
                                                    "ExclusiveZone"=>{
                                                        "Boundaries"=>[{"Points"=>[
                                                          {"Longitude"=>5.0, "Latitude"=>5.0},
                                                          {"Longitude"=>-5.0, "Latitude"=>5.0},
                                                          {"Longitude"=>-5.0, "Latitude"=>-5.0},
                                                          {"Longitude"=>5.0, "Latitude"=>-5.0}
                                                        ]}]
                                                    }
                                                  },
                                                  {"Boundary"=>{"Points"=>[
                                                      {"Longitude"=>38.98828125, "Latitude"=>-77.044921875},
                                                      {"Longitude"=>38.935546875, "Latitude"=>-77.1240234375},
                                                      {"Longitude"=>38.81689453125, "Latitude"=>-77.02734375},
                                                      {"Longitude"=>38.900390625, "Latitude"=>-76.9130859375}
                                                    ]}
                                                  }
                                                ],

                                                'Lines'=>[{'CenterPoint'=>{'Longitude'=>25.0,'Latitude'=>25.0},
                                                  'Points'=>[{'Longitude'=>24.0,'Latitude'=>24.0},{'Longitude'=>25.0,'Latitude'=>25.0}]},
                                                  {'CenterPoint'=>{'Longitude'=>25.0,'Latitude'=>25.0},
                                                   'Points'=>[{'Longitude'=>26.0,'Latitude'=>26.0},{'Longitude'=>27.0,'Latitude'=>27.0}]}
                                                ]

                                               }
                                           },
                                       "VerticalSpatialDomains"=>[{'Type'=>'test Type 1', 'Value'=>'test Value 1'},{'Type'=>'test Type 2', 'Value'=>'test Value 2'}],
                                       "OrbitParameters"=>{'SwathWidth'=>40,'Period'=>50,'InclinationAngle'=>60,'NumberOfOrbits'=>70,'StartCircularLatitude'=>0.0},
                                       "GranuleSpatialRepresentation"=>"CARTESIAN"}

        draft_json['TilingIdentificationSystem'] = {"TilingIdentificationSystemName"=>"System name",
                          "Coordinate1"=> {"MinimumValue"=>-50, "MaximumValue"=>50},
                          "Coordinate2"=> {"MinimumValue"=>-30, "MaximumValue"=>30}}

        draft_json['SpatialInformation'] = {"SpatialCoverageType"=>"BOTH",
            "HorizontalCoordinateSystem"=> {"GeodeticModel"=>
                {"HorizontalDatumName"=>"Datum name", "EllipsoidName"=>"Ellipsoid name", "SemiMajorAxis"=>3.0, "DenominatorOfFlatteningRatio"=>4.0}
            },
            "VerticalCoordinateSystem"=> {"AltitudeSystemDefinition"=>{'DatumName'=>'Datum', 'DistanceUnits'=>'Distance Units', 'EncodingMethod'=>'Encoding', 'Resolution'=>{'Resolutions'=>[1.0, 2.0, 3.0]}},
                                          "DepthSystemDefinition"=>{'DatumName'=>'Datum 2', 'DistanceUnits'=>'Distance Units 2', 'EncodingMethod'=>'Encoding 2', 'Resolution'=>{'Resolutions'=>[12.0, 22.0, 32.0]}}}
        }

        # draft_json['SpatialKeywords'] = ["f47ac10b-58cc-4372-a567-0e02b2c3d479", "abdf4d5c-55dc-4324-9ae5-5adf41e99da3"]

        # output_schema_validation draft_json

        assign(:draft, build(:draft, draft: draft_json))
        render :template => template_path, :locals=>{draft: draft_json}
      end

      it 'shows the values in the correct places and formats in the draft preview page' do
        rendered_node = Capybara.string(rendered)
        root_css_path = "ul.spatial-extent-preview"
        draft_json.each do |key, value|
          check_css_path_for_display_of_values(rendered_node, value, key, root_css_path, {SpatialCoverageType: :handle_as_spatial_coverage_type, GranuleSpatialRepresentation: :handle_as_granule_spatial_representation}, true)
        end

      end

    end

  end

end
