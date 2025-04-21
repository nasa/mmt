module JsonSchemaForm
  module UmmFormElements
    # UmmMultiItems is used for an array on objects
    # [{key1: value1, key2: value2}, {key1: value1, key2: value2}, ...]

    # :nodoc:
    class UmmMultiItems < UmmFormElement
      def default_value
        [{}]
      end

      # Return whether or not this element has a stored value
      def value?
        Array.wrap(element_value).reject(&:empty?).any?
      end

      def form_title
        form_fragment.fetch('multiType', '').split('/').last.titleize.singularize
      end

      def type_title
        parsed_json.fetch('typeOverride', form_title)
      end

      def class_name
        if form_fragment['multiType'] == 'RelatedURLs'
          'related-urls'
        else
          form_fragment['multiType'].underscore.dasherize
        end
      end

      def render_markup
        content_tag(:div, class: "multiple #{class_name}", id: idify_property_name) do
          indexes = options.fetch('indexes', [])

          values = Array.wrap(element_value)
          values = [{}] if values.empty?
          values.each_with_index do |value, index|
            concat render_accordion(value, index, indexes + [index])
          end

          concat(content_tag(:div, class: 'actions') do
            button = UmmButton.new(form_section_json: form_fragment, json_form: json_form, schema: schema, options: { 'button_text' => "Add another #{type_title}", 'classes' => 'eui-btn--blue add-new' }).render_markup

            concat button
          end)
        end
      end

      def render_accordion(value, index, indexes)
        content_tag(:div, class: "multiple-item multiple-item-#{index} eui-accordion") do
          concat render_accordion_header(index)
          concat render_accordion_body(value, indexes)
        end
      end

      def render_accordion_header(index)
        content_tag(:div, class: 'eui-accordion__header') do
          concat(content_tag(:div, class: 'eui-accordion__icon', tabindex: '0') do
            concat content_tag(:i, '', class: 'eui-icon eui-fa-chevron-circle-down')
            concat content_tag(:span, "Toggle #{type_title} #{index + 1}", class: 'eui-sr-only')
          end)

          concat content_tag(:span, "#{type_title} #{index + 1}", class: 'header-title')

          concat(content_tag(:div, class: 'actions') do
            UmmRemoveLink.new(form_section_json: parsed_json, json_form: json_form, schema: schema, options: { 'name' => title }).render_markup
          end)
        end
      end

      def render_accordion_body(value, indexes)
        content_tag(:div, class: 'eui-accordion__body') do
          concat(content_tag(:div, class: 'grid-row sub-fields') do
            form_fragment['items'].each do |property|
              concat UmmForm.new(form_section_json: property, json_form: json_form, schema: schema, options: { 'indexes' => indexes }, key: full_key, field_value: value).render_markup
            end
          end)
        end
      end
    end
  end
end
