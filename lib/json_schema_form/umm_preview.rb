# :nodoc:
class UmmPreview < JsonFile

  attr_accessor :data, :forms

  def initialize(schema_type:, preview_filename:, data: {})
    super(schema_type, preview_filename)

    @data = data
    @forms = parsed_json.fetch('forms', []).map { |form_json| UmmPreviewForm.new(form_json) }
  end
end

class UmmPreviewForm < UmmPreview
  include ActionView::Context
  include ActionView::Helpers::FormTagHelper
  include ActionView::Helpers::TagHelper
  include ActionView::Helpers::TextHelper
  include Rails.application.routes.url_helpers

  def initialize(form_json)
    #code
  end

  def render
    forms.each do |form|
      content_tag(:section, class: "umm-preview #{form['id']}") do
        render_preview_accordion
      end
    end
  end

  def render_preview_accordion
    content_tag(:div, class: "preview-#{schema_type} eui-accordion") do
      concat render_preview_accordion_header
      concat render_preview_accordion_body
    end
  end

  def render_preview_accordion_header
    content_tag(:div, class: 'eui-accordion__header') do
      concat(content_tag(:h4, class: 'eui-accordion__title') do
        form.title
      end)

      concat(content_tag(:div, class: 'eui-accordion__icon') do
        concat content_tag(:i, nil, class: 'eui-icon eui-fa-chevron-circle-down')
        concat content_tag(:span, "Toggle #{form.title}", class: 'eui-sr-only')
      end)
    end
  end

  def render_preview_accordion_body
    content_tag(:div, class: 'eui-accordion__body') do
      fields_to_display.each do |field_name|
        concat render_field_preview(field_name)
      end
    end
  end

  # doing it this way I have no way of know when a field needs something special, like service keywords, or fancy things like cards later for RelatedURL/ServiceOrganizations

  # would a new config file be something to look at?
    # it only needs to describe the top field, not every field possible like the form config
      # to display a related url, do ...
      # to display a service keyword, do ...
    # easy to parse to display fields or hide fields, if the field isn't in the config, don't worry about it. easy to show/hide based on more than just required fields
    # easy to know not to dig into nested fields
    # feels like it goes along with what Jason was trying to tell me


    # it would be another file to have to update for schema changes



  def render_field_preview(field_name)
    content_tag(:div, class: 'umm-preview-field-container', id: "_preview") do
    # content_tag(:div, class: 'umm-preview-field-container', id: "#{form.idify_property_name}_preview") do
      # Determine the class to use fo rendering this element
      # element_class = form_fragment.fetch('type', 'UmmTextField')
      # form_element = element_class.constantize.new(form_section_json: form_fragment, json_form: json_form, schema: schema, options: options, key: full_key, field_value: field_value)

      concat(content_tag(:h5) do
        concat field_name.titleize unless form.full_key.ends_with?('index_id')

        # concat(link_to("/#{form.resource_name.pluralize}/#{form.options[:draft_id]}/edit/#{form.options[:form_id]}##{form.idify_property_name}", class: 'hash-link') do
        #   concat content_tag(:i, nil, class: 'fa fa-edit')
        #   concat content_tag(:span, "Edit #{form.title}", class: 'is-invisible')
        # end)
      end)
      puts "data: #{data}"
      if data.key? field_name
        concat content_tag(:p, data[field_name])
      else
        concat content_tag(:p, "No value for #{field_name.titleize} provided.", class: 'empty-section')
      end
    end
  end
end
