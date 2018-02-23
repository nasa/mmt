# :nodoc:
class UmmPreview < JsonFile
  include ActionView::Context
  include ActionView::Helpers::FormTagHelper
  include ActionView::Helpers::TagHelper
  include ActionView::Helpers::TextHelper
  include Rails.application.routes.url_helpers

  attr_accessor :data, :forms

  def initialize(schema_type:, preview_filename:, data: {})
    super(schema_type, preview_filename)

    @data = data
    @forms = parsed_json.fetch('forms', []).map { |form_json| UmmPreviewForm.new(schema_type: schema_type, form_json: form_json, data: data) }
  end
end

# :nodoc:
class UmmPreviewForm < UmmPreview
  attr_accessor :form

  def initialize(schema_type:, form_json:, data:)
    @schema_type = schema_type
    @form = form_json
    @data = data.draft
  end

  def title
    form['title']
  end

  def form_id
    form['id']
  end

  def fields
    form['fields']
  end

  def render
    content_tag(:section, class: "umm-preview #{form_id}") do
      render_preview_accordion
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
      fields.each do |field|
        concat render_field_preview(field)
      end
    end
  end

  def render_field_preview(field)
    content_tag(:div, class: 'umm-preview-field-container', id: "_preview") do
    # content_tag(:div, class: 'umm-preview-field-container', id: "#{form.idify_property_name}_preview") do
      # Determine the class to use fo rendering this element
      # element_class = form_fragment.fetch('type', 'UmmTextField')
      # form_element = element_class.constantize.new(form_section_json: form_fragment, json_form: json_form, schema: schema, options: options, key: full_key, field_value: field_value)

      concat(content_tag(:h5) do
        concat field['key'].titleize #unless form.full_key.ends_with?('index_id')

        # TODO add edit link
        # concat(link_to("/#{form.resource_name.pluralize}/#{form.options[:draft_id]}/edit/#{form.options[:form_id]}##{form.idify_property_name}", class: 'hash-link') do
        #   concat content_tag(:i, nil, class: 'fa fa-edit')
        #   concat content_tag(:span, "Edit #{title}", class: 'is-invisible')
        # end)
      end)

      puts "data: #{data}"
      if data.key? field['key']
        if field['type']
          concat field['type'].constantize.new(data[field['key']]).render
        else
          concat content_tag(:p, data[field['key']])
        end
      else
        concat content_tag(:p, "No value for #{field['key'].titleize} provided.", class: 'empty-section')
      end
    end
  end
end
