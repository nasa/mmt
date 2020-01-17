FactoryGirl.define do
  factory :v1_2_variable_draft, class: VariableDraft do

    native_id { 'variable_v1_2_native_id' }
    provider_id { 'MMT_2' }
    draft_type { 'VariableDraft' }

    draft {{
      "Name": "sea_ice_fraction_#{Faker::Space.galaxy}_#{Faker::Number.number(digits: 6)}",
      "LongName": "sea ice area fraction #{Faker::Space.nebula} #{Faker::Space.star_cluster} #{Faker::Number.number(digits: 6)}",
      "Definition": " sea_ice_fraction data shall be recorded in the variable sea_ice_fraction_dtime_from_sst. Units Percent byte ",
      "Units": "fraction (between 0 and 1)",
      "DataType": "int16",
      "Dimensions": [
        {
          "Name": "time",
          "Size": 1,
          "Type": "TIME_DIMENSION"
        },
        {
          "Name": "lat",
          "Size": 17999,
          "Type": "LATITUDE_DIMENSION"
        },
        {
          "Name": "lon",
          "Size": 36000,
          "Type": "LONGITUDE_DIMENSION"
        }
      ],
      "ValidRanges": [
        {
          "Min": 0.0,
          "Max": 100.0
        }
      ],
      "Scale": 0.01,
      "Offset": 0.0,
      "FillValues": [
        {
          "Value": -128.0,
          "Type": "ANCILLARY_FILLVALUE"
        }
      ],
      "VariableType": "SCIENCE_VARIABLE",
      "ScienceKeywords": [
        {
          "Category": "Earth Science",
          "Topic": "Oceans",
          "Term": "Ocean Temperature",
          "VariableLevel1": "Sea Surface Temperature"
        }
      ],
      "Sets": [
        {
          "Name": "Data_Fields",
          "Type": "General",
          "Size": 5,
          "Index": 4
        }
      ],
      "Characteristics": {
        "IndexRanges": {
          "LatRange": [
            -89.99,
            89.99
          ],
          "LonRange": [
            -179.99,
            180.0
          ]
        }
      }
    }}
  end

  factory :v1_2_service_draft, class: ServiceDraft do
    transient do

    end

    native_id { 'service_v1_2_native_id' }
    provider_id { 'MMT_2' }
    draft_type { 'ServiceDraft' }

    draft {{
      "RelatedURLs": [
        {
          "Description": "ESI Service for EDF_DEV08 EOSDIS Service Implementation",
          "URLContentType": "DistributionURL",
          "Type": "GET SERVICE",
          "Subtype": "ACCESS WEB SERVICE",
          "URL": "https://f5eil01.edn.ecs.nasa.gov/egi_DEV08",
          "GetService": {
            "MimeType": "application/x-hdf",
            "Protocol": "HTTPS",
            "FullName": "EGI/Request",
            "DataID": "Various",
            "DataType": "Various"
          }
        }
      ],
      "Type": "ESI",
      "ServiceKeywords": [
        {
          "ServiceCategory": "EARTH SCIENCE SERVICES",
          "ServiceTopic": "DATA MANAGEMENT/DATA HANDLING",
          "ServiceTerm": "DATA INTEROPERABILITY",
          "ServiceSpecificTerm": "DATA REFORMATTING"
        }
      ],
      "ServiceOrganizations": [
        {
          "Roles": [
            "PUBLISHER"
          ],
          "ShortName": "NASA/GSFC/EOS/EOSDIS/EMD",
          "LongName": "Maintenance and Development, Earth Observing System Data and Information System, Earth Observing System,Goddard Space Flight Center, NASA",
          "ContactInformation": {
            "RelatedUrls": [
              {
                "URLContentType": "DataContactURL",
                "Type": "HOME PAGE",
                "URL": "http://newsroom.gsfc.nasa.gov/"
              }
            ],
            "ContactMechanisms": [
              {
                "Type": "Email",
                "Value": "david.p.auty@nasa.gov"
              }
            ]
          }
        }
      ],
      "ServiceQuality": {
        "QualityFlag": "Available"
      },
      "AccessConstraints": "NONE",
      "Description": "EDF_DEV08 EOSDIS Service Implementation",
      "Version": "1",
      "UseConstraints": "NONE",
      "Name": "EDF_DEV08_#{Faker::Movies::HitchhikersGuideToTheGalaxy.location}_#{Faker::Number.number(digits: 30)}",
      "ServiceOptions": {
        "SubsetTypes": [
          "Spatial",
          "Variable"
        ],
        "SupportedInputProjections": [
          {
            "ProjectionName": "Geographic"
          },
          {
            "ProjectionName": "Lambert Azimuthal Equal Area"
          },
          {
            "ProjectionName": "Polar Stereographic"
          }
        ],
        "SupportedOutputProjections": [
          {
            "ProjectionName": "Geographic"
          },
          {
            "ProjectionName": "Lambert Azimuthal Equal Area"
          },
          {
            "ProjectionName": "Polar Stereographic"
          }
        ],
        "InterpolationTypes": [
          "Bilinear Interpolation",
          "Nearest Neighbor"
        ],
        "SupportedInputFormats": [
          "ASCII",
          "GEOTIFF",
          "NETCDF-3"
        ],
        "SupportedOutputFormats": [
          "ASCII",
          "GEOTIFF",
          "NETCDF-3"
        ]
      },
      "Platforms": [
        {
          "ShortName": "AQUA",
          "LongName": "Earth Observing System, AQUA",
          "Instruments": [
            {
              "ShortName": "AMSR-E",
              "LongName": "Advanced Microwave Scanning Radiometer-EOS"
            }
          ]
        }
      ],
      "LongName": "EDF_DEV08 EOSDIS Service Implementation #{Faker::Movies::HitchhikersGuideToTheGalaxy.quote.truncate(60, omission: '')}_#{Faker::Number.number(digits: 10)}"
    }}
  end
end
