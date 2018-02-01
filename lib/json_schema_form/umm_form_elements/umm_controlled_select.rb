# :nodoc:
class UmmControlledSelect < UmmSelect
  include ControlledKeywords

  def controlled_keyword
    parsed_json['controlled_keyword']
  end

  def element_properties(element)
    properties = super(element)

    # Prevent children of this class from adding further properties
    return properties unless self.class.to_s == 'UmmControlledSelect'

    properties.merge(prompt: "Select a #{title}", class: "select2-select #{controlled_keyword.singularize}-short-name-select")
  end

  # load select options in from ControlledKeywords
  def ui_options
    case controlled_keyword
    when 'platforms'
      grouped_options_for_select(set_platform_types, element_value)
    when 'instruments'
      options_for_select(set_instruments, element_value)
    end
  end

  private

  def cmr_client
    @cmr_client ||= Cmr::Client.client_for_environment(Rails.configuration.cmr_env, Rails.configuration.services)
  end
end

# TODO this is calling CMR for every controlled keyword field on the form
