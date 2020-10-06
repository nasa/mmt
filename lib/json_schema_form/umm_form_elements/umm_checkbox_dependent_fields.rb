#

# TODO: rename to include boolean?
class UmmCheckboxDependentFields < UmmFormElement


  # def default_value
  # end

  # def element_value
  # end

  # def element_has_value?
  # end

  # def checkbox_checked?
  # end

  def render_markup
    content_tag(:div) do
      # first add checkbox
      # how to check if there is a value
      concat(check_box_tag("#{keyify_property_name}_checkbox", element_value.present?, element_properties(schema_fragment)) )
      concat(label_tag("#{keyify_property_name}_checkbox", title))

      # create other part of form
        # if there is a value
        # checkbox is checked
        # the form is not hidden

        # if there is no value
        # checkbox is unchecked
        # form is hidden
      concat(content_tag(:div, class: 'row sub-fields') do
        form_fragment['items'].each do |property|

          # need section?
          # need label for bool

          # byebug
          # property['type'].constantize.new()
          concat property['type'].constantize.new(form_section_json: property, json_form: json_form, schema: schema, options: options, key: full_key + property['key'], field_value: field_value).render_markup
          # UmmFormElement.new(form_section_json: property, json_form: json_form, schema: schema, options: options, key: full_key + property['key'], field_value: field_value).render_markup
        end
      end)

    end
  end
end
