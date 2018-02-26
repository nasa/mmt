# :nodoc:
class UmmForm < JsonObj
  include ActionView::Context
  include ActionView::Helpers::FormTagHelper
  include ActionView::Helpers::TagHelper
  include ActionView::Helpers::TextHelper
  include Rails.application.routes.url_helpers

  attr_accessor :form_section_json, :json_form, :schema, :title, :subtitle, :description, :children, :options, :full_key, :field_value

  def initialize(form_section_json: {}, json_form: {}, schema: {}, options: {}, key: '', field_value: {})
    super(form_section_json)

    @json_form = json_form
    @schema = schema
    @options = options
    @options = @options.merge(form_id: parsed_json['id']) if parsed_json['id']
    @field_value = field_value

    @full_key = build_key(form_section_json, key)

    @title = @parsed_json['title']
    @subtitle = @parsed_json['subtitle']
    @description = @schema.retrieve_schema_fragment(@parsed_json['description_key']).fetch('description', @parsed_json['description'])

    @children = parsed_json.fetch('items', []).map do |value|
      # TODO: Determine a more dynamic way of instantiating these
      # objects using the type or another aspect of the json
      if value['type'] == 'section'
        UmmFormSection.new(form_section_json: value, json_form: json_form, schema: schema, options: @options, key: full_key, field_value: field_value)
      elsif value['type'] == 'fieldset'
        UmmFormFieldSet.new(form_section_json: value, json_form: json_form, schema: schema, options: @options, key: full_key, field_value: field_value)
      elsif value['type'] == 'accordion'
        UmmFormAccordion.new(form_section_json: value, json_form: json_form, schema: schema, options: @options, key: full_key, field_value: field_value)
      elsif value['type'] == 'open_accordion'
        UmmFormOpenAccordion.new(form_section_json: value, json_form: json_form, schema: schema, options: @options, key: full_key, field_value: field_value)
      else
        UmmFormElement.new(form_section_json: value, json_form: json_form, schema: schema, options: @options, key: full_key, field_value: field_value)
      end
    end
  end

  def build_key(fragment, key)
    value = key
    value += fragment['key'] if fragment['key'] && !value.ends_with?(fragment['key'])

    value
  end

  def top_key
    value = full_key.split('/').first
    value = full_key.split('/')[1] if value.blank?
    value
  end

  def resource_name
    options.fetch(:field_prefix, '').split('/').first
  end

  def umm_type
    resource_name.split('_').first
  end

  # Override default inspect for a more concise representation of the object
  def inspect
    "#<UmmForm title: \"#{title}\" description: \"#{description}\">"
  end

  # Return this form element for display within a form
  def render_markup
    hidden = 'display: none;' if parsed_json['hideUnlessValues'] && element_value && !element_value.key?(parsed_json['hideUnlessValues'])

    content_tag(:div, class: parsed_json['htmlClass'], style: hidden) do
      # Display a description of the section if its provided
      concat content_tag(:p, description, class: 'form-description space-bot') unless description.nil?

      if parsed_json['label']
        label_text = parsed_json['label']
        concat label_tag('', label_text, class: ('eui-required-o' if schema.required_field?(full_key)))

        # Adds the help modal link and icon
        concat help_icon(help_path)
      end

      # Continue rendering fields that appear in this section
      children.each do |child_element|
        concat child_element.render_markup
      end
    end
  end

  def render_preview
    content_tag(:section, class: "umm-preview #{parsed_json['id']}") do
      render_preview_accordion
    end
  end

  def render_preview_accordion
    content_tag(:div, class: "preview-#{umm_type} eui-accordion") do
      concat render_preview_accordion_header
      concat render_preview_accordion_body
    end
  end

  def render_preview_accordion_header
    content_tag(:div, class: 'eui-accordion__header') do
      concat(content_tag(:h4, class: 'eui-accordion__title') do
        title
      end)

      concat(content_tag(:div, class: 'eui-accordion__icon') do
        concat content_tag(:i, nil, class: 'eui-icon eui-fa-chevron-circle-down')
        concat content_tag(:span, "Toggle #{title}", class: 'eui-sr-only')
      end)
    end
  end

  def render_preview_accordion_body
    content_tag(:div, class: 'eui-accordion__body') do
      children.each do |child_element|
        concat child_element.render_preview
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
  def elements(json_fragment: nil, fields: [], key: '')
    fragment = (json_fragment || parsed_json)

    key = build_key(fragment, key)

    if fragment.key?('field')
      element_class = fragment.fetch('type', 'UmmTextField')
      form_element = element_class.constantize.new(form_section_json: fragment, json_form: json_form, schema: schema, options: options, key: key, field_value: field_value)

      fields << form_element

      # As soon as we find the 'key' element we want to stop digging because if we
      # go any further we'll also display each individual field within an array field
      return
    end

    fragment.each_value do |element|
      next unless element.is_a?(Enumerable)

      if element.is_a?(Array)
        element.map { |array_element| elements(json_fragment: array_element, fields: fields, key: key) }
      else
        elements(json_fragment: element, fields: fields, key: key)
      end
    end

    fields
  end

  def top_elements(json_fragment: nil, fields: [])
    fragment = (json_fragment || parsed_json)

    if fragment.key?('key')
      # puts "fragment['key']: #{fragment['key']}"
      new_field = UmmFormElement.new(form_section_json: fragment, json_form: json_form, schema: schema, options: options, key: fragment['key'], field_value: field_value)
      fields << new_field unless fields.select { |f| f.top_key == new_field.top_key }.size > 0

      # As soon as we find the 'key' element we want to stop digging because if we
      # go any further we'll also display each individual field within an array field
      return
    end

    fragment.each_value do |element|
      next unless element.is_a?(Enumerable)

      if element.is_a?(Array)
        element.map { |array_element| top_elements(json_fragment: array_element, fields: fields) }
      else
        top_elements(json_fragment: element, fields: fields)
      end
    end

    fields
  end

  # Determines whether or not a form section is complete and returns an
  # icon to represent the determinimation
  def form_circle
    # True until told otherwise
    valid = true

    top_elements.each do |field|
      # Ignore this field if it's not required to be valid
      next unless json_form.invalid?(field['key'], ignore_required_fields: false) || (schema.required_field?(field['key']) && !field.value?)

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
    key = parsed_json['help']
    key ||= full_key
    path = json_form.element_path_for_object(key, ignore_keys: %w(index_id))

    # Remove "/items/properties" if the path ends with it
    path.pop if path.last == 'properties'
    path.pop if path.last == 'items'
    "properties/#{path.join('/')}"
  end

  # Get the value for the provided key from the provided object
  def element_value
    # Uses reduce to dig through the provided object to look for and return the
    # provided key that could be nested
    path = json_form.element_path_for_object(full_key, ignore_keys: %w(items properties))
    path.pop if path.last == 'index_id'

    # If an index is provided, insert it into the path
    unless options['index'].nil?
      if path.size == 1
        path << options['index']
      else
        path.insert(path.size - 1, options['index'])
      end
    end
    if options['indexes']
      if path.index('index_id')
        Array.wrap(options['indexes']).each do |index|
          path[path.index('index_id')] = index
        end
      end
    end

    # Look up the value in the object at the specified path
    path.reduce(json_form.object) { |a, e| a[e] }
  rescue
    nil
  end

  # Get the value to display for text fields and text areas
  def text_value
    if full_key.ends_with?('index_id')
      field_value
    elsif full_key.index('index_id')
      path = json_form.element_path_for_object(full_key.split('index_id/').last)
      v = path.reduce(field_value) { |a, e| a.fetch(e, {}) }
      # empty fields sometimes show up as {},
      # when we really want them to be ''
      v == {} ? '' : v
    else
      element_value
    end
  end

  # Return whether or not this element has a stored value
  def value?
    !element_value.nil? && element_value != '' && element_value != {}
  end

  def accordion_id
    top_key.nil? ? parsed_json.fetch('title', '').gsub(/( )/, '-').downcase : top_key.underscore.dasherize
  end

  def required?
    schema.required_field?(full_key)
  end

  def expandable?
    parsed_json['expandable']
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

      # Display a subtitle for the section if its provided
      concat content_tag(:h4, subtitle, class: 'space-bot') unless subtitle.nil?

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
class UmmFormAccordion < UmmForm
  def render_markup
    content_tag(:fieldset, class: "eui-accordion is-closed #{parsed_json['htmlClass']}", id: accordion_id) do
      concat render_accordion_header
      concat render_accordion_body
    end
  end

  def render_accordion_header
    content_tag(:div, class: 'eui-accordion__header') do
      concat(content_tag(:div, class: 'eui-accordion__icon', tabindex: '0') do
        concat content_tag(:i, '', class: 'eui-icon eui-fa-chevron-circle-down')
        concat content_tag(:span, "Toggle #{title}", class: 'eui-sr-only')
      end)

      concat content_tag(:h3, title, class: 'header-title')
      concat help_icon(help_path)
    end
  end

  def render_accordion_body
    content_tag(:div, class: 'eui-accordion__body') do
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
class UmmFormOpenAccordion < UmmFormAccordion
  def render_markup
    content_tag(:fieldset, class: "eui-accordion #{parsed_json['htmlClass']}", id: accordion_id) do
      concat render_accordion_header
      concat render_accordion_body
    end
  end

  def render_accordion_header
    content_tag(:div, class: 'eui-accordion__header disable-toggle') do
      concat content_tag(:h3, title, class: 'header-title')
      concat help_icon(help_path) unless parsed_json['noHelp']
    end
  end
