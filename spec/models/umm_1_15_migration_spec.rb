# By the final PR, this file should be deleted because the function it depends on
# should not exist anymore

describe 'Migration tests for UMM-C 1.15' do
  context 'when migrating a record which does not have horizontal spatial information' do
    before do
      @collection = CollectionDraft.new()
      @collection.draft = {
        # Some fields that should be retained
        'DOI' => {
          'DOI'       => 'Citation DOI',
          'Authority' => 'Citation DOI Authority'
        },
        'CollectionProgress' => 'ACTIVE',
        'Quality'            => 'Metadata quality summary',
        'UseConstraints'     => {
          'Description' => {
            'Description' => 'These are some use constraints'
          },
          'LicenseUrl' => {
            'Linkage' => 'http://example.com'
          }
        }
      }
    end

    it 'should have all of the old fields' do
      @collection.migration_test
      expect(@collection.draft).to eq({
        # Some fields that should be retained
        'DOI' => {
          'DOI'       => 'Citation DOI',
          'Authority' => 'Citation DOI Authority'
        },
        'CollectionProgress' => 'ACTIVE',
        'Quality'            => 'Metadata quality summary',
        'UseConstraints'     => {
          'Description' => {
            'Description' => 'These are some use constraints'
          },
          'LicenseUrl' => {
            'Linkage' => 'http://example.com'
          }
        }
      })
    end

    context 'when migrating a record which has vertical spatial information' do
      before do
        @collection.draft['SpatialInformation'] = {
              'SpatialCoverageType' => 'VERTICAL',
              'VerticalCoordinateSystem' => {
                'AltitudeSystemDefinition' => {
                  'DatumName' => 'Datum',
                  'DistanceUnits' => 'HectoPascals',
                  'Resolutions' => [1.0, 2.0, 3.0]
                },
                'DepthSystemDefinition' => {
                  'DatumName' => 'Datum 2',
                  'DistanceUnits' => 'Fathoms',
                  'Resolutions' => [12.0, 22.0, 32.0]
                }
              }
            }
      end

      it 'retains the vertical spatial information' do
        @collection.migration_test
        expect(@collection.draft).to eq({
          # Some fields that should be retained
          'DOI' => {
            'DOI'       => 'Citation DOI',
            'Authority' => 'Citation DOI Authority'
          },
          'CollectionProgress' => 'ACTIVE',
          'Quality'            => 'Metadata quality summary',
          'UseConstraints'     => {
            'Description' => {
              'Description' => 'These are some use constraints'
            },
            'LicenseUrl' => {
              'Linkage' => 'http://example.com'
            }
          },
          'SpatialInformation' => {
            'SpatialCoverageType' => 'VERTICAL',
            'VerticalCoordinateSystem' => {
              'AltitudeSystemDefinition' => {
                'DatumName' => 'Datum',
                'DistanceUnits' => 'HectoPascals',
                'Resolutions' => [1.0, 2.0, 3.0]
              },
              'DepthSystemDefinition' => {
                'DatumName' => 'Datum 2',
                'DistanceUnits' => 'Fathoms',
                'Resolutions' => [12.0, 22.0, 32.0]
              }
            }
          }
        })
      end
    end
  end

  context 'when migrating records that have horizontal spatial information' do
    before do
      @collection = CollectionDraft.new()
      @collection.draft = {
        # Some fields that should be retained
        'DOI' => {
          'DOI'       => 'Citation DOI',
          'Authority' => 'Citation DOI Authority'
        },
        'CollectionProgress' => 'ACTIVE',
        'Quality'            => 'Metadata quality summary',
        'UseConstraints'     => {
          'Description' => {
            'Description' => 'These are some use constraints'
          },
          'LicenseUrl' => {
            'Linkage' => 'http://example.com'
          }
        },
        'SpatialExtent' => {
          'SpatialCoverageType' => 'HORIZONTAL',
          'GranuleSpatialRepresentation' => 'CARTESIAN',
          'HorizontalSpatialDomain' => {
            'ZoneIdentifier' => 'Zone ID',
            'Geometry' => {
              'CoordinateSystem' => 'CARTESIAN',
              'BoundingRectangles' => [{
                'WestBoundingCoordinate'  => -180.0,
                'NorthBoundingCoordinate' => 90.0,
                'EastBoundingCoordinate'  => 180.0,
                'SouthBoundingCoordinate' => -90.0
              }, {
                'WestBoundingCoordinate'  => -96.9284587,
                'NorthBoundingCoordinate' => 58.968602,
                'EastBoundingCoordinate'  => -56.9284587,
                'SouthBoundingCoordinate' => 18.968602
              }]
            }
          }
        },
        'SpatialInformation' => {
          'SpatialCoverageType' => 'HORIZONTAL',
          'HorizontalCoordinateSystem' => {
            'GeodeticModel' => {
              'HorizontalDatumName' => 'Datum name',
              'EllipsoidName' => 'Ellipsoid name',
              'SemiMajorAxis' => 3.0,
              'DenominatorOfFlatteningRatio' => 4.0
            }
          }
        }
      }
    end

    context 'when migrating records that also have horizontal spatial extents' do
      it 'adds to an existing horizontal spatial extent' do
        @collection.migration_test
        expect(@collection.draft).to eq({
          # Some fields that should be retained
          'DOI' => {
            'DOI'       => 'Citation DOI',
            'Authority' => 'Citation DOI Authority'
          },
          'CollectionProgress' => 'ACTIVE',
          'Quality'            => 'Metadata quality summary',
          'UseConstraints'     => {
            'Description' => {
              'Description' => 'These are some use constraints'
            },
            'LicenseUrl' => {
              'Linkage' => 'http://example.com'
            }
          },
          'SpatialExtent' => {
            'SpatialCoverageType' => 'HORIZONTAL',
            'GranuleSpatialRepresentation' => 'CARTESIAN',
            'HorizontalSpatialDomain' => {
              'ZoneIdentifier' => 'Zone ID',
              'Geometry' => {
                'CoordinateSystem' => 'CARTESIAN',
                'BoundingRectangles' => [{
                  'WestBoundingCoordinate'  => -180.0,
                  'NorthBoundingCoordinate' => 90.0,
                  'EastBoundingCoordinate'  => 180.0,
                  'SouthBoundingCoordinate' => -90.0
                }, {
                  'WestBoundingCoordinate'  => -96.9284587,
                  'NorthBoundingCoordinate' => 58.968602,
                  'EastBoundingCoordinate'  => -56.9284587,
                  'SouthBoundingCoordinate' => 18.968602
                }]
              },
              'ResolutionAndCoordinateSystem' => {
                'GeodeticModel' => {
                  'HorizontalDatumName' => 'Datum name',
                  'EllipsoidName' => 'Ellipsoid name',
                  'SemiMajorAxis' => 3.0,
                  'DenominatorOfFlatteningRatio' => 4.0
                }
              }
            }
          }
        })
      end
    end

    context 'when migrating records that do not have horizontal spatial extents' do
      before do
        # I think it is easier to understand what is happening if the above record is whole and we remove the horizontal spatial domain here.
        @collection.draft['SpatialExtent'].delete('HorizontalSpatialDomain')
      end

      it 'makes a new HorizontalSpatialDomain' do
        @collection.migration_test
        expect(@collection.draft).to eq({
          # Some fields that should be retained
          'DOI' => {
            'DOI'       => 'Citation DOI',
            'Authority' => 'Citation DOI Authority'
          },
          'CollectionProgress' => 'ACTIVE',
          'Quality'            => 'Metadata quality summary',
          'UseConstraints'     => {
            'Description' => {
              'Description' => 'These are some use constraints'
            },
            'LicenseUrl' => {
              'Linkage' => 'http://example.com'
            }
          },
          'SpatialExtent' => {
            'SpatialCoverageType' => 'HORIZONTAL',
            'GranuleSpatialRepresentation' => 'CARTESIAN',
            'HorizontalSpatialDomain' => {
              'ResolutionAndCoordinateSystem' => {
                'GeodeticModel' => {
                  'HorizontalDatumName' => 'Datum name',
                  'EllipsoidName' => 'Ellipsoid name',
                  'SemiMajorAxis' => 3.0,
                  'DenominatorOfFlatteningRatio' => 4.0
                }
              }
            }
          }
        })
      end
    end

    context 'when migrating records that do not have spatial extents' do
      before do
        # I think it is easier to understand what is happening if the above record is whole and we remove the horizontal spatial domain here.
        @collection.draft.delete('SpatialExtent')
      end

      it 'makes a new Spatial Extent' do
        @collection.migration_test
        expect(@collection.draft).to eq({
          # Some fields that should be retained
          'DOI' => {
            'DOI'       => 'Citation DOI',
            'Authority' => 'Citation DOI Authority'
          },
          'CollectionProgress' => 'ACTIVE',
          'Quality'            => 'Metadata quality summary',
          'UseConstraints'     => {
            'Description' => {
              'Description' => 'These are some use constraints'
            },
            'LicenseUrl' => {
              'Linkage' => 'http://example.com'
            }
          },
          'SpatialExtent' => {
            'SpatialCoverageType' => 'HORIZONTAL',
            'HorizontalSpatialDomain' => {
              'ResolutionAndCoordinateSystem' => {
                'GeodeticModel' => {
                  'HorizontalDatumName' => 'Datum name',
                  'EllipsoidName' => 'Ellipsoid name',
                  'SemiMajorAxis' => 3.0,
                  'DenominatorOfFlatteningRatio' => 4.0
                }
              }
            }
          }
        })
      end
    end

    context 'when the horizontal spatial information has what will become a generic resolution' do
      before do
        @collection.draft['SpatialInformation']['HorizontalCoordinateSystem']['GeographicCoordinateSystem'] = {
          'LatitudeResolution' => 9,
          'LongitudeResolution' => 5,
          'GeographicCoordinateUnits' => 'Kilometers'
        }
      end

      it 'makes a new Generic Resolution' do
        @collection.migration_test
        expect(@collection.draft).to eq({
          # Some fields that should be retained
          'DOI' => {
            'DOI'       => 'Citation DOI',
            'Authority' => 'Citation DOI Authority'
          },
          'CollectionProgress' => 'ACTIVE',
          'Quality'            => 'Metadata quality summary',
          'UseConstraints'     => {
            'Description' => {
              'Description' => 'These are some use constraints'
            },
            'LicenseUrl' => {
              'Linkage' => 'http://example.com'
            }
          },
          'SpatialExtent' => {
            'SpatialCoverageType' => 'HORIZONTAL',
            'GranuleSpatialRepresentation' => 'CARTESIAN',
            'HorizontalSpatialDomain' => {
              'ZoneIdentifier' => 'Zone ID',
              'Geometry' => {
                'CoordinateSystem' => 'CARTESIAN',
                'BoundingRectangles' => [{
                  'WestBoundingCoordinate'  => -180.0,
                  'NorthBoundingCoordinate' => 90.0,
                  'EastBoundingCoordinate'  => 180.0,
                  'SouthBoundingCoordinate' => -90.0
                }, {
                  'WestBoundingCoordinate'  => -96.9284587,
                  'NorthBoundingCoordinate' => 58.968602,
                  'EastBoundingCoordinate'  => -56.9284587,
                  'SouthBoundingCoordinate' => 18.968602
                }]
              },
              'ResolutionAndCoordinateSystem' => {
                'GeodeticModel' => {
                  'HorizontalDatumName' => 'Datum name',
                  'EllipsoidName' => 'Ellipsoid name',
                  'SemiMajorAxis' => 3.0,
                  'DenominatorOfFlatteningRatio' => 4.0
                },
                'HorizontalDataResolution' => {
                  'GenericResolutions' => [{
                    'XDimension' => 5,
                    'YDimension' => 9,
                    'Unit' => 'Kilometers'
                  }]
                }
              }
            }
          }
        })
      end
    end
  end

  context 'when migrating records that have vertical and orbital spatial extents' do
    before do
      @collection = CollectionDraft.new()
      @collection.draft = {
        # Some fields that should be retained
        'DOI' => {
          'DOI'       => 'Citation DOI',
          'Authority' => 'Citation DOI Authority'
        },
        'CollectionProgress' => 'ACTIVE',
        'Quality'            => 'Metadata quality summary',
        'UseConstraints'     => {
          'Description' => {
            'Description' => 'These are some use constraints'
          },
          'LicenseUrl' => {
            'Linkage' => 'http://example.com'
          }
        },
        'SpatialExtent' => {
          'SpatialCoverageType'=> 'ORBITAL_VERTICAL',
          'OrbitParameters'=> {
            'SwathWidth'=> 1.0,
            'Period'=> 1.0,
            'InclinationAngle'=> 1.0,
            'NumberOfOrbits'=> 1.0,
            'StartCircularLatitude'=> 1.0
          },
          'VerticalSpatialDomains'=> [
            {
              'Type'=> 'Atmosphere Layer',
              'Value'=> '1'
            }
          ],
          'GranuleSpatialRepresentation'=> 'CARTESIAN'
        },
        'SpatialInformation' => {
          'SpatialCoverageType' => 'HORIZONTAL',
          'HorizontalCoordinateSystem' => {
            'GeodeticModel' => {
              'HorizontalDatumName' => 'Datum name',
              'EllipsoidName' => 'Ellipsoid name',
              'SemiMajorAxis' => 3.0,
              'DenominatorOfFlatteningRatio' => 4.0
            }
          }
        }
      }
    end

    it 'adds to an existing spatial extent' do
      @collection.migration_test
      expect(@collection.draft).to eq({
        # Some fields that should be retained
        'DOI' => {
          'DOI'       => 'Citation DOI',
          'Authority' => 'Citation DOI Authority'
        },
        'CollectionProgress' => 'ACTIVE',
        'Quality'            => 'Metadata quality summary',
        'UseConstraints'     => {
          'Description' => {
            'Description' => 'These are some use constraints'
          },
          'LicenseUrl' => {
            'Linkage' => 'http://example.com'
          }
        },
        'SpatialExtent' => {
          'SpatialCoverageType' => 'HORIZONTAL_VERTICAL_ORBITAL',
          'GranuleSpatialRepresentation' => 'CARTESIAN',
          'HorizontalSpatialDomain' => {
            'ResolutionAndCoordinateSystem' => {
              'GeodeticModel' => {
                'HorizontalDatumName' => 'Datum name',
                'EllipsoidName' => 'Ellipsoid name',
                'SemiMajorAxis' => 3.0,
                'DenominatorOfFlatteningRatio' => 4.0
              }
            }
          },
          'OrbitParameters'=> {
            'SwathWidth'=> 1.0,
            'Period'=> 1.0,
            'InclinationAngle'=> 1.0,
            'NumberOfOrbits'=> 1.0,
            'StartCircularLatitude'=> 1.0
          },
          'VerticalSpatialDomains'=> [
            {
              'Type'=> 'Atmosphere Layer',
              'Value'=> '1'
            }
          ],
        }
      })
    end
  end

  context 'when migrating records that have horizontal and vertical spatial extents' do
    before do
      @collection = CollectionDraft.new
      @collection.draft = {
        # Some fields that should be retained
        'DOI' => {
          'DOI'       => 'Citation DOI',
          'Authority' => 'Citation DOI Authority'
        },
        'CollectionProgress' => 'ACTIVE',
        'Quality'            => 'Metadata quality summary',
        'UseConstraints'     => {
          'Description' => {
            'Description' => 'These are some use constraints'
          },
          'LicenseUrl' => {
            'Linkage' => 'http://example.com'
          }
        },
        'SpatialExtent' => {
          'SpatialCoverageType'=> 'HORIZONTAL_VERTICAL',
          'GranuleSpatialRepresentation'=> 'CARTESIAN',
          'HorizontalSpatialDomain' => {
            'ZoneIdentifier' => 'Zone ID',
            'Geometry' => {
              'CoordinateSystem' => 'CARTESIAN',
              'BoundingRectangles' => [{
                'WestBoundingCoordinate'  => -180.0,
                'NorthBoundingCoordinate' => 90.0,
                'EastBoundingCoordinate'  => 180.0,
                'SouthBoundingCoordinate' => -90.0
              }, {
                'WestBoundingCoordinate'  => -96.9284587,
                'NorthBoundingCoordinate' => 58.968602,
                'EastBoundingCoordinate'  => -56.9284587,
                'SouthBoundingCoordinate' => 18.968602
              }]
            }
          },
          'VerticalSpatialDomains'=> [
            {
              'Type'=> 'Atmosphere Layer',
              'Value'=> '1'
            }
          ]
        },
        'SpatialInformation' => {
          'SpatialCoverageType' => 'HORIZONTAL',
          'HorizontalCoordinateSystem' => {
            'GeodeticModel' => {
              'HorizontalDatumName' => 'Datum name',
              'EllipsoidName' => 'Ellipsoid name',
              'SemiMajorAxis' => 3.0,
              'DenominatorOfFlatteningRatio' => 4.0
            }
          }
        }
      }
    end

    it 'adds to an existing horizontal spatial extent' do
      @collection.migration_test
      expect(@collection.draft).to eq({
        # Some fields that should be retained
        'DOI' => {
          'DOI'       => 'Citation DOI',
          'Authority' => 'Citation DOI Authority'
        },
        'CollectionProgress' => 'ACTIVE',
        'Quality'            => 'Metadata quality summary',
        'UseConstraints'     => {
          'Description' => {
            'Description' => 'These are some use constraints'
          },
          'LicenseUrl' => {
            'Linkage' => 'http://example.com'
          }
        },
        'SpatialExtent' => {
          'SpatialCoverageType'=> 'HORIZONTAL_VERTICAL',
          'GranuleSpatialRepresentation'=> 'CARTESIAN',
          'HorizontalSpatialDomain' => {
            'ZoneIdentifier' => 'Zone ID',
            'Geometry' => {
              'CoordinateSystem' => 'CARTESIAN',
              'BoundingRectangles' => [{
                'WestBoundingCoordinate'  => -180.0,
                'NorthBoundingCoordinate' => 90.0,
                'EastBoundingCoordinate'  => 180.0,
                'SouthBoundingCoordinate' => -90.0
              }, {
                'WestBoundingCoordinate'  => -96.9284587,
                'NorthBoundingCoordinate' => 58.968602,
                'EastBoundingCoordinate'  => -56.9284587,
                'SouthBoundingCoordinate' => 18.968602
              }]
            },
            'ResolutionAndCoordinateSystem' => {
              'GeodeticModel' => {
                'HorizontalDatumName' => 'Datum name',
                'EllipsoidName' => 'Ellipsoid name',
                'SemiMajorAxis' => 3.0,
                'DenominatorOfFlatteningRatio' => 4.0
              }
            }
          },
          'VerticalSpatialDomains'=> [
            {
              'Type'=> 'Atmosphere Layer',
              'Value'=> '1'
            }
          ]
        }
      })
    end
  end

  context 'when migrating records which have both horizontal and vertical spatial information' do
    before do
      @collection = CollectionDraft.new
      @collection.draft = {
        # Some fields that should be retained
        'DOI' => {
          'DOI'       => 'Citation DOI',
          'Authority' => 'Citation DOI Authority'
        },
        'CollectionProgress' => 'ACTIVE',
        'Quality'            => 'Metadata quality summary',
        'UseConstraints'     => {
          'Description' => {
            'Description' => 'These are some use constraints'
          },
          'LicenseUrl' => {
            'Linkage' => 'http://example.com'
          }
        },
        'SpatialExtent' => {
          'SpatialCoverageType'=> 'HORIZONTAL_VERTICAL',
          'GranuleSpatialRepresentation'=> 'CARTESIAN',
          'HorizontalSpatialDomain' => {
            'ZoneIdentifier' => 'Zone ID',
            'Geometry' => {
              'CoordinateSystem' => 'CARTESIAN',
              'BoundingRectangles' => [{
                'WestBoundingCoordinate'  => -180.0,
                'NorthBoundingCoordinate' => 90.0,
                'EastBoundingCoordinate'  => 180.0,
                'SouthBoundingCoordinate' => -90.0
              }, {
                'WestBoundingCoordinate'  => -96.9284587,
                'NorthBoundingCoordinate' => 58.968602,
                'EastBoundingCoordinate'  => -56.9284587,
                'SouthBoundingCoordinate' => 18.968602
              }]
            }
          },
          'VerticalSpatialDomains'=> [
            {
              'Type'=> 'Atmosphere Layer',
              'Value'=> '1'
            }
          ]
        },
        'SpatialInformation' => {
          'SpatialCoverageType' => 'BOTH',
          'HorizontalCoordinateSystem' => {
            'GeodeticModel' => {
              'HorizontalDatumName' => 'Datum name',
              'EllipsoidName' => 'Ellipsoid name',
              'SemiMajorAxis' => 3.0,
              'DenominatorOfFlatteningRatio' => 4.0
            }
          },
          'VerticalCoordinateSystem' => {
            'AltitudeSystemDefinition' => {
              'DatumName' => 'Datum',
              'DistanceUnits' => 'HectoPascals',
              'Resolutions' => [1.0, 2.0, 3.0]
            },
            'DepthSystemDefinition' => {
              'DatumName' => 'Datum 2',
              'DistanceUnits' => 'Fathoms',
              'Resolutions' => [12.0, 22.0, 32.0]
            }
          }
        }
      }
    end

    it 'preserves the vertical information' do
      @collection.migration_test
      expect(@collection.draft).to eq({
        # Some fields that should be retained
        'DOI' => {
          'DOI'       => 'Citation DOI',
          'Authority' => 'Citation DOI Authority'
        },
        'CollectionProgress' => 'ACTIVE',
        'Quality'            => 'Metadata quality summary',
        'UseConstraints'     => {
          'Description' => {
            'Description' => 'These are some use constraints'
          },
          'LicenseUrl' => {
            'Linkage' => 'http://example.com'
          }
        },
        'SpatialExtent' => {
          'SpatialCoverageType'=> 'HORIZONTAL_VERTICAL',
          'GranuleSpatialRepresentation'=> 'CARTESIAN',
          'HorizontalSpatialDomain' => {
            'ZoneIdentifier' => 'Zone ID',
            'Geometry' => {
              'CoordinateSystem' => 'CARTESIAN',
              'BoundingRectangles' => [{
                'WestBoundingCoordinate'  => -180.0,
                'NorthBoundingCoordinate' => 90.0,
                'EastBoundingCoordinate'  => 180.0,
                'SouthBoundingCoordinate' => -90.0
              }, {
                'WestBoundingCoordinate'  => -96.9284587,
                'NorthBoundingCoordinate' => 58.968602,
                'EastBoundingCoordinate'  => -56.9284587,
                'SouthBoundingCoordinate' => 18.968602
              }]
            },
            'ResolutionAndCoordinateSystem' => {
              'GeodeticModel' => {
                'HorizontalDatumName' => 'Datum name',
                'EllipsoidName' => 'Ellipsoid name',
                'SemiMajorAxis' => 3.0,
                'DenominatorOfFlatteningRatio' => 4.0
              }
            }
          },
          'VerticalSpatialDomains'=> [
            {
              'Type'=> 'Atmosphere Layer',
              'Value'=> '1'
            }
          ]
        },
        'SpatialInformation' => {
          'SpatialCoverageType' => 'VERTICAL',
          'VerticalCoordinateSystem' => {
            'AltitudeSystemDefinition' => {
              'DatumName' => 'Datum',
              'DistanceUnits' => 'HectoPascals',
              'Resolutions' => [1.0, 2.0, 3.0]
            },
            'DepthSystemDefinition' => {
              'DatumName' => 'Datum 2',
              'DistanceUnits' => 'Fathoms',
              'Resolutions' => [12.0, 22.0, 32.0]
            }
          }
        }
      })
    end
  end
end
