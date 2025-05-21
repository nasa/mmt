module JsonSchemaForm
  module UmmPreviewElements
    # render elements that may have multiple values
    # ["value1", "value2", ...]

    # :nodoc:
    class UmmPreviewMultiItem < UmmPreviewElement
      def render
        capture do
          indexes = options.fetch('indexes', [])

          values = Array.wrap(element_value)
          values = [] if values.empty?

          values.each_with_index do |value, index|
            concat(content_tag(:fieldset) do
              concat content_tag(:h6, "#{field_title(preview_json).singularize} #{index + 1}")
              concat UmmPreviewText.new(schema_type: schema_type, preview_json: preview_json, data: data, form_id: form_id, key: full_key, draft_id: draft_id, options: options.merge({ 'indexes' => indexes + [index], 'last_index_required' => true })).render
            end)
          end
        end
      end
    end
  end
end
