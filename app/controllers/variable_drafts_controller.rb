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
      'LongName'             => 'Tristique Etiam Magna Vestibulum Malesuada',
      'Definition'           => 'Curabitur blandit tempus porttitor',
      'DataType'             => 'uchar8',
      'DimensionsName'       => 'Lorem Cras Pellentesque Dolor Elit',
      'Dimensions'           => 'Risus Malesuada Sit',
      'Scale'                => '0.002',
      'Offset'               => '0.49',
      'FillValueDescription' => 'Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor',
      'ServiceType'          => {
        'ServiceType' => %w(WMS OPeNDAP),
        'Visualizable' => 'TRUE'
      },
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
    @form = UmmJsonForm.new('umm-var-form.json', @schema, @object, 'field_prefix' => 'variable_draft/draft')
  end

  def set_science_keywords
    @science_keywords = cmr_client.get_controlled_keywords('science_keywords')
  end

  def variable_draft_params
    # TODO: Determine how to allow dynamic hashes through strong parameters
    params.require(:variable_draft).permit(:draft_type, draft: [])
  end
end
