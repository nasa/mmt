# frozen_string_literal=> true

def progressive_update_first
  {
    'AdditionalAttributes' => [
      {
        'Name' => 'GROUP_ID',
        'Description' => 'ID that helps ASF group products',
        'DataType' => 'STRING'
      }, {
        'Name' => 'OFF_NADIR_ANGLE',
        'Description' => 'The angle the sensor points away from the satellite\'s nadir (off to the side). Larger angles correspond to imaging farther away from the satellite.',
        'DataType' => 'FLOAT'
      }, {
        'Name' => 'MD5SUM',
        'Description' => 'Checksum',
        'DataType' => 'STRING'
      }, {
        'Name' => 'GRANULE_TYPE',
        'Description' => 'Identifies the type of data by combining platform, beam mode type, and coverage (frame/swath)',
        'DataType' => 'STRING'
      }, {
        'Name' => 'ASCENDING_DESCENDING',
        'Description' => 'Describes whether the satellite travel direction was ascending towards the north pole, or descending towards the south pole.',
        'DataType' => 'STRING'
      }, {
        'Name' => 'FAR_END_LAT',
        'Description' => 'Latitude of the granule where imaging ended farthest from the satellite. For an ascending satellite, it locates the upper right corner of a north-oriented image.',
        'DataType' => 'FLOAT'
      }, {
        'Name' => 'INSAR_STACK_SIZE',
        'Description' => 'The number of SAR images over the same location in the entire ASF archive. Used for data that may be used for interferometry.',
        'DataType' => 'INT'
      }, {
        'Name' => 'BEAM_MODE_TYPE',
        'Description' => 'In most cases, the BEAM_MODE_TYPE value is the same as the BEAM_MODE attribute. Each platform has its own scheme for defining acquisition sensor beam modes. Beam modes often reflect a set configuration of polarization, resolution, and off-nadir pointing angle.',
        'DataType' => 'STRING'
      }, {
        'Name' => 'INSAR_BASELINE',
        'Description' => 'The perpendicular distance between two satellites when they took the related two images. Useful for identifying image pairs to use for interferometry.',
        'DataType' => 'FLOAT'
      }, {
        'Name' => 'CENTER_FRAME_ID',
        'Description' => 'ID of the center frame',
        'DataType' => 'STRING'
      }, {
        'Name' => 'CENTER_ESA_FRAME',
        'Description' => 'The European Space Agency equivalent to the value in the FRAME_NUMBER field',
        'DataType' => 'INT'
      }, {
        'Name' => 'ACQUISITION_DATE',
        'Description' => 'Date the data was acquired by the satellite or aircraft and instrument.',
        'DataType' => 'STRING'
      }, {
        'Name' => 'MISSION_NAME',
        'Description' => 'The sitenames where AIRSAR, AIRMOSS, and UAVSAR acquisitions were taken.',
        'DataType' => 'STRING'
      }, {
        'Name' => 'CENTER_LON',
        'Description' => 'Longitude of the center of the scene or frame.',
        'DataType' => 'FLOAT'
      }, {
        'Name' => 'NEAR_START_LAT',
        'Description' => 'Latitude of the granule where imaging began nearest to the satellite. For an ascending satellite, it locates the lower left corner of a north-oriented image.',
        'DataType' => 'FLOAT'
      }, {
        'Name' => 'BEAM_MODE',
        'Description' => 'The general type of active sensor used. Values indicate image resolution=> such as standard, fine, wide, scansar wide, SM (strip mode), EW (extra wide). Or indicate resolution + polarization=> FBS (fine beam single polarization), FBD (fine beam dual pol). Or atypically the type of product=> TOPSAR (high resolution DEM), RPI (repeat pass interferometry), XTI (across track interferometry). Or resolution and product type IW (interferometric wide).',
        'DataType' => 'STRING'
      }, {
        'Name' => 'BEAM_MODE_DESC',
        'Description' => 'Text that describes the beam mode',
        'DataType' => 'STRING'
      }, {
        'Name' => 'PROCESSING_TYPE',
        'Description' => 'Indicates the type of product, such as browse, metadata, L1, complex, amplitude, projected, terrain corrected.',
        'DataType' => 'STRING'
      }, {
        'Name' => 'PROCESSING_DESCRIPTION',
        'Description' => 'Describes what the data was processed to. For example=> low resolution terrain corrected ALOS data.',
        'DataType' => 'STRING'
      }, {
        'Name' => 'FRAME_NUMBER',
        'Description' => 'The designated frame or scene as defined by various space agencies (ESA, JAXA, CSA) each of which have their own scheme. The frame describes a box over the Earth at a fixed latitude. Combined with a path number (for longitude it identifies a specific piece of ground).',
        'DataType' => 'INT'
      }, {
        'Name' => 'PROCESSING_LEVEL',
        'Description' => 'Indicates how much processing has been done to the data=> L1, L1.0 unprocessed; L1.1 single look complex; L1, L1.5 amplitude image; L2, L2.2 terrain corrected image.',
        'DataType' => 'STRING'
      }, {
        'Name' => 'PROCESSING_DATE',
        'Description' => 'The date the data was processed',
        'DataType' => 'STRING'
      }, {
        'Name' => 'NEAR_START_LON',
        'Description' => 'Longitude of the granule where imaging began nearest the satellite. For an ascending satellite, it locates the lower left corner of a north-oriented image.',
        'DataType' => 'FLOAT'
      }, {
        'Name' => 'DOPPLER',
        'Description' => 'The doppler centroid frequency - Useful for SAR processing and interferometry. Related to the squint of the satellite.',
        'DataType' => 'FLOAT'
      }, {
        'Name' => 'FAR_START_LAT',
        'Description' => 'Latitude of the granule where imaging began farthest from the satellite. For an ascending satellite, it locates the lower right corner of a north-oriented image.',
        'DataType' => 'FLOAT'
      }, {
        'Name' => 'NEAR_END_LON',
        'Description' => 'Longitude of the granule where imaging ended nearest to the satellite. For an ascending satellite, it locates the upper left corner of a north-oriented image.',
        'DataType' => 'FLOAT'
      }, {
        'Name' => 'PROCESSING_TYPE_DISPLAY',
        'Description' => 'Label that will be displayed in ASF\'s Vertex interface',
        'DataType' => 'STRING'
      }, {
        'Name' => 'POLARIZATION',
        'Description' => 'Radar transmissions are polarized, with components normally termed vertical (V) and horizontal (H). Vertical means that the electric vector is in the plane of incidence; horizontal means the electric vector is perpendicular to the plane of incidence.',
        'DataType' => 'STRING'
      }, {
        'Name' => 'FAR_START_LON',
        'Description' => 'Latitude of the granule where imaging began farthest from the satellite. For an ascending satellite, it locates the lower right corner of a north-oriented image.',
        'DataType' => 'FLOAT'
      }, {
        'Name' => 'THUMBNAIL_URL',
        'Description' => 'URL that points to this granule\'s thumbnail image',
        'DataType' => 'STRING'
      }, {
        'Name' => 'ASF_PLATFORM',
        'Description' => 'Internal ASF platform name',
        'DataType' => 'STRING'
      }, {
        'Name' => 'INSAR_STACK_ID',
        'Description' => 'An ASF-assigned unique number used internally to unify SAR images over the same location. Used for data that might be used for interferometry.',
        'DataType' => 'INT'
      }, {
        'Name' => 'LOOK_DIRECTION',
        'Description' => 'SAR imagery is taken with the sensor pointing either left or right of the satellite. Most data is right-looking.',
        'DataType' => 'STRING'
      }, {
        'Name' => 'PATH_NUMBER',
        'Description' => 'The path describes a path the satellite will follow over the earth similar to longitude; each path has an assigned number. Combined with a frame number it identifies a specific piece of ground.',
        'DataType' => 'INT'
      }, {
        'Name' => 'NEAR_END_LAT',
        'Description' => 'Latitude of the granule where imaging ended nearest to the satellite. For an ascending satellite, it locates the upper left corner of a north-oriented image.',
        'DataType' => 'FLOAT'
      }, {
        'Name' => 'FARADAY_ROTATION',
        'Description' => 'An effect of the ionosphere that rotates polarizations from HH or VV or HV or VH. Significant for L or P band. Rotation over 5 degrees reduces usefulness for applications such as forest biomass. Effect is reduced at solar minimum.',
        'DataType' => 'STRING'
      }, {
        'Name' => 'FAR_END_LON',
        'Description' => 'Longitude of the granule where imaging ended farthest from the satellite. For an ascending satellite, it locates the upper right corner of a north-oriented image.',
        'DataType' => 'FLOAT'
      }, {
        'Name' => 'BYTES',
        'Description' => 'Product size in bytes.',
        'DataType' => 'FLOAT'
      }, {
        'Name' => 'CENTER_LAT',
        'Description' => 'Latitude of the center of the scene or frame.',
        'DataType' => 'FLOAT'
      }, {
        'Name' => 'DEM_REGION',
        'Description' => 'The DEM_REGION for this collection',
        'DataType' => 'STRING'
      }
    ],
    'SpatialExtent' => {
      'HorizontalSpatialDomain' => {
        'Geometry' => {
          'CoordinateSystem' => 'CARTESIAN',
          'BoundingRectangles' => [
            {
              'WestBoundingCoordinate' => -180.0,
              'NorthBoundingCoordinate' => 90.0,
              'EastBoundingCoordinate' => 180.0,
              'SouthBoundingCoordinate' => -90.0
            }
          ]
        }
      },
      'GranuleSpatialRepresentation' => 'GEODETIC'
    },
    'CollectionProgress' => 'ACTIVE',
    'ScienceKeywords' => [
      {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'AGRICULTURE',
        'Term' => 'FOREST SCIENCE',
        'VariableLevel1' => 'REFORESTATION'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'BIOSPHERE',
        'Term' => 'TERRESTRIAL ECOSYSTEMS',
        'VariableLevel1' => 'AGRICULTURAL LANDS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'BIOSPHERE',
        'Term' => 'TERRESTRIAL ECOSYSTEMS',
        'VariableLevel1' => 'ALPINE/TUNDRA'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'BIOSPHERE',
        'Term' => 'TERRESTRIAL ECOSYSTEMS',
        'VariableLevel1' => 'BEACHES'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'BIOSPHERE',
        'Term' => 'TERRESTRIAL ECOSYSTEMS',
        'VariableLevel1' => 'DESERTS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'BIOSPHERE',
        'Term' => 'TERRESTRIAL ECOSYSTEMS',
        'VariableLevel1' => 'DUNES'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'BIOSPHERE',
        'Term' => 'TERRESTRIAL ECOSYSTEMS',
        'VariableLevel1' => 'FORESTS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'BIOSPHERE',
        'Term' => 'TERRESTRIAL ECOSYSTEMS',
        'VariableLevel1' => 'GRASSLANDS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'BIOSPHERE',
        'Term' => 'TERRESTRIAL ECOSYSTEMS',
        'VariableLevel1' => 'ISLANDS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'BIOSPHERE',
        'Term' => 'TERRESTRIAL ECOSYSTEMS',
        'VariableLevel1' => 'URBAN LANDS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'BIOSPHERE',
        'Term' => 'TERRESTRIAL ECOSYSTEMS',
        'VariableLevel1' => 'WETLANDS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'FROZEN GROUND',
        'VariableLevel1' => 'PERIGLACIAL PROCESSES'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'FROZEN GROUND',
        'VariableLevel1' => 'PERMAFROST'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'FROZEN GROUND',
        'VariableLevel1' => 'ROCK GLACIERS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'GLACIERS/ICE SHEETS',
        'VariableLevel1' => 'GLACIER ELEVATION/ICE SHEET ELEVATION'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'GLACIERS/ICE SHEETS',
        'VariableLevel1' => 'GLACIER MOTION/ICE SHEET MOTION'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'GLACIERS/ICE SHEETS',
        'VariableLevel1' => 'GLACIER THICKNESS/ICE SHEET THICKNESS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'GLACIERS/ICE SHEETS',
        'VariableLevel1' => 'GLACIER TOPOGRAPHY/ICE SHEET TOPOGRAPHY'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'GLACIERS/ICE SHEETS',
        'VariableLevel1' => 'GLACIERS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'GLACIERS/ICE SHEETS',
        'VariableLevel1' => 'GLACIERS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'GLACIERS/ICE SHEETS',
        'VariableLevel1' => 'ICE SHEETS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'GLACIERS/ICE SHEETS',
        'VariableLevel1' => 'ICEBERGS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'ICE DEFORMATION'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'ICE DEPTH/THICKNESS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'ICE EDGES'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'ICE EXTENT'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'ICE EXTENT'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'ICE FLOES'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'ICE GROWTH/MELT'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'ICE ROUGHNESS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'ICE TEMPERATURE'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'ICE TYPES'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'ICEBERGS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'LEADS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'PACK ICE'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'POLYNYAS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'REFLECTANCE'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'SEA ICE MOTION'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SNOW/ICE',
        'VariableLevel1' => 'ICE EXTENT'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SNOW/ICE',
        'VariableLevel1' => 'ICE GROWTH/MELT'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SNOW/ICE',
        'VariableLevel1' => 'ICE MOTION'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SNOW/ICE',
        'VariableLevel1' => 'ICE VELOCITY'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SNOW/ICE',
        'VariableLevel1' => 'LAKE ICE'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SNOW/ICE',
        'VariableLevel1' => 'PERMAFROST'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SNOW/ICE',
        'VariableLevel1' => 'RIVER ICE'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SNOW/ICE',
        'VariableLevel1' => 'SNOW COVER'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'LAND SURFACE',
        'Term' => 'EROSION/SEDIMENTATION',
        'VariableLevel1' => 'LANDSLIDES'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'LAND SURFACE',
        'Term' => 'GEOMORPHIC LANDFORMS/PROCESSES',
        'VariableLevel1' => 'COASTAL LANDFORMS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'LAND SURFACE',
        'Term' => 'LANDSCAPE',
        'VariableLevel1' => 'LANDSCAPE PATTERNS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'LAND SURFACE',
        'Term' => 'TOPOGRAPHY',
        'VariableLevel1' => 'LANDFORMS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'LAND SURFACE',
        'Term' => 'TOPOGRAPHY',
        'VariableLevel1' => 'SURFACE ROUGHNESS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'LAND SURFACE',
        'Term' => 'TOPOGRAPHY',
        'VariableLevel1' => 'TERRAIN ELEVATION'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'LAND SURFACE',
        'Term' => 'TOPOGRAPHY',
        'VariableLevel1' => 'TOPOGRAPHIC EFFECTS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'OCEANS',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'ICE DEFORMATION'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'OCEANS',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'ICE DEPTH/THICKNESS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'OCEANS',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'ICE EDGES'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'OCEANS',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'ICE EXTENT'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'OCEANS',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'ICE FLOES'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'OCEANS',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'ICE ROUGHNESS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'OCEANS',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'ICE TYPES'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'OCEANS',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'ICEBERGS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'OCEANS',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'LEADS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'OCEANS',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'PACK ICE'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'OCEANS',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'POLYNYAS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'OCEANS',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'SEA ICE MOTION'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'SOLID EARTH',
        'Term' => 'GEOMORPHIC LANDFORMS/PROCESSES',
        'VariableLevel1' => 'GLACIAL LANDFORMS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'SOLID EARTH',
        'Term' => 'GEOMORPHIC LANDFORMS/PROCESSES',
        'VariableLevel1' => 'TECTONIC LANDFORMS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'SOLID EARTH',
        'Term' => 'TECTONICS',
        'VariableLevel1' => 'EARTHQUAKES'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'SOLID EARTH',
        'Term' => 'TECTONICS',
        'VariableLevel1' => 'EARTHQUAKES'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'SOLID EARTH',
        'Term' => 'TECTONICS',
        'VariableLevel1' => 'PLATE TECTONICS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'SOLID EARTH',
        'Term' => 'TECTONICS',
        'VariableLevel1' => 'VOLCANIC ACTIVITY'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'SOLID EARTH',
        'Term' => 'TECTONICS',
        'VariableLevel1' => 'VOLCANIC ACTIVITY'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'TERRESTRIAL HYDROSPHERE',
        'Term' => 'GLACIERS/ICE SHEETS',
        'VariableLevel1' => 'GLACIER ELEVATION/ICE SHEET ELEVATION'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'TERRESTRIAL HYDROSPHERE',
        'Term' => 'GLACIERS/ICE SHEETS',
        'VariableLevel1' => 'GLACIER MOTION/ICE SHEET MOTION'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'TERRESTRIAL HYDROSPHERE',
        'Term' => 'GLACIERS/ICE SHEETS',
        'VariableLevel1' => 'GLACIER TOPOGRAPHY/ICE SHEET TOPOGRAPHY'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'TERRESTRIAL HYDROSPHERE',
        'Term' => 'GLACIERS/ICE SHEETS',
        'VariableLevel1' => 'GLACIERS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'TERRESTRIAL HYDROSPHERE',
        'Term' => 'GLACIERS/ICE SHEETS',
        'VariableLevel1' => 'ICE SHEETS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'TERRESTRIAL HYDROSPHERE',
        'Term' => 'GLACIERS/ICE SHEETS',
        'VariableLevel1' => 'ICEBERGS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'TERRESTRIAL HYDROSPHERE',
        'Term' => 'SNOW/ICE',
        'VariableLevel1' => 'ICE EXTENT'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'TERRESTRIAL HYDROSPHERE',
        'Term' => 'SNOW/ICE',
        'VariableLevel1' => 'ICE GROWTH/MELT'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'TERRESTRIAL HYDROSPHERE',
        'Term' => 'SNOW/ICE',
        'VariableLevel1' => 'ICE MOTION'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'TERRESTRIAL HYDROSPHERE',
        'Term' => 'SNOW/ICE',
        'VariableLevel1' => 'ICE VELOCITY'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'TERRESTRIAL HYDROSPHERE',
        'Term' => 'SNOW/ICE',
        'VariableLevel1' => 'LAKE ICE'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'TERRESTRIAL HYDROSPHERE',
        'Term' => 'SNOW/ICE',
        'VariableLevel1' => 'PERMAFROST'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'TERRESTRIAL HYDROSPHERE',
        'Term' => 'SNOW/ICE',
        'VariableLevel1' => 'RIVER ICE'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'TERRESTRIAL HYDROSPHERE',
        'Term' => 'SURFACE WATER',
        'VariableLevel1' => 'WETLANDS'
      }
    ],
    'TemporalExtents' => [
      {
        'PrecisionOfSeconds' => 1,
        'EndsAtPresentFlag' => false,
        'RangeDateTimes' => [
          {
            'BeginningDateTime' => '1995-10-01T03:13:03.000Z',
            'EndingDateTime' => '2011-07-04T00:23:48.000Z'
          }
        ]
      }
    ],
    'ProcessingLevel' => {
      'ProcessingLevelDescription' => 'ERS-2 Standard Beam Data processed to a level 0 format for input into other processors for creating custom products.',
      'Id' => '0'
    },
    'DOI' => {
      'MissingReason' => 'Unknown',
      'Explanation' => 'It is unknown if this record has a DOI.'
    },
    'ShortName' => 'ERS-2_L0',
    'EntryTitle' => 'ERS-2_LEVEL0',
    'RelatedUrls' => [
      {
        'Description' => 'Vertex, the ASF search and download interface',
        'URLContentType' => 'DistributionURL',
        'Type' => 'GET DATA',
        'URL' => 'https=>//vertex.daac.asf.alaska.edu/'
      }
    ],
    'DataDates' => [
      {
        'Date' => '2010-10-05T12:07:25.000Z',
        'Type' => 'CREATE'
      }, {
        'Date' => '2014-01-16T22:05:58.000Z',
        'Type' => 'UPDATE'
      }
    ],
    'Abstract' => 'ERS-2 Standard Beam Data Level 0',
    'Version' => '1',
    'DataCenters' => [
      {
        'Roles' => [ 'PROCESSOR' ],
        'ShortName' => 'ASF'
      }, {
        'Roles' => [ 'ARCHIVER' ],
        'ShortName' => 'ASF',
        'ContactInformation' => {
          'ContactMechanisms' => [
            {
              'Type' => 'Telephone',
              'Value' => '907-474-5041'
            }, {
              'Type' => 'Email',
              'Value' => 'uso@asf.alaska.edu'
            }
          ]
        }
      }, {
        'Roles' => [ 'DISTRIBUTOR' ],
        'ShortName' => 'ASF',
        'ContactInformation' => {
          'ContactMechanisms' => [
            {
              'Type' => 'Telephone',
              'Value' => '907-474-5041'
            }, {
              'Type' => 'Email',
              'Value' => 'uso@asf.alaska.edu'
            }
          ]
        }
      }
    ],
    'Platforms' => [
      {
        'Type' => 'Spacecraft',
        'ShortName' => 'ERS-3',
        'LongName' => 'European Remote Sensing Satellite-3',
        'Instruments' => [
          {
            'ShortName' => 'SAR',
            'LongName' => 'Synthetic Aperture Radar',
            'ComposedOf' => [
              {
                'ShortName' => 'STD'
              }
            ],
            'OperationalModes' => [ 'Arctic', 'Antarctic' ]
          }
        ]
      }
    ]
  }
