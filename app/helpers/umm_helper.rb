# :nodoc:
module UmmHelper
  # def element_classes(property, initial_classes = nil)
  #   # Default classes
  #   classes = initial_classes || 'full-width'

  #   # Add textcounter to the UI if the element has a maxLength
  #   classes << ' textcounter' if property.key?('maxLength')

  #   classes
  # end

  # def validation_properties(element, schema)
  #   # jQuery Validate can use html elements for validation so we'll set those elements
  #   # here instead of having to define these attributes on a one off basis in javascript
  #   validation_properties = element.select { |key| %w(minLength maxLength pattern).include?(key) }

  #   # JSON Schema provides the required fields in a separate array so we have to look this up
  #   if schema_required_fields(schema).include?(element['key'])
  #     validation_properties['required'] = true

  #     # jQuery validation supports custom messages via data attributes
  #     validation_properties['data'] = {
  #       'msg-required': "#{element['key'].titleize} is required."
  #     }
  #   end

  #   validation_properties
  # end

  # def element_properties(element, schema, initial_classes = nil)
  #   { class: element_classes(element, initial_classes) }.merge(validation_properties(element, schema))
  # end

  def render_form_element(element, schema, object, prefix: nil)
    if element['type'] == 'section'
      render_section(element, schema, object, prefix: prefix)
    elsif element['type'] == 'fieldset'
      render_fieldset(element, schema, object, prefix: prefix)
    else
      send('render_markup', element.fetch('type', 'text'), schema.retrieve_schema_fragment(element['key']), schema, object, prefix: prefix)
    end
  end

  def render_markup(type, element, schema, object, prefix: nil)
    capture do
      # Label for the form field
      concat render_label(element, schema)

      # Help Icon and Modal
      concat mmt_help_icon(help: "properties/#{element['key']}", title: element['key'])

      # Render the field
      concat send("render_#{type}", element, schema, object, prefix: nil)
    end
  end

  def render_fieldset(element, schema, object, prefix: nil)
    content_tag(:fieldset, class: element['htmlClass']) do
      # Display a title for the section if its provided
      concat content_tag(:h4, element['title'], class: 'space-bot') if element.key?('title')

      # Display a description of the section if its provided
      concat content_tag(:p, element['description'], class: 'form-description space-bot') if element.key?('description')

      # Continue rendering fields that appear in this section
      element.fetch('items', []).each do |child_element|
        concat render_form_element(child_element, schema, object)
      end
    end
  end

  def render_section(element, schema, object, prefix: nil)
    content_tag(:div, class: element['htmlClass']) do
      # Display a title for the section if its provided
      concat content_tag(:h4, element['title'], class: 'space-bot') if element.key?('title')

      # Display a description of the section if its provided
      concat content_tag(:p, element['description'], class: 'form-description space-bot') if element.key?('description')

      # Continue rendering fields that appear in this section
      element.fetch('items', []).each do |child_element|
        concat render_form_element(child_element, schema, object)
      end
    end
  end

  def render_textarea(element, schema, object, prefix: nil)
    text_area_tag(keyify_property_name(element, prefix: prefix), get_element_value(object, element['key']), element_properties(element, schema))
  end

  def render_text(element, schema, object, prefix: nil)
    text_field_tag(keyify_property_name(element, prefix: prefix), get_element_value(object, element['key']), element_properties(element, schema))
  end

  def render_select(element, schema, object, prefix: nil)
    select_tag(keyify_property_name(element, prefix: prefix), options_for_select(element['enum'], get_element_value(object, element['key'])), element_properties(element, schema))
  end

  def render_multiselect(element, schema, object, prefix: nil)
    select_tag(keyify_property_name(element, prefix: prefix), options_for_select(element['items']['enum'], get_element_value(object, element['key'])), { multiple: true }.merge(element_properties(element, schema)))
  end

  def render_multitext(element, schema, object, prefix: nil)
    content_tag(:div, class: "simple-multiple multiple multitext #{element['key']}") do
      Array.wrap(object[element['key']]).each_with_index do |obj, index|
        concat(content_tag(:div, class: 'multiple-item') do
          concat text_field_tag("#{keyify_property_name(element, prefix: prefix)}[#{index}]", obj, element_properties(element, schema, 'half-width'))

          concat render_remove_link(element['key'])
        end)
      end

      concat content_tag(:div, render_button("Add another #{element['key']}", 'eui-btn--blue add-new'), class: 'actions')
    end
  end

  def render_remove_link(name, prefix: nil)
    content_tag(:a, class: 'remove') do
      concat content_tag(:i, '', class: 'fa fa-times-circle')
      concat content_tag(:span, "Remove #{name}", class: 'is-invisible')
    end
  end

  def render_button(title, classes, disabled = false, prefix: nil)
    button_tag(type: 'button', class: classes, disabled: disabled) do
      content_tag(:i, title, class: 'fa fa-plus-circle')
    end
  end

  def render_label(element, schema, prefix: nil)
    label_tag(keyify_property_name(element, prefix: prefix), element.fetch('label', element['key'].split('/').last.titleize), class: ('eui-required-o' if schema_required_fields(schema).include?(element['key'])))
  end

  def render_keyword(element, schema, object, prefix: nil)
    content_tag(:section) do
      concat render_keyword_list(element, schema, object[element['key']])

      concat render_keyword_picker

      concat content_tag(:div, render_button('Add Keyword', 'eui-btn--blue add-science-keyword', true), class: 'actions')
    end
  end

  def render_keyword_list(element, schema, object, prefix: nil)
    content_tag(:div, class: 'selected-science-keywords science-keywords') do
      concat(content_tag(:ul) do
        Array.wrap(object).each_with_index do |keyword, index|
          concat(content_tag(:li) do
            concat keyword_string(keyword)

            concat render_remove_link(keyword_string(keyword))

            concat hidden_field_tag("#{keyify_property_name(element)}[#{index}]", keyword_string(keyword))
          end)
        end
      end)

      concat hidden_field_tag("#{keyify_property_name(element)}[]", '')
    end
  end

  def render_keyword_picker
    content_tag(:div, class: 'eui-nested-item-picker') do
      concat(content_tag(:ul, class: 'eui-item-path') do
        content_tag(:li, link_to('Science Keyword', 'javascript:void(0);'), class: 'list-title')
      end)

      concat(content_tag(:div, class: 'eui-item-list-pane') do
        content_tag(:ul) do
          content_tag(:li) do
            text_field_tag('science-keyword-search', nil, name: nil, class: 'typeahead', placeholder: 'Search for keywords...')
          end
        end
      end)
    end
  end

  def render_boolean(element, schema, object, prefix: nil)
    content_tag(:section) do
      concat(content_tag(:p, class: 'radio-group') do
        concat radio_button_tag(keyify_property_name(element), 'TRUE', get_element_value(object, element['key']) == 'TRUE')

        concat label_tag "#{keyify_property_name(element)}_TRUE", 'True'
      end)
      concat(content_tag(:p, class: 'radio-group') do
        concat radio_button_tag(keyify_property_name(element), 'FALSE', get_element_value(object, element['key']) == 'FALSE')

        concat label_tag "#{keyify_property_name(element)}_FALSE", 'False'
      end)
    end
  end

  # def schema_required_fields(schema)
  #   schema.fetch('required', [])
  # end

  # Get the value for the provided key from the provided object
  # def get_element_value(object, key)
  #   # Uses reduce to dig through the provided object to look for and return the
  #   # provided key that could be nested
  #   element_path_for_object(key).reduce(object) { |a, e| a[e] }
  # rescue
  #   nil
  # end

  # Gets the keys that are relevant to the UMM object as an array from

  # a provided key e.g. 'Parent/items/properties/Field' => ['Parent', 'Field']
  # def element_path_for_object(key, ignore_keys: %w(items properties))
  #   (key.split('/') - ignore_keys)
  # end

  # def schema.retrieve_schema_fragment(element['key'])#   # Retreive the requested key from the schema
  #   property = key.split('/').reduce(schema['properties']) { |a, e| a.fetch(e, {}) }

  #   # Set the 'key' attribute within the property has so that we have reference to it
  #   property['key'] = key

  #   property
  # end

  # We use '/' as a separator in our key names for the purposes of looking them up
  # in the schema when nested. However, we often need just the actual key, which is
  # what this method does for us.
  # def fetch_key_leaf(provided_key)
  #   provided_key.split('/').last
  # end

  # We use '/' as a separator in our key names for the purposes of looking them up
  # in the schema when nested. This method translates that into ruby syntax to retrieve
  # a nested key in a hash e.g. 'object/first_key/leaf' => 'object[first_key][leaf]'
  # def keyify_property_name(element, ignore_keys: %w(items properties))
  #   element_path_for_object(element['key'], ignore_keys: ignore_keys).map.with_index { |key, index| index == 0 ? key.underscore : "[#{key.underscore}]" }.join
  # end

  # Fetch all the 'keys' in the provided section of the schema
  # def fetch_all_keys(schema, input)
  #   keys = []

  #   input['items'].each do |stuff|

  #     keys << stuff.deep_find('key')
  #   end

  #   # Hydrate each key with the data from the schema beacuse the origin
  #   # of this hash is the form layout json, so it lacks the meat of the key
  #   Array.wrap(keys).map { |element_key| schema.retrieve_schema_fragment(element['key'])  # end

  # Determines whether or not a form secion is complete and returns an
  # icon to represent the determinimation
  def umm_form_circle(schema, section, section_fields, object, _errors)
    # True until told otherwise
    valid = true

    unless object.empty? # && errors
      # page_errors = errors.select { |error| error[:page] == form_name }
      # error_fields = page_errors.map { |error| error[:top_field] }

      section_fields.each do |field|
        key_leaf = fetch_key_leaf(field['key'])

        # Ignore this field if it's not required valid
        next unless schema_required_fields(schema).include?(key_leaf) && get_element_value(object, field['key']).blank?

        # Field is required and has no value
        valid = false

        # We've determined this section is incomplete, no reason to further investigate
        break
      end
    end

    form_section_circle(section.fetch('title', 'no_title'), valid)
  end

  # Generate the circle icon for a form section
  def form_section_circle(section_title, valid)
    # Default classes
    classes = %w(eui-icon icon-green)

    # Add the class that will define the final appearance of the circle
    classes << if valid
                 # Valid, displays a checkmark
                 'eui-check'
               else
                 # Invalid/Empty, displays an empty circle
                 'eui-fa-circle-o'
               end

    # Generate the actual content tag to return to the view
    content_tag(:i, class: classes.join(' ')) do
      content_tag(:span, class: 'is-invisible') do
        if valid
          "#{section_title} is valid"
        else
          "#{section_title} is incomplete"
        end
      end
    end
  end
end
