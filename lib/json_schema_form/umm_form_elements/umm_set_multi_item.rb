module JsonSchemaForm
  module UmmFormElements
    # UmmSetMultiItem is used for an array of simple values, but with
    # a set number of items.
    # number_of_items = 3:
    # ["value1", "value2", "value3"]

    # :nodoc:
    class UmmSetMultiItem < UmmMultiItem
      def number_of_items
        parsed_json['numberItems']
      end

      def default_value
        Array.new(number_of_items)
      end

      def render_markup
        # The data level needs to be set here in order to generate required icons
        # when the array of items is required. This is being used in index ranges of
        # UMM-V. The data-level needs to be called out here (rather than passing
        # element_properties as in a lot of other places) to match the rest of the
        # implicit options hash and to retain the existing options.
        content_tag(:div, class: "multiple simple-multiple #{form_class}", id: idify_property_name, data: { level: element_properties(schema_fragment)[:data][:level] }) do
          indexes = options.fetch('indexes', [])

          values = Array.wrap(element_value)
          values = [] if values.empty?
          values += Array.new(number_of_items)
          values[0..(number_of_items - 1)].each_with_index do |value, index|
            concat(content_tag(:div, class: "multiple-item multiple-item-#{index}") do
              form_fragment['items'].each do |property|
                concat UmmForm.new(form_section_json: property, json_form: json_form, schema: schema, options: { 'indexes' => indexes + [index] }, key: full_key, field_value: value).render_markup
              end
            end)
          end
        end
      end

      # The parent implementation of element_data does not account for the terminal
      # '/items' in full_key that only occur in set_multi_items like ValidRanges and
      # IndexRanges in UMM-V 1.7
      def element_data
        full_key_with_terminal_field = remove_terminal_items_from_key
        field_name = full_key_with_terminal_field.last.underscore
        field_id = idify_property_name
        # remove the last instance of the field name to set the data level
        field_removed = field_id.sub(/(.*)#{Regexp.escape(field_name)}/i, '\1')

        options.fetch('data', {}).merge(level: field_removed)
      end

      def remove_terminal_items_from_key
        return full_key.split('/') unless full_key.split('/').last == 'items' && full_key.split('/').length > 1

        full_key.split('/')[0..-2]
      end
    end
  end
end