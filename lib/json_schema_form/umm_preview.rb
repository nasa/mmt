# :nodoc:
class UmmPreview < JsonFile
  attr_accessor :resource, :forms

  def initialize(schema_type:, preview_filename:, resource:)
    super(schema_type, preview_filename)

    # loop through the preview json file and create a new UmmPreviewForm
    # for each form
    @forms = parsed_json.fetch('forms', []).map { |form_json| UmmPreviewForm.new(schema_type: schema_type, form_json: form_json, resource: resource) }
  end
end

# :nodoc:
class UmmPreviewForm < UmmPreview
  include ActionView::Context
  include ActionView::Helpers::FormTagHelper
  include ActionView::Helpers::TagHelper
  include ActionView::Helpers::TextHelper
  include Rails.application.routes.url_helpers

  attr_accessor :form, :data

  def initialize(schema_type:, form_json:, resource:)
    @schema_type = schema_type
    @form = form_json
    @resource = resource
    @data = resource.draft
  end

  # Helpers to pull data out of the *-preview.json file
  def title
    form['title']
  end

  def form_id
    form['id']
  end

  def fields
    form['fields']
  end

  # Renders an accordion for the preview form, based on fields like in the *-preview.json file
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

  # display a title and value for the field
  # if the preview is for a draft, display a link to edit the field
  def render_field_preview(field)
    content_tag(:div, class: 'umm-preview-field-container preview', id: "#{idify_property_name(field['key'])}_preview") do
      concat(content_tag(:h5) do
        concat field['key'].titleize

        if resource_name.ends_with? '_draft'
          concat(link_to("/#{resource_name.pluralize}/#{resource.id}/edit/#{form_id}##{idify_property_name(field['key'])}", class: 'hash-link') do
            concat content_tag(:i, nil, class: 'fa fa-edit')
            concat content_tag(:span, "Edit #{title}", class: 'is-invisible')
          end)
        end
      end)

      if data.key? field['key']
        type = field.fetch('type', 'UmmPreviewText')
        concat type.constantize.new(data[field['key']]).render
      else
        concat content_tag(:p, "No value for #{field['key'].titleize} provided.", class: 'empty-section')
      end
    end
  end

  def resource_name
    resource.class.name.underscore
  end

  def idify_property_name(name)
    "#{resource_name}_draft_#{name.underscore}"
  end
end
