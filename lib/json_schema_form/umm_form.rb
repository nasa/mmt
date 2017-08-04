# :nodoc:
class UmmForm < JsonObj
  include ActionView::Context
  include ActionView::Helpers::FormTagHelper
  include ActionView::Helpers::TagHelper
  include ActionView::Helpers::TextHelper

  attr_accessor :form_section_json, :json_form, :schema, :title, :description, :children, :options

  def initialize(form_section_json, json_form, schema, options = {})
    super(form_section_json)

    @json_form = json_form
    @schema = schema
    @options = options

    @title = @parsed_json['title']
    @description = @schema.retrieve_schema_fragment(@parsed_json['description_key']).fetch('description', @parsed_json['description'])

    @children = parsed_json.fetch('items', []).map do |value|
      # TODO: Determine a more dynamic way of instantiating these
      # objects using the type or another aspect of the json
      if value['type'] == 'section'
        UmmFormSection.new(value, json_form, schema, options)
      elsif value['type'] == 'fieldset'
        UmmFormFieldSet.new(value, json_form, schema, options)
      else
        UmmFormElement.new(value, json_form, schema, options)
      end
    end
  end

  # Override default inspect for a more concise representation of the object
  def inspect
    "#<UmmForm title: \"#{title}\" description: \"#{description}\">"
  end

  # Return this form element for display within a form
  def render_markup
    content_tag(:div, class: parsed_json['htmlClass']) do
      # Display a title for the section if its provided
      concat content_tag(:h3, title, class: 'space-bot') unless title.nil?

      # Display a description of the section if its provided
      concat content_tag(:p, description, class: 'form-description space-bot') unless description.nil?

      # Continue rendering fields that appear in this section
      children.each do |child_element|
        concat child_element.render_markup
      end
    end
  end

  # Return the form that appears before this one
  def previous_form
    json_form.previous_form(parsed_json['id'])
  end

  # Return the form that appears after this one
  def next_form
    json_form.next_form(parsed_json['id'])
  end

  # Retreive a list of all the UmmFormElement's from within this form
  def elements(json_fragment: nil, fields: [])
    fragment = (json_fragment || parsed_json)

    if fragment.key?('key')
      element_class = fragment.fetch('type', 'UmmTextField')
      form_element = element_class.constantize.new(fragment, json_form, schema, options)

      fields << form_element

      # As soon as we find the 'key' element we want to stop digging because if we
      # go any further we'll also display each individual field within an array field
      return
    end

    fragment.each do |_key, element|
      next unless element.is_a?(Enumerable)

      if element.is_a?(Array)
        element.each do |array_element|
          elements(json_fragment: array_element, fields: fields)
        end
      else
        elements(json_fragment: element, fields: fields)
      end
    end

    fields
  end

  # Determines whether or not a form section is complete and returns an
  # icon to represent the determinimation
  def form_circle
    # True until told otherwise
    valid = true

    elements.each do |field|
      # Ignore this field if it's not required to be valid
      next unless json_form.invalid_keys(ignore_required_fields: false).include?(field['key']) || (schema.required_field?(field['key']) && !field.value?)

      # Field is required and has no value
      valid = false

      # We've determined this section is incomplete, no reason to further investigate
      break
    end

    render_status_icon(parsed_json.fetch('title', 'no_title'), valid)
  end

  # Generate the circle icon for a form
  def render_status_icon(section_title, valid)
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

# :nodoc:
class UmmFormSection < UmmForm
  def render_preview
    capture do
      children.each do |child_element|
        concat child_element.render_preview
      end
    end
  end
end

# :nodoc:
class UmmFormFieldSet < UmmForm
  def render_markup
    content_tag(:fieldset, class: parsed_json['htmlClass']) do
      # Display a title for the section if its provided
      concat content_tag(:h3, title, class: 'space-bot') unless title.nil?

      # Display a description of the section if its provided
      concat content_tag(:p, description, class: 'form-description space-bot') unless description.nil?

      # Continue rendering fields that appear in this section
      children.each do |child_element|
        concat child_element.render_markup
      end
    end
  end

  def render_preview
    capture do
      children.each do |child_element|
        concat child_element.render_preview
      end
    end
  end
end

