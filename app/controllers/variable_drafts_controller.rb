# :nodoc:
class VariableDraftsController < BaseDraftsController
  before_action :set_schema, only: :new
  before_action :set_object, only: :new
  before_action :set_form, only: :new
  before_action :set_science_keywords, only: :new

  private

  def set_schema
    @schema = UmmJsonSchema.new('umm-var-json-schema.json')
    @schema.fetch_references(@schema.parsed_json)
  end

  def set_object
    @object = {
      'Name'                 => 'Sollicitudin Vestibulum',
      'DataType'             => 'uchar8',
      'DimensionsName'       => 'Lorem Cras Pellentesque Dolor Elit',
      'FillValueDescription' => 'Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.',
      'ServiceType'          => {
        'ServiceType' => %w(WMS OPeNDAP),
        'Visualizable' => 'TRUE'
      },
      'Tagging' => [
        'Tagging 1',
        'Tagging 2'
      ],
      'ScienceKeywords' => [
        {
          'Category' => 'EARTH SCIENCE',
          'Topic'    => 'ATMOSPHERE',
          'Term'     => 'AEROSOLS'
        }
      ],
      'SetType' => [
        {
          'SetName' => 'name',
          'SetType' => 'type'
        },
        {
          'SetName' => 'name2',
          'SetType' => 'type2'
        }
      ]
    }
  end

  def set_form
    @form = UmmJsonForm.new('umm-var-form.json', @schema, @object)
  end

  def set_science_keywords
    @science_keywords = cmr_client.get_controlled_keywords('science_keywords')
  end
end
