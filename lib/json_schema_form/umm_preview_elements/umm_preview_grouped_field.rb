module JsonSchemaForm
  module UmmPreviewElements
    # Display fields grouped under a top level field

    # :nodoc:
    class UmmPreviewGroupedField < UmmPreviewField
      def render
        capture do
          content_tag(:fieldset) do
            fields.each do |field|
              concat UmmPreviewField.new(schema_type: schema_type, preview_json: field, data: data, form_id: form_id, key: full_key, draft_id: draft_id, options: options).render
            end
          end
        end
      end
    end
  end
end
