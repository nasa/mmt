module JsonSchemaForm
  module UmmPreviewElements
    # :nodoc:
    class UmmPreviewField < UmmPreviewForm
      # schema_type:  published_resource_name (service/variable)
      # preview_json: json from a 'form' field in the preview json
      # data:         full metadata of the record
      # key:          'key' of the current field object
      # options:      used mostly to pass the indexes option
      # full_key:     describes path through the metadata to get to what field describes
      # form_id:      metadata form the field is on
      def initialize(schema_type:, preview_json:, data:, key: '', draft_id: nil, options: {}, form_id:)
        super(schema_type: schema_type, preview_json: preview_json, data: data, key: key, draft_id: draft_id, options: options)

        @form_id = form_id
      end

      def render
        content_tag(:div, class: 'umm-preview-field-container preview', id: "#{idify_property_name(full_key)}_preview") do

          # adding a h5 tag for the field title and link placement
          concat(content_tag(:h5) do

            if preview_json['hideFieldTitle']
              # preview_json specifies to hide the field title
              if !draft_id.nil? && element_value.blank?
                # it is a draft and no value for the element, so add the link to
                # the draft form
                render_preview_link_to_draft_form
              end
            else
              # do not hide the field title
              concat field_title(preview_json)

              unless draft_id.nil?
                # it is a draft, so add the link to the draft form
                render_preview_link_to_draft_form
              end
            end
          end)

          if !element_value.blank?
            # the element has a value

            # default the type to UmmPreviewText
            type = preview_json.fetch('type', 'UmmPreviewText')

            if type != 'JsonObj' && type != 'JsonSchemaForm'
              puts type
              type.prepend("JsonSchemaForm::UmmPreviewElements::")
            end
            concat type.constantize.new(schema_type: schema_type, preview_json: preview_json, data: data, form_id: form_id, key: full_key, draft_id: draft_id, options: options).render
          else
            concat content_tag(:p, "No value for #{field_title(preview_json)} provided.", class: 'empty-section')
          end
        end
      end

      def render_preview_link_to_draft_form
        # render a link to the draft form, which follows `full_key` so if the link
        # is rendered for a specific field, it should link to that field
        concat(link_to("/#{schema_type}_drafts/#{draft_id}/edit/#{form_id}##{idify_property_name(full_key)}", class: 'hash-link') do
          concat content_tag(:i, nil, class: 'fa fa-edit')
          concat content_tag(:span, "Edit #{title}", class: 'is-invisible')
        end)
      end
    end
  end
end