end

# :nodoc:
class UmmFormElement < UmmForm
  def default_value
    nil
  end

  # We use '/' as a separator in our key names for the purposes of looking them up
  # in the schema when nested. This method translates that into ruby syntax to retrieve
  # a nested key in a hash e.g. 'object/first_key/leaf' => 'object[first_key][leaf]'
  def keyify_property_name(ignore_keys: %w(items properties index_id))
    provided_key = [json_form.options[:field_prefix], full_key].compact.reject(&:empty?).join('/')

    if options['indexes']
      split_key = provided_key.split('/')
      if split_key.index('index_id')
        Array.wrap(options['indexes']).each do |index|
          split_key[split_key.index('index_id')] = index
        end
      end
      provided_key = split_key.join('/')
    end
    provided_key.gsub!('index_id', options['index'].to_s) if options['index']

    json_form.element_path_for_object(provided_key, ignore_keys: ignore_keys).map.with_index { |key, index| index.zero? ? key.underscore : "[#{key.underscore}]" }.join
  end

  def idify_property_name(ignore_keys: %w(items properties index_id))
    sanitize_to_id(keyify_property_name(ignore_keys: ignore_keys))
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

    # Add classes listed in *-form.json
    classes << " #{parsed_json['htmlClass']}" if parsed_json['htmlClass']

    classes
  end

  def element_data(_element)
    options['data']
  end

  def element_properties(element)
    readonly = parsed_json['readonly'].nil? ? {} : { readonly: true }

    {
      class: element_classes(element),
      data: element_data(element)
    }
      .merge(readonly)
      .merge(validation_properties(element))
  end

  # Locates the fragment of the schema that the provided key represents
  def schema_fragment
    schema.retrieve_schema_fragment(json_form.element_path_for_object(full_key, ignore_keys: %w(index_id)).join('/'))
  end

  # Returns the fragment of the form json that represents this element
  def form_fragment
    parsed_json
  end

  # The value displayed on the form and within the preview that best represents the title of this element
  def title
    return @title if @title

    # The correct title for a UmmMultiItems is saved under label
    return parsed_json['label'] if parsed_json['type'] == 'UmmMultiItems'

    value = schema.fetch_key_leaf(full_key)

    if value.ends_with?('ID')
      value.titleize + ' ID'
    else
      value.titleize
    end
  end

  # Return this form element for display within a form
  def render_markup
    capture do
      # Determine the class to use fo rendering this element
      element_class = form_fragment.fetch('type', 'UmmTextField')
      form_element = element_class.constantize.new(form_section_json: form_fragment, json_form: json_form, schema: schema, options: options, key: full_key, field_value: field_value)

      # Adds a label to the container holding the element
      unless form_fragment['noLabel']
        label_text = form_element.title
        label_text = parsed_json['label'] if parsed_json['label']
        concat label_tag(keyify_property_name, label_text, class: ('eui-required-o' if schema.required_field?(full_key)))

        # Adds the help modal link and icon
        concat help_icon(help_path)
      end

      concat form_element.render_markup
    end
  end

  # Renders a user friendly version of the value(s) stored within this element
  def render_preview
    content_tag(:div, class: 'umm-preview-field-container', id: "#{idify_property_name}_preview") do
      # Determine the class to use fo rendering this element
      element_class = form_fragment.fetch('type', 'UmmTextField')
      form_element = element_class.constantize.new(form_section_json: form_fragment, json_form: json_form, schema: schema, options: options, key: full_key, field_value: field_value)

      concat(content_tag(:h5) do
        concat title

        if options[:draft_id]
          concat(link_to("/#{resource_name.pluralize}/#{options[:draft_id]}/edit/#{options[:form_id]}##{idify_property_name}", class: 'hash-link') do
            concat content_tag(:i, nil, class: 'fa fa-edit')
            concat content_tag(:span, "Edit #{title}", class: 'is-invisible')
          end)
        end
      end)

      if form_element.value?
        concat form_element.render_preview
      else
        concat content_tag(:p, "No value for #{title} provided.", class: 'empty-section')
      end
    end
  end
end