# :nodoc:
class UmmFormElement < UmmForm
  # Get the value for the provided key from the provided object
  def element_value
    # Uses reduce to dig through the provided object to look for and return the
    # provided key that could be nested
    path = json_form.element_path_for_object(parsed_json['key'])

    # If an index is provided, insert it into the path
    path.insert(path.size - 1, options['index']) unless options['index'].nil?

    # Look up the value in the object at the specified path
    path.reduce(json_form.object) { |a, e| a[e] }
  rescue
    nil
  end

  # Return whether or not this element has a stored value
  def value?
    !element_value.nil? && element_value != ''
  end

  # We use '/' as a separator in our key names for the purposes of looking them up
  # in the schema when nested. This method translates that into ruby syntax to retrieve
  # a nested key in a hash e.g. 'object/first_key/leaf' => 'object[first_key][leaf]'
  def keyify_property_name(element, ignore_keys: %w(items properties index_id))
    provided_key = [json_form.options['field_prefix'], element['key']].compact.reject(&:empty?).join('/')

    provided_key.gsub!('index_id', options['index'].to_s) if options['index']

    json_form.element_path_for_object(provided_key, ignore_keys: ignore_keys).map.with_index { |key, index| index == 0 ? key.underscore : "[#{key.underscore}]" }.join
  end

  def idify_property_name(element, ignore_keys: %w(items properties index_id))
    sanitize_to_id(keyify_property_name(element, ignore_keys: ignore_keys))
  end

  # Returns all the properties necessary to operate jQuery Validation on the given element
  def validation_properties(element)
    # jQuery Validate can use html elements for validation so we'll set those elements
    # here instead of having to define these attributes on a one off basis in javascript
    validation_properties = element.select { |key| %w(minLength maxLength pattern).include?(key) }

    # JSON Schema provides the required fields in a separate array so we have to look this up
    if schema.required_field?(element['key'])
      validation_properties['required'] = true

      # jQuery validation supports custom messages via data attributes
      validation_properties['data'] = {
        'msg-required': "#{schema.fetch_key_leaf(element['key']).titleize} is required"
      }
    end

    if element['type'] == 'number'
      validation_properties['number'] = true

      validation_properties['data'] = validation_properties.fetch('data', {}).merge(
        'msg-number': "#{schema.fetch_key_leaf(element['key']).titleize} must be a number"
      )
    end

    validation_properties
  end

  def element_classes(property, initial_classes: nil)
    # Default classes
    classes = initial_classes || 'full-width'

    # Add textcounter to the UI if the element has a maxLength
    classes << ' textcounter' if property.key?('maxLength')

    classes
  end

  def element_data(_element)
    options['data']
  end

  def element_properties(element)
    {
      class: element_classes(element),
      data: element_data(element)
    }
      .merge(validation_properties(element))
  end

  # Locates the fragment of the schema that the provided key represents
  def schema_fragment
    schema.retrieve_schema_fragment(json_form.element_path_for_object(parsed_json['key'], ignore_keys: %w(index_id)).join('/'))
  end

  # Returns the fragment of the form json that represents this element
  def form_fragment
    parsed_json
  end
  
  # The value displayed on the form and within the preview that best represents the title of this element
  def title
    schema.fetch_key_leaf(form_fragment['key']).titleize
  end

  # Renders a clickable icon that provides information pertaining to the form element
  #
  # ==== Attributes
  #
  # * +path+ - The path to find the information for this element within the schema
  def help_icon(path)
    link_to('#help-modal', class: 'display-modal') do
      concat content_tag(:i, nil, class: 'eui-icon eui-fa-info-circle', data: { 'help-path': path })
      concat content_tag(:span, "Help modal for #{title}", class: 'is-invisible')
    end
  end

  # Path used to look this value up in the schema for the help modal
  def help_path
    "properties/#{json_form.element_path_for_object(form_fragment['key'], ignore_keys: %w(index_id)).join('/')}"
  end

  # Return this form element for display within a form
  def render_markup
    capture do
      # Determine the class to use fo rendering this element
      element_class = form_fragment.fetch('type', 'UmmTextField')
      form_element = element_class.constantize.new(form_fragment, json_form, schema, options)

      # Adds a label to the container holding the element
      concat label_tag(keyify_property_name(form_fragment), form_element.title, class: ('eui-required-o' if schema.required_field?(form_fragment['key'])))

      # Adds the help modal link and icon
      concat help_icon(help_path)

      concat form_element.render_markup
    end
  end

  # Renders a user friendly version of the value(s) stored within this element
  def render_preview
    content_tag(:div, id: "#{idify_property_name(form_fragment)}_preview") do
      # Determine the class to use fo rendering this element
      element_class = form_fragment.fetch('type', 'UmmTextField')
      form_element = element_class.constantize.new(form_fragment, json_form, schema, options)

      concat content_tag(:h5, title)

      if form_element.value?
        concat form_element.render_preview
      else
        concat content_tag(:p, "No value for #{schema.fetch_key_leaf(parsed_json['key']).titleize} provided.", class: 'empty-section')
      end
    end
  end
end
