module JsonSchemaForm
  module UmmFormElements
    # UmmCheckboxDependentFields are used for form fields that should be hidden
    # unless the fields have a value or the user chooses to show them
    # the checkbox to show the fields are not part of the schema or draft metadata

    # :nodoc:
    class UmmCheckboxDependentFields < UmmFormElement


      def dependent_field_class
        form_fragment['dependentFields']
      end

      def render_markup

        content_tag(:div, class: "#{form_fragment['htmlClass']} #{dependent_field_class} checkbox-dependent-fields-parent") do
          concat(check_box_tag("#{dependent_field_class}_checkbox", 'show', element_value.present?, class: "dependent-fields-checkbox #{dependent_field_class}-checkbox", data: { 'dependent-field-class': dependent_field_class }))
          concat(label_tag("#{dependent_field_class}_checkbox") do
            concat(title)
          end)

          concat(content_tag(:div, class: "grid-row sub-fields checkbox-dependent-fields #{dependent_field_class}-fields #{'is-hidden' if element_value.blank?}", data: { 'dependent-field-class': dependent_field_class }) do
            concat(label_tag(keyify_property_name, title, class: 'space-bot'))
            concat(help_icon(help_path))

            form_fragment['items'].each do |property|
              element_class = property.fetch('type', 'UmmTextField')
              element_class = 'UmmFormSection' if element_class == 'section'
              concat element_class.constantize.new(form_section_json: property, json_form: json_form, schema: schema, options: options, key: full_key + property.fetch('key', ''), field_value: field_value).render_markup
            end
          end)

        end
      end
    end
  end
end
