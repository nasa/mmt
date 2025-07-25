// This is not currently in CDN. This is a combination of five different schemas found here: https://git.earthdata.nasa.gov/projects/EMFD/repos/otherschemas/browse/visualization/v1.1.0/schema.json
const otherSchemasCitSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Citation Metadata',
  description: 'Schema for resources associated with EOSDIS datasets',
  type: 'object',
  additionalProperties: false,
  required: ['Name', 'Identifier', 'IdentifierType', 'ResolutionAuthority', 'MetadataSpecification'],
  properties: {
    Name: {
      type: 'string',
      description: 'The name of the cited resource',
      examples: ['Example Citation']
    },
    Identifier: {
      type: 'string',
      description: 'The identifier for the resource, e.g., DOI, ISBN, ARK',
      examples: ['10.5067/ABC123XYZ', '978-3-16-148410-0']
    },
    IdentifierType: {
      type: 'string',
      description: 'The type of identifier used',
      enum: ['DOI', 'ISBN', 'ARK'],
      examples: ['DOI']
    },
    ResolutionAuthority: {
      type: 'string',
      format: 'uri',
      description: 'URI used to resolve the identifier',
      examples: [
        'https://doi.org',
        'https://n2t.net',
        'https://isbndb.com'
      ]
    },
    RelatedIdentifiers: {
      type: 'array',
      description: 'List of identifiers that this resource cites, refers to, or is identical to',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['RelationshipType', 'RelatedIdentifierType', 'RelatedIdentifier', 'RelatedResolutionAuthority'],
        properties: {
          RelationshipType: {
            type: 'string',
            description: 'The nature of the relationship between the resource and other resources',
            enum: ['Cites', 'Refers', 'Describes', 'IsIdenticalTo'],
            examples: ['Cites']
          },
          RelatedIdentifierType: {
            type: 'string',
            description: 'The type of related identifier',
            enum: ['DOI', 'ISBN', 'ARK'],
            examples: ['DOI']
          },
          RelatedIdentifier: {
            type: 'string',
            description: 'The identifier for related resource',
            examples: ['10.5067/ABC123XYZ', '978-3-16-148410-0']
          },
          RelatedResolutionAuthority: {
            type: 'string',
            format: 'uri',
            description: 'URI used to resolve the related identifier',
            examples: ['https://doi.org']
          }
        }
      }
    },
    CitationMetadata: {
      type: 'object',
      additionalProperties: false,
      description: 'Citation metadata for the resource',
      required: ['Title', 'Year', 'Type'],
      properties: {
        Title: {
          type: 'string',
          description: 'Title of the resource',
          examples: ['Air quality during three covid-19 lockdown phases']
        },
        Year: {
          type: 'integer',
          description: 'Year when resource was published',
          examples: [2022]
        },
        Type: {
          type: 'string',
          description: 'Type of resource',
          enum: ['book', 'book-chapter', 'book-part', 'dataset', 'journal-article', 'monograph', 'posted-content', 'proceedings-article', 'report', 'software', 'theses', 'other'],
          examples: ['journal-article']
        },
        Author: {
          type: 'array',
          description: 'List of authors of the resource',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              ORCID: {
                type: 'string',
                description: 'ORCID identifier of the author',
                examples: ['0009-0004-9235-1891']
              },
              Given: {
                type: 'string',
                description: 'Given name of the author',
                examples: ['Abdelfettah']
              },
              Family: {
                type: 'string',
                description: 'Family name of the author',
                examples: ['Benchrif']
              },
              Sequence: {
                type: 'string',
                description: 'Position of the author in the author list',
                enum: ['first', 'additional'],
                examples: ['first']
              }
            }
          }
        },
        Publisher: {
          type: 'string',
          description: 'Name of the resource publisher'
        },
        Container: {
          type: 'string',
          description: 'Journal name for journal articles, conference name for proceedings, book name for book chapters',
          examples: ['Sustainable Cities and Society']
        },
        Volume: {
          type: 'string',
          description: 'The journal volume of journal article',
          examples: ['84']
        },
        Number: {
          type: 'string',
          description: 'The issue of a journal article or number of technical report',
          examples: ['1']
        },
        Pages: {
          type: 'string',
          description: 'Page numbers, separated either by commas or double-hyphens',
          examples: ['100-110']
        },
        Address: {
          type: 'string',
          description: 'The address where the book was published, or thesis or report were created',
          examples: ['Cham, Switzerland']
        },
        Institution: {
          type: 'string',
          description: 'Name of institution where the thesis or report were created',
          examples: ['Stanford University']
        }
      }
    },
    Abstract: {
      type: 'string',
      description: 'Citation abstract'
    },
    ScienceKeywords: {
      type: 'array',
      description: 'GCMD science keywords',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['Category', 'Topic', 'Term'],
        properties: {
          Category: {
            type: 'string',
            examples: ['EARTH SCIENCE']
          },
          Topic: {
            type: 'string',
            examples: ['ATMOSPHERE']
          },
          Term: {
            type: 'string',
            examples: ['ATMOSPHERIC TEMPERATURE']
          },
          VariableLevel1: {
            type: 'string',
            examples: ['UPPER AIR TEMPERATURE']
          },
          VariableLevel2: {
            type: 'string',
            examples: ['UPPER AIR TEMPERATURE']
          },
          VariableLevel3: {
            type: 'string',
            examples: ['UPPER AIR TEMPERATURE']
          },
          DetailedVariable: {
            type: 'string',
            examples: ['UPPER AIR TEMPERATURE']
          }
        },
        allOf: [
          {
            if: { required: ['DetailedVariable'] },
            then: { required: ['VariableLevel1'] }
          },
          {
            if: { required: ['VariableLevel3'] },
            then: { required: ['VariableLevel2'] }
          },
          {
            if: { required: ['VariableLevel2'] },
            then: { required: ['VariableLevel1'] }
          }
        ]
      }
    },
    MetadataSpecification: {
      description: "Required to add in schema information into every record. It includes the schema's name, version, and URL location. The information is controlled through enumerations at the end of this schema.",
      $ref: '#/definitions/MetadataSpecificationType'
    }
  },
  definitions: {
    MetadataSpecificationType: {
      type: 'object',
      additionalProperties: false,
      description: 'This object requires any metadata record that is validated by this schema to provide information about the schema.',
      properties: {
        URL: {
          description: 'This element represents the URL where the schema lives. The schema can be downloaded.',
          type: 'string',
          enum: ['https://cdn.earthdata.nasa.gov/generics/citation/v1.0.0']
        },
        Name: {
          description: 'This element represents the name of the schema.',
          type: 'string',
          enum: ['Citation']
        },
        Version: {
          description: 'This element represents the version of the schema.',
          type: 'string',
          enum: ['1.0.0']
        }
      },
      required: ['URL', 'Name', 'Version']
    }
  }
}

export default otherSchemasCitSchema