end

def progressive_update_with_errors
  {
    'AdditionalAttributes' => [
      {
        'Name' => 'FLIGHT_LINE',
        'Description' => 'Flight line identifies where the aircraft/instrument has flown to acquire data.',
        'DataType' => 'STRING',
        'ParameterRangeBegin' => '-180.0'
      }, {
        'Name' => 'GROUP_ID',
        'Description' => 'ID that helps ASF group products',
        'DataType' => 'STRING'
      }, {
        'Name' => 'OFF_NADIR_ANGLE',
        'Description' => 'The angle the sensor points away from the satellite\'s nadir (off to the side). Larger angles correspond to imaging farther away from the satellite.',
        'DataType' => 'FLOAT'
      }, {
        'Name' => 'MD5SUM',
        'Description' => 'Checksum',
        'DataType' => 'STRING'
      }, {
        'Name' => 'GRANULE_TYPE',
        'Description' => 'Identifies the type of data by combining platform, beam mode type, and coverage (frame/swath)',
        'DataType' => 'STRING'
      }, {
        'Name' => 'ASCENDING_DESCENDING',
        'Description' => 'Describes whether the satellite travel direction was ascending towards the north pole, or descending towards the south pole.',
        'DataType' => 'STRING'
      }, {
        'Name' => 'FAR_END_LAT',
        'Description' => 'Latitude of the granule where imaging ended farthest from the satellite. For an ascending satellite, it locates the upper right corner of a north-oriented image.',
        'DataType' => 'FLOAT'
      }, {
        'Name' => 'INSAR_STACK_SIZE',
        'Description' => 'The number of SAR images over the same location in the entire ASF archive. Used for data that may be used for interferometry.',
        'DataType' => 'INT'
      }, {
        'Name' => 'BEAM_MODE_TYPE',
        'Description' => 'In most cases, the BEAM_MODE_TYPE value is the same as the BEAM_MODE attribute. Each platform has its own scheme for defining acquisition sensor beam modes. Beam modes often reflect a set configuration of polarization, resolution, and off-nadir pointing angle.',
        'DataType' => 'STRING'
      }, {
        'Name' => 'INSAR_BASELINE',
        'Description' => 'The perpendicular distance between two satellites when they took the related two images. Useful for identifying image pairs to use for interferometry.',
        'DataType' => 'FLOAT'
      }, {
        'Name' => 'CENTER_FRAME_ID',
        'Description' => 'ID of the center frame',
        'DataType' => 'STRING'
      }, {
        'Name' => 'CENTER_ESA_FRAME',
        'Description' => 'The European Space Agency equivalent to the value in the FRAME_NUMBER field',
        'DataType' => 'INT'
      }, {
        'Name' => 'ACQUISITION_DATE',
        'Description' => 'Date the data was acquired by the satellite or aircraft and instrument.',
        'DataType' => 'STRING'
      }, {
        'Name' => 'MISSION_NAME',
        'Description' => 'The sitenames where AIRSAR, AIRMOSS, and UAVSAR acquisitions were taken.',
        'DataType' => 'STRING'
      }, {
        'Name' => 'CENTER_LON',
        'Description' => 'Longitude of the center of the scene or frame.',
        'DataType' => 'FLOAT'
      }, {
        'Name' => 'NEAR_START_LAT',
        'Description' => 'Latitude of the granule where imaging began nearest to the satellite. For an ascending satellite, it locates the lower left corner of a north-oriented image.',
        'DataType' => 'FLOAT'
      }, {
        'Name' => 'BEAM_MODE',
        'Description' => 'The general type of active sensor used. Values indicate image resolution=> such as standard, fine, wide, scansar wide, SM (strip mode), EW (extra wide). Or indicate resolution + polarization=> FBS (fine beam single polarization), FBD (fine beam dual pol). Or atypically the type of product=> TOPSAR (high resolution DEM), RPI (repeat pass interferometry), XTI (across track interferometry). Or resolution and product type IW (interferometric wide).',
        'DataType' => 'STRING'
      }, {
        'Name' => 'BEAM_MODE_DESC',
        'Description' => 'Text that describes the beam mode',
        'DataType' => 'STRING'
      }, {
        'Name' => 'PROCESSING_TYPE',
        'Description' => 'Indicates the type of product, such as browse, metadata, L1, complex, amplitude, projected, terrain corrected.',
        'DataType' => 'STRING'
      }, {
        'Name' => 'PROCESSING_DESCRIPTION',
        'Description' => 'Describes what the data was processed to. For example=> low resolution terrain corrected ALOS data.',
        'DataType' => 'STRING'
      }, {
        'Name' => 'FRAME_NUMBER',
        'Description' => 'The designated frame or scene as defined by various space agencies (ESA, JAXA, CSA) each of which have their own scheme. The frame describes a box over the Earth at a fixed latitude. Combined with a path number (for longitude it identifies a specific piece of ground).',
        'DataType' => 'INT'
      }, {
        'Name' => 'PROCESSING_LEVEL',
        'Description' => 'Indicates how much processing has been done to the data=> L1, L1.0 unprocessed; L1.1 single look complex; L1, L1.5 amplitude image; L2, L2.2 terrain corrected image.',
        'DataType' => 'STRING'
      }, {
        'Name' => 'PROCESSING_DATE',
        'Description' => 'The date the data was processed',
        'DataType' => 'STRING'
      }, {
        'Name' => 'NEAR_START_LON',
        'Description' => 'Longitude of the granule where imaging began nearest the satellite. For an ascending satellite, it locates the lower left corner of a north-oriented image.',
        'DataType' => 'FLOAT'
      }, {
        'Name' => 'DOPPLER',
        'Description' => 'The doppler centroid frequency - Useful for SAR processing and interferometry. Related to the squint of the satellite.',
        'DataType' => 'FLOAT'
      }, {
        'Name' => 'FAR_START_LAT',
        'Description' => 'Latitude of the granule where imaging began farthest from the satellite. For an ascending satellite, it locates the lower right corner of a north-oriented image.',
        'DataType' => 'FLOAT'
      }, {
        'Name' => 'NEAR_END_LON',
        'Description' => 'Longitude of the granule where imaging ended nearest to the satellite. For an ascending satellite, it locates the upper left corner of a north-oriented image.',
        'DataType' => 'FLOAT'
      }, {
        'Name' => 'PROCESSING_TYPE_DISPLAY',
        'Description' => 'Label that will be displayed in ASF\'s Vertex interface',
        'DataType' => 'STRING'
      }, {
        'Name' => 'POLARIZATION',
        'Description' => 'Radar transmissions are polarized, with components normally termed vertical (V) and horizontal (H). Vertical means that the electric vector is in the plane of incidence; horizontal means the electric vector is perpendicular to the plane of incidence.',
        'DataType' => 'STRING'
      }, {
        'Name' => 'FAR_START_LON',
        'Description' => 'Latitude of the granule where imaging began farthest from the satellite. For an ascending satellite, it locates the lower right corner of a north-oriented image.',
        'DataType' => 'FLOAT'
      }, {
        'Name' => 'THUMBNAIL_URL',
        'Description' => 'URL that points to this granule\'s thumbnail image',
        'DataType' => 'STRING'
      }, {
        'Name' => 'ASF_PLATFORM',
        'Description' => 'Internal ASF platform name',
        'DataType' => 'STRING'
      }, {
        'Name' => 'INSAR_STACK_ID',
        'Description' => 'An ASF-assigned unique number used internally to unify SAR images over the same location. Used for data that might be used for interferometry.',
        'DataType' => 'INT'
      }, {
        'Name' => 'LOOK_DIRECTION',
        'Description' => 'SAR imagery is taken with the sensor pointing either left or right of the satellite. Most data is right-looking.',
        'DataType' => 'STRING'
      }, {
        'Name' => 'PATH_NUMBER',
        'Description' => 'The path describes a path the satellite will follow over the earth similar to longitude; each path has an assigned number. Combined with a frame number it identifies a specific piece of ground.',
        'DataType' => 'INT'
      }, {
        'Name' => 'NEAR_END_LAT',
        'Description' => 'Latitude of the granule where imaging ended nearest to the satellite. For an ascending satellite, it locates the upper left corner of a north-oriented image.',
        'DataType' => 'FLOAT'
      }, {
        'Name' => 'FARADAY_ROTATION',
        'Description' => 'An effect of the ionosphere that rotates polarizations from HH or VV or HV or VH. Significant for L or P band. Rotation over 5 degrees reduces usefulness for applications such as forest biomass. Effect is reduced at solar minimum.',
        'DataType' => 'STRING'
      }, {
        'Name' => 'FAR_END_LON',
        'Description' => 'Longitude of the granule where imaging ended farthest from the satellite. For an ascending satellite, it locates the upper right corner of a north-oriented image.',
        'DataType' => 'FLOAT'
      }, {
        'Name' => 'BYTES',
        'Description' => 'Product size in bytes.',
        'DataType' => 'FLOAT'
      }, {
        'Name' => 'CENTER_LAT',
        'Description' => 'Latitude of the center of the scene or frame.',
        'DataType' => 'FLOAT'
      }, {
        'Name' => 'DEM_REGION',
        'Description' => 'The DEM_REGION for this collection',
        'DataType' => 'STRING'
      }
    ],
    'SpatialExtent' => {
      'HorizontalSpatialDomain' => {
        'Geometry' => {
          'CoordinateSystem' => 'CARTESIAN',
          'BoundingRectangles' => [ {
            'WestBoundingCoordinate' => -180.0,
            'NorthBoundingCoordinate' => 90.0,
            'EastBoundingCoordinate' => 180.0,
            'SouthBoundingCoordinate' => -90.0
          } ]
        }
      },
      'GranuleSpatialRepresentation' => 'GEODETIC'
    },
    'CollectionProgress' => 'ACTIVE',
    'ScienceKeywords' => [
      {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'AGRICULTURE',
        'Term' => 'FOREST SCIENCE',
        'VariableLevel1' => 'REFORESTATION'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'BIOSPHERE',
        'Term' => 'TERRESTRIAL ECOSYSTEMS',
        'VariableLevel1' => 'AGRICULTURAL LANDS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'BIOSPHERE',
        'Term' => 'TERRESTRIAL ECOSYSTEMS',
        'VariableLevel1' => 'ALPINE/TUNDRA'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'BIOSPHERE',
        'Term' => 'TERRESTRIAL ECOSYSTEMS',
        'VariableLevel1' => 'BEACHES'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'BIOSPHERE',
        'Term' => 'TERRESTRIAL ECOSYSTEMS',
        'VariableLevel1' => 'DESERTS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'BIOSPHERE',
        'Term' => 'TERRESTRIAL ECOSYSTEMS',
        'VariableLevel1' => 'DUNES'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'BIOSPHERE',
        'Term' => 'TERRESTRIAL ECOSYSTEMS',
        'VariableLevel1' => 'FORESTS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'BIOSPHERE',
        'Term' => 'TERRESTRIAL ECOSYSTEMS',
        'VariableLevel1' => 'GRASSLANDS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'BIOSPHERE',
        'Term' => 'TERRESTRIAL ECOSYSTEMS',
        'VariableLevel1' => 'ISLANDS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'BIOSPHERE',
        'Term' => 'TERRESTRIAL ECOSYSTEMS',
        'VariableLevel1' => 'URBAN LANDS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'BIOSPHERE',
        'Term' => 'TERRESTRIAL ECOSYSTEMS',
        'VariableLevel1' => 'WETLANDS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'FROZEN GROUND',
        'VariableLevel1' => 'PERIGLACIAL PROCESSES'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'FROZEN GROUND',
        'VariableLevel1' => 'PERMAFROST'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'FROZEN GROUND',
        'VariableLevel1' => 'ROCK GLACIERS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'GLACIERS/ICE SHEETS',
        'VariableLevel1' => 'GLACIER ELEVATION/ICE SHEET ELEVATION'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'GLACIERS/ICE SHEETS',
        'VariableLevel1' => 'GLACIER MOTION/ICE SHEET MOTION'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'GLACIERS/ICE SHEETS',
        'VariableLevel1' => 'GLACIER THICKNESS/ICE SHEET THICKNESS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'GLACIERS/ICE SHEETS',
        'VariableLevel1' => 'GLACIER TOPOGRAPHY/ICE SHEET TOPOGRAPHY'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'GLACIERS/ICE SHEETS',
        'VariableLevel1' => 'GLACIERS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'GLACIERS/ICE SHEETS',
        'VariableLevel1' => 'GLACIERS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'GLACIERS/ICE SHEETS',
        'VariableLevel1' => 'ICE SHEETS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'GLACIERS/ICE SHEETS',
        'VariableLevel1' => 'ICEBERGS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'ICE DEFORMATION'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'ICE DEPTH/THICKNESS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'ICE EDGES'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'ICE EXTENT'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'ICE EXTENT'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'ICE FLOES'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'ICE GROWTH/MELT'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'ICE ROUGHNESS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'ICE TEMPERATURE'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'ICE TYPES'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'ICEBERGS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'LEADS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'PACK ICE'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'POLYNYAS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'REFLECTANCE'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'SEA ICE MOTION'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SNOW/ICE',
        'VariableLevel1' => 'ICE EXTENT'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SNOW/ICE',
        'VariableLevel1' => 'ICE GROWTH/MELT'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SNOW/ICE',
        'VariableLevel1' => 'ICE MOTION'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SNOW/ICE',
        'VariableLevel1' => 'ICE VELOCITY'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SNOW/ICE',
        'VariableLevel1' => 'LAKE ICE'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SNOW/ICE',
        'VariableLevel1' => 'PERMAFROST'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SNOW/ICE',
        'VariableLevel1' => 'RIVER ICE'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'CRYOSPHERE',
        'Term' => 'SNOW/ICE',
        'VariableLevel1' => 'SNOW COVER'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'LAND SURFACE',
        'Term' => 'EROSION/SEDIMENTATION',
        'VariableLevel1' => 'LANDSLIDES'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'LAND SURFACE',
        'Term' => 'GEOMORPHIC LANDFORMS/PROCESSES',
        'VariableLevel1' => 'COASTAL LANDFORMS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'LAND SURFACE',
        'Term' => 'LANDSCAPE',
        'VariableLevel1' => 'LANDSCAPE PATTERNS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'LAND SURFACE',
        'Term' => 'TOPOGRAPHY',
        'VariableLevel1' => 'LANDFORMS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'LAND SURFACE',
        'Term' => 'TOPOGRAPHY',
        'VariableLevel1' => 'SURFACE ROUGHNESS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'LAND SURFACE',
        'Term' => 'TOPOGRAPHY',
        'VariableLevel1' => 'TERRAIN ELEVATION'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'LAND SURFACE',
        'Term' => 'TOPOGRAPHY',
        'VariableLevel1' => 'TOPOGRAPHIC EFFECTS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'OCEANS',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'ICE DEFORMATION'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'OCEANS',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'ICE DEPTH/THICKNESS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'OCEANS',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'ICE EDGES'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'OCEANS',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'ICE EXTENT'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'OCEANS',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'ICE FLOES'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'OCEANS',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'ICE ROUGHNESS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'OCEANS',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'ICE TYPES'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'OCEANS',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'ICEBERGS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'OCEANS',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'LEADS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'OCEANS',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'PACK ICE'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'OCEANS',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'POLYNYAS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'OCEANS',
        'Term' => 'SEA ICE',
        'VariableLevel1' => 'SEA ICE MOTION'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'SOLID EARTH',
        'Term' => 'GEOMORPHIC LANDFORMS/PROCESSES',
        'VariableLevel1' => 'GLACIAL LANDFORMS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'SOLID EARTH',
        'Term' => 'GEOMORPHIC LANDFORMS/PROCESSES',
        'VariableLevel1' => 'TECTONIC LANDFORMS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'SOLID EARTH',
        'Term' => 'TECTONICS',
        'VariableLevel1' => 'EARTHQUAKES'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'SOLID EARTH',
        'Term' => 'TECTONICS',
        'VariableLevel1' => 'EARTHQUAKES'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'SOLID EARTH',
        'Term' => 'TECTONICS',
        'VariableLevel1' => 'PLATE TECTONICS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'SOLID EARTH',
        'Term' => 'TECTONICS',
        'VariableLevel1' => 'VOLCANIC ACTIVITY'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'SOLID EARTH',
        'Term' => 'TECTONICS',
        'VariableLevel1' => 'VOLCANIC ACTIVITY'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'TERRESTRIAL HYDROSPHERE',
        'Term' => 'GLACIERS/ICE SHEETS',
        'VariableLevel1' => 'GLACIER ELEVATION/ICE SHEET ELEVATION'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'TERRESTRIAL HYDROSPHERE',
        'Term' => 'GLACIERS/ICE SHEETS',
        'VariableLevel1' => 'GLACIER MOTION/ICE SHEET MOTION'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'TERRESTRIAL HYDROSPHERE',
        'Term' => 'GLACIERS/ICE SHEETS',
        'VariableLevel1' => 'GLACIER TOPOGRAPHY/ICE SHEET TOPOGRAPHY'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'TERRESTRIAL HYDROSPHERE',
        'Term' => 'GLACIERS/ICE SHEETS',
        'VariableLevel1' => 'GLACIERS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'TERRESTRIAL HYDROSPHERE',
        'Term' => 'GLACIERS/ICE SHEETS',
        'VariableLevel1' => 'ICE SHEETS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'TERRESTRIAL HYDROSPHERE',
        'Term' => 'GLACIERS/ICE SHEETS',
        'VariableLevel1' => 'ICEBERGS'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'TERRESTRIAL HYDROSPHERE',
        'Term' => 'SNOW/ICE',
        'VariableLevel1' => 'ICE EXTENT'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'TERRESTRIAL HYDROSPHERE',
        'Term' => 'SNOW/ICE',
        'VariableLevel1' => 'ICE GROWTH/MELT'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'TERRESTRIAL HYDROSPHERE',
        'Term' => 'SNOW/ICE',
        'VariableLevel1' => 'ICE MOTION'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'TERRESTRIAL HYDROSPHERE',
        'Term' => 'SNOW/ICE',
        'VariableLevel1' => 'ICE VELOCITY'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'TERRESTRIAL HYDROSPHERE',
        'Term' => 'SNOW/ICE',
        'VariableLevel1' => 'LAKE ICE'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'TERRESTRIAL HYDROSPHERE',
        'Term' => 'SNOW/ICE',
        'VariableLevel1' => 'PERMAFROST'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'TERRESTRIAL HYDROSPHERE',
        'Term' => 'SNOW/ICE',
        'VariableLevel1' => 'RIVER ICE'
      }, {
        'Category' => 'EARTH SCIENCE',
        'Topic' => 'TERRESTRIAL HYDROSPHERE',
        'Term' => 'SURFACE WATER',
        'VariableLevel1' => 'WETLANDS'
      }
    ],
    'TemporalExtents' => [
      {
        'PrecisionOfSeconds' => 1,
        'EndsAtPresentFlag' => false,
        'RangeDateTimes' => [
          {
            'BeginningDateTime' => '2011-07-04T00:23:48.000Z',
            'EndingDateTime' => '1995-10-01T03:13:03.000Z'
          }
        ]
      }
    ],
    'ProcessingLevel' => {
      'ProcessingLevelDescription' => 'ERS-2 Standard Beam Data processed to a level 0 format for input into other processors for creating custom products.',
      'Id' => '0'
    },
    'DOI' => {
      'MissingReason' => 'Unknown',
      'Explanation' => 'It is unknown if this record has a DOI.'
    },
    'ShortName' => 'ERS-2_L0',
    'EntryTitle' => 'ERS-2_LEVEL0',
    'RelatedUrls' => [
      {
        'Description' => 'Vertex, the ASF search and download interface',
        'URLContentType' => 'DistributionURL',
        'Type' => 'GET DATA',
        'URL' => 'https=>//vertex.daac.asf.alaska.edu/'
      }
    ],
    'DataDates' => [
      {
        'Date' => '2010-10-05T12:07:25.000Z',
        'Type' => 'CREATE'
      }, {
        'Date' => '2014-01-16T22:05:58.000Z',
        'Type' => 'UPDATE'
      }
    ],
    'Abstract' => 'ERS-2 Standard Beam Data Level 0',
    'Version' => '1',
    'Projects' => [
      {
        'ShortName' => 'IceBridge'
      }, {
        'ShortName' => 'IceBridge'
      }, {
        'ShortName' => 'IPY SEA ICE 2002-2003'
      }
    ],
    'MetadataAssociations' => [
      {
        'Type' => 'SCIENCE ASSOCIATED',
        'Description' => 'This is a description of the metadata association',
        'EntryId' => 'C1234453343-ECHO_REST',
        'Version' => '1'
      }, {
        'Type' => 'LARGER CITATION WORKS',
        'Description' => 'This is a description of the metadata association 2',
        'EntryId' => 'C1234453343-ECHO_REST',
        'Version' => '1'
      }
    ],
    'TilingIdentificationSystems' => [
      {
        'TilingIdentificationSystemName' => 'CALIPSO',
        'Coordinate1' => {
          'MinimumValue' => -100,
          'MaximumValue' => -50
        },
        'Coordinate2' => {
          'MinimumValue' => 50,
          'MaximumValue' => 100
        }
      },
      {
        'TilingIdentificationSystemName' => 'CALIPSO',
        'Coordinate1' => {
          'MinimumValue' => -100,
          'MaximumValue' => -50
        },
        'Coordinate2' => {
          'MinimumValue' => 50,
          'MaximumValue' => 100
        }
      }
    ],
    'DataCenters' => [
      {
        'Roles' => [ 'PROCESSOR' ],
        'ShortName' => 'ASF'
      }, {
        'Roles' => [ 'ARCHIVER' ],
        'ShortName' => 'ASF',
        'ContactInformation' => {
          'ContactMechanisms' => [
            {
              'Type' => 'Telephone',
              'Value' => '907-474-5041'
            }, {
              'Type' => 'Email',
              'Value' => 'uso@asf.alaska.edu'
            }
          ]
        }
      }, {
        'Roles' => [ 'DISTRIBUTOR' ],
        'ShortName' => 'ASF',
        'ContactInformation' => {
          'ContactMechanisms' => [
            {
              'Type' => 'Telephone',
              'Value' => '907-474-5041'
            }, {
              'Type' => 'Email',
              'Value' => 'uso@asf.alaska.edu'
            }
          ]
        }
      }
    ],
    'Platforms' => [
      {
        'Type' => 'Spacecraft',
        'ShortName' => 'ERS-3',
        'LongName' => 'European Remote Sensing Satellite-3',
        'Instruments' => [
          {
            'ShortName' => 'SAR',
            'LongName' => 'Synthetic Aperture Radar',
            'ComposedOf' => [
              {
                'ShortName' => 'STD'
              }
            ],
            'OperationalModes' => [ 'Arctic', 'Antarctic' ]
          }
        ]
      }, {
        'Type' => 'Spacecraft',
        'ShortName' => 'ERS-3',
        'LongName' => 'European Remote Sensing Satellite-3',
        'Instruments' => [
          {
            'ShortName' => 'SAR',
            'LongName' => 'Synthetic Aperture Radar',
            'ComposedOf' => [
              {
                'ShortName' => 'STD'
              }
            ],
            'OperationalModes' => [ 'Arctic', 'Antarctic' ]
          }
        ]
      }
    ]
  }
end
