# :nodoc:
class UmmJsonForm < JsonFile
  attr_accessor :schema, :object, :options

  def initialize(form_filename, schema, object, options = {})
    super(form_filename)

    @schema = schema
    @object = object
    @options = options
  end

  def forms
    parsed_json.fetch('forms', []).map do |umm_form_section|
      if umm_form_section['type'] == 'section'
        UmmFormSection.new(umm_form_section, self, schema)
      elsif umm_form_section['type'] == 'fieldset'
        UmmFormFieldSet.new(umm_form_section, self, schema)
      else
        UmmFormElement.new(umm_form_section, self, schema)
      end
    end
  end
end

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
    @description = @parsed_json['description']

    @children = parsed_json.fetch('items', []).map do |value|
      # TODO: Determine a more dynamic way of instantiating these
      # classes using the type or another aspect of the json
      if value['type'] == 'section'
        UmmFormSection.new(value, json_form, schema, options)
      elsif value['type'] == 'fieldset'
        UmmFormFieldSet.new(value, json_form, schema, options)
      else
        UmmFormElement.new(value, json_form, schema, options)
      end
    end
  end

  def render_markup
    children.map(&:render_markup)
  end
end

# :nodoc:
class UmmFormSection < UmmForm
  def render_markup
    content_tag(:div, class: parsed_json['htmlClass']) do
      # Display a title for the section if its provided
      concat content_tag(:h4, title, class: 'space-bot') unless title.nil?

      # Display a description of the section if its provided
      concat content_tag(:p, description, class: 'form-description space-bot') unless description.nil?

      # Continue rendering fields that appear in this section
      children.each do |child_element|
        concat child_element.render_markup
      end
    end
  end
end

# :nodoc:
class UmmFormFieldSet < UmmForm
  def render_markup
    content_tag(:fieldset, class: parsed_json['htmlClass']) do
      # Display a title for the section if its provided
      concat content_tag(:h4, title, class: 'space-bot') unless title.nil?

      # Display a description of the section if its provided
      concat content_tag(:p, description, class: 'form-description space-bot') unless description.nil?

      # Continue rendering fields that appear in this section
      children.each do |child_element|
        concat child_element.render_markup
      end
    end
  end
end

# :nodoc:
class UmmFormElement < UmmForm
  # Get the value for the provided key from the provided object
  def get_element_value(key)
    # Uses reduce to dig through the provided object to look for and return the
    # provided key that could be nested
    element_path_for_object(key).reduce(json_form.object) { |a, e| a[e] }
  rescue
    nil
  end

  # We use '/' as a separator in our key names for the purposes of looking them up
  # in the schema when nested. This method translates that into ruby syntax to retrieve
  # a nested key in a hash e.g. 'object/first_key/leaf' => 'object[first_key][leaf]'
  def keyify_property_name(element, ignore_keys: %w(items properties index_id))
    provided_key = [json_form.options['field_prefix'], element['key']].reject { |c| c.empty? }.join('/')

    provided_key.gsub!('index_id', options[:index].to_s) if options[:index]

    element_path_for_object(provided_key, ignore_keys: ignore_keys).map.with_index { |key, index| index == 0 ? key.underscore : "[#{key.underscore}]" }.join
  end

  # Gets the keys that are relevant to the UMM object as an array from
  # a provided key e.g. 'Parent/items/properties/Field' => ['Parent', 'Field']
  def element_path_for_object(key, ignore_keys: %w(items properties index_id))
    (key.split('/') - ignore_keys)
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
        'msg-required': "#{element['key'].titleize} is required."
      }
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

  def element_properties(element)
    {
      class: element_classes(element)
    }.merge(validation_properties(element))
  end

  # Locates the fragment of the schema that the provided key represents
  def schema_fragment
    schema.retrieve_schema_fragment(parsed_json['key'])
  end

  # Returns the fragment of the form json that represents this element
  def form_fragment
    parsed_json
  end

  def help_icon(path, title)
    link_to('#help-modal', class: 'display-modal') do
      concat content_tag(:i, nil, class: 'eui-icon eui-fa-info-circle', data: { 'help-path': path })
      concat content_tag(:span, "Help modal for #{title}", class: 'is-invisible')
    end
  end

  def render_markup
    capture do
      # Adds a label to the container holding the element
      concat UmmLabel.new(form_fragment, json_form, schema, options).render_markup

      # Adds the help modal link and icon
      concat help_icon("properties/#{form_fragment['key']}", form_fragment['key'].split('/').last.titleize)

      # Determine the class to use fo rendering this element
      element_class = form_fragment.fetch('type', 'UmmTextField')
      form_element = element_class.constantize.new(form_fragment, json_form, schema, options)

      concat form_element.render_markup
    end
  end
end
