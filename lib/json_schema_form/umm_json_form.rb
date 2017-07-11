# Subclass of JsonFile that accepts a filename that represents a UMM form layout
class UmmJsonForm < JsonFile
  # The UmmJsonSchema object this layout is representing
  attr_accessor :schema

  # The object that will populate the elements of form displayed
  attr_accessor :object

  # Options hash for providing arbitrary values to the form
  attr_accessor :options

  def initialize(form_filename, schema, object, options = {})
    super(form_filename)

    @schema = schema
    @object = object
    @options = options
  end

  # Retrieve all the forms from the json file
  def forms
    @forms ||= parsed_json.fetch('forms', []).map { |form_json| UmmForm.new(form_json, self, schema, options) }
  end

  # Retrieve a form from the json file by the id
  #
  # ==== Attributes
  #
  # * +id+ - The id of the form to retrieve from +parsed_json+
  def get_form(id)
    forms.find { |form| form['id'] == id }
  end

  # Retrieve the index of the provided form id
  #
  # ==== Attributes
  #
  # * +id+ - The id of the form to retrieve the id from +parsed_json+
  def get_form_index(id)
    forms.index { |form| form['id'] == id }
  end

  # Return the form that appears after the provided id
  #
  # ==== Attributes
  #
  # * +id+ - The id of the form in which you'd like the form that follows (by index)
  def next_form(id)
    next_index = get_form_index(id) + 1

    forms[(next_index > (forms.size - 1)) ? 0 : next_index]
  end

  # Return the form that appears before the provided id
  #
  # ==== Attributes
  #
  # * +id+ - The id of the form in which you'd like the form that preceeds (by index)
  def previous_form(id)
    previous_index = get_form_index(id) - 1

    forms[(previous_index < 0) ? (forms.size - 1) : previous_index]
  end
end
