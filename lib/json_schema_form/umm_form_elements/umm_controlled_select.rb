module JsonSchemaForm
  module UmmFormElements
    # UmmControlledSelect is used for a select field, that has controlled keywords as options

    # :nodoc:
    class UmmControlledSelect < UmmSelect
      include ControlledKeywords

      def controlled_keyword
        parsed_json['controlledKeyword']
      end

      def select_class
        select2_class = !controlled_keyword.include?('related_url') && !controlled_keyword.include?('url_')
        short_name_class = !controlled_keyword.include?('related_url') && !controlled_keyword.include?('measurement')
        keyword_class = parsed_json['htmlClass'] || "#{controlled_keyword.dasherize.singularize}#{'-short-name' if short_name_class}-select"

        "validate #{'select2-select' if select2_class} #{keyword_class}"
      end

      def element_properties(element)
        properties = super(element)

        # Prevent children of this class from adding further properties
        return properties unless self.class.to_s == 'UmmControlledSelect'

        # add a prompt, replace classes with select_class
        properties.merge(prompt: "Select a #{title}", class: select_class)
      end

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
        when 'umm_t_related_url_content_type', 'umm_s_related_url_content_type'
          # for UMM-T v1.0 and UMM-S v1.4, Related URLs use the same mappings and enums.
          # When KMS has added Related URL Content Type as part of the Related URL
          # keywords provided, and UMM-T is updated to use KMS, then UMM-T and UMM-S
          # will both use KMS for Related URL mappings and enums
          options_for_select(RelatedUrlsHelper::UMMTRelatedURLContentTypeOptions, element_value)
        when 'umm_t_related_url_type', 'umm_s_related_url_type'
          options_for_select(RelatedUrlsHelper::UMMTRelatedURLTypeOptions, element_value)
        when 'umm_t_related_url_subtype', 'umm_s_related_url_subtype'
          options_for_select(RelatedUrlsHelper::UMMTRelatedURLSubtypeOptions, element_value)
        when 'umm_var_related_url_content_type'
          # currently only used for Var, but will be used for S and T in MMT-2686
          # so we should find a better name
          set_umm_var_related_urls
          options_for_select(@umm_var_related_url_content_type_options, element_value)
        when 'umm_var_related_url_type'
          set_umm_var_related_urls
          options_for_select(@umm_var_related_url_type_options, element_value)
        when 'umm_var_related_url_subtype'
          set_umm_var_related_urls
          options_for_select(@umm_var_related_url_subtype_options, element_value)
        when 'umm_t_url_content_type'
          options_for_select(RelatedUrlsHelper::UMMTURLContentTypeOptions, element_value)
        when 'umm_t_url_type'
          options_for_select(RelatedUrlsHelper::UMMTURLTypeOptions, element_value)
        when 'umm_t_url_subtype'
          options_for_select(RelatedUrlsHelper::UMMTURLSubtypeOptions, element_value)
        when 'measurement_context_medium'
          options_for_select(set_measurement_names.keys, element_value)
        when 'measurement_object'
          value = element_value
          options_for_select([value], value)
        when 'measurement_quantity'
          value = element_value
          options_for_select([value], value)
        when 'granule_data_format'
          options_for_select(set_granule_data_formats, element_value)
        when 'mime_type'
          options_for_select(set_mime_types, element_value)
        end
      end

      private

      def cmr_client
        @cmr_client ||= Cmr::Client.client_for_environment(Rails.configuration.cmr_env, Rails.configuration.services)
      end
    end
  end
end
