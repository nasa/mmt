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
        draft_json['SpatialExtent'] = {"SpatialCoverageType"=>"Horizontal",
                                       "HorizontalSpatialDomain"=>
                                           {"ZoneIdentifier"=>"Zone ID",
                                            "Geometry"=>
                                               {"CoordinateSystem"=>"CARTESIAN",

                                                'Points'=>[{'Longitude'=>'123','Latitude'=>'45'},
                                                           {'Longitude'=>'123a','Latitude'=>'45a'}
                                                ],

                                                'BoundingRectangles'=>[{'CenterPoint'=>{'Longitude'=>'cp123','Latitude'=>'cp45'},
                                                  'WestBoundingCoordinate'=>'WestBoundingCoordinate',
                                                  'NorthBoundingCoordinate'=>'NorthBoundingCoordinate',
                                                  'EastBoundingCoordinate'=>'EastBoundingCoordinate',
                                                  'SouthBoundingCoordinate'=>'SouthBoundingCoordinate'},
                                                 {'CenterPoint'=>{'Longitude'=>'cp123b','Latitude'=>'cp45b'},
                                                  'WestBoundingCoordinate'=>'WestBoundingCoordinate2',
                                                  'NorthBoundingCoordinate'=>'NorthBoundingCoordinate2',
                                                  'EastBoundingCoordinate'=>'EastBoundingCoordinate2',
                                                  'SouthBoundingCoordinate'=>'SouthBoundingCoordinate2'}
                                                ],

                                                'GPolygons'=>[{'CenterPoint'=>{'Longitude'=>'cp123','Latitude'=>'cp45'},
                                                  'Boundary'=>[{'Longitude'=>'123','Latitude'=>'45'},{'Longitude'=>'1234','Latitude'=>'456'}],
                                                  'ExclusionZone'=>{'BoundaryType'=>'BoundaryType',
                                                                    'Boundary'=>[{'Longitude'=>'123z','Latitude'=>'45z'},{'Longitude'=>'1234z','Latitude'=>'456z'}]}},
                                                  {'CenterPoint'=>{'Longitude'=>'cp123c','Latitude'=>'cp45c'},
                                                   'Boundary'=>[{'Longitude'=>'1231','Latitude'=>'451'},{'Longitude'=>'12342','Latitude'=>'4562'}],
                                                   'ExclusionZone'=>{'BoundaryType'=>'BoundaryType2',
                                                                     'Boundary'=>[{'Longitude'=>'123zz','Latitude'=>'45zz'},{'Longitude'=>'1234zz','Latitude'=>'456zz'}]}}
                                                ],

                                                'Lines'=>[{'CenterPoint'=>{'Longitude'=>'cp123','Latitude'=>'cp45'},
                                                  'Points'=>[{'Longitude'=>'123b','Latitude'=>'45b'},{'Longitude'=>'1234b','Latitude'=>'456b'}]},
                                                  {'CenterPoint'=>{'Longitude'=>'cp123r','Latitude'=>'cp45r'},
                                                   'Points'=>[{'Longitude'=>'123br','Latitude'=>'45br'},{'Longitude'=>'1234br','Latitude'=>'456br'}]}
                                                ]

                                               }
                                           },
                                       "VerticalSpatialDomain"=>[{'Type'=>'test Type 1', 'Value'=>'test Value 1'},{'Type'=>'test Type 2', 'Value'=>'test Value 2'}],
                                       "OrbitParameters"=>{'SwathWidth'=>'SwathWidth','Period'=>'Period','InclinationAngle'=>'InclinationAngle','NumberOfOrbits'=>'NumberOfOrbits','StartCircularLatitude'=>'StartCircularLatitude'},
                                       "GranuleSpatialRepresentation"=>"CARTESIAN"}

        draft_json['TilingIdentificationSystem'] = {"TilingIdentificationSystemName"=>"System name",
                          "Coordinate1"=> {"MinimumValue"=>"-50", "MaximumValue"=>"50"},
                          "Coordinate2"=> {"MinimumValue"=>"-30", "MaximumValue"=>"30"}}

        draft_json['SpatialInformation'] = {"SpatialCoverageType"=>"Both",
            "HorizontalCoordinateSystem"=> {"GeodeticModel"=>
                {"HorizontalDatumName"=>"Datum name", "EllipsoidName"=>"Ellipsoid name", "SemiMajorAxis"=>"3", "DenominatorOfFlatteningRatio"=>"4"},
                                            "GeographicCoordinateSystem"=>{"GeographicCoordinateUnits"=>"GeographicCoordinateUnits","LatitudeResolution"=>"321","LongitudeResolution"=>"234"},
                                            "LocalCoordinateSystem"=>{"GeoReferenceInformation"=>"GeoReferenceInformation","Description"=>"Description"}
            },
            "VerticalCoordinateSystem"=> {"AltitudeSystemDefinition"=>{'DatumName'=>'Datum', 'DistanceUnits'=>'Distance Units', 'EncodingMethod'=>'Encoding', 'Resolution'=>[1, 2, 3]},
                                          "DepthSystemDefinition"=>{'DatumName'=>'Datum 2', 'DistanceUnits'=>'Distance Units 2', 'EncodingMethod'=>'Encoding 2', 'Resolution'=>[12, 22, 32]}}
        }

        assign(:draft, build(:draft, draft: draft_json))
        render :template => template_path, :locals=>{draft: draft_json}
      end

      it 'shows the values in the correct places and formats in the draft preview page' do
        rendered_node = Capybara.string(rendered)
        root_css_path = "ul.spatial-extent-preview"
        draft_json.each do |key, value|
          check_css_path_for_display_of_values(rendered_node, value, key, root_css_path, {GranuleSpatialRepresentation: :handle_as_granule_spatial_representation}, true)
        end

      end

    end

  end

end
