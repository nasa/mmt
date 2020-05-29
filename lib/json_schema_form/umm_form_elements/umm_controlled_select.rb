# UmmControlledSelect is used for a select field,
# but one that has controlled keywords as options


# :nodoc:
class UmmControlledSelect < UmmSelect
  include ControlledKeywords

  def controlled_keyword
    parsed_json['controlledKeyword']
  end

  def select_class
    select2_class = !controlled_keyword.include?('related_url')
    short_name_class = !controlled_keyword.include?('related_url') && !controlled_keyword.include?('measurement')
    "validate #{'select2-select' if select2_class} #{controlled_keyword.dasherize.singularize}#{'-short-name' if short_name_class}-select"
  end

  def element_properties(element)
    properties = super(element)

    # Prevent children of this class from adding further properties
    return properties unless self.class.to_s == 'UmmControlledSelect'

    properties.merge(prompt: "Select a #{title}", class: select_class)
  end

  # load select options in from ControlledKeywords
  def ui_options
    case controlled_keyword
    when 'platforms'
      grouped_options_for_select(set_platform_types, element_value)
    when 'instruments'
      options_for_select(set_instruments, element_value)
    when 'data_centers'
      options_for_select(set_data_centers, element_value)
    when 'country'
      options_for_select(set_country_codes, element_value)
    when 'related_url_content_type'
      options_for_select(DraftsHelper::UMMSRelatedURLContentTypeOptions, element_value)
    when 'related_url_type'
      options_for_select(DraftsHelper::UMMSURLTypeOptions, element_value)
    when 'related_url_subtype'
      options_for_select(DraftsHelper::UMMSURLSubtypeOptions, element_value)
    when 'measurement_context_medium'
      options_for_select(set_measurement_names.keys, element_value)
    when 'measurement_object'
      value = element_value
      options_for_select([value], value)
    when 'measurement_quantity'
      value = element_value
      options_for_select([value], value)
    end
  end

  private

  def cmr_client
    @cmr_client ||= Cmr::Client.client_for_environment(Rails.configuration.cmr_env, Rails.configuration.services)
  end
end
