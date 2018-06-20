# :nodoc:
class UmmPreviewForm < UmmPreview
  attr_accessor :form_json, :full_key, :key, :options

  # schema_type:  published_resource_name (service/variable)
  # form_json:    json from a 'form' field in the preview json (umm-s-preview.json)
  # data:         metadata
  # key:          'key' of the current field object
  # draft_id:     id of the draft being displayed, not used for published records
  # options:      used mostly to pass the indexes option
  # full_key:     describes path through the metadata to get to what field describes
  def initialize(schema_type:, form_json:, data:, key: '', draft_id: nil, options: {})
    @schema_type = schema_type
    @form_json = form_json
    @data = data
    @key = key
    @draft_id = draft_id
    @options = options

    @full_key = build_key(form_json, key)
  end

  # Helpers to pull data out of the *-preview.json file
  def title
    form_json['title']
  end

  def form_id
    @form_id ||= form_json['id']
  end

  def fields
    form_json['fields']
  end

  def build_key(form_json, key)
    key += form_json['key'] if form_json['key'] && !key.ends_with?(form_json['key'])
    key
  end

  # Renders an accordion for the preview section, based on fields like in the *-preview.json file
  def render
    content_tag(:section, class: "umm-preview #{form_id}") do
      render_preview_accordion
    end
  end

  def render_preview_accordion
    content_tag(:div, class: "preview-#{schema_type.pluralize} eui-accordion") do
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
        concat UmmPreviewField.new(schema_type: schema_type, form_json: field, data: data, form_id: form_id, key: key, draft_id: draft_id, options: options).render
      end
    end
  end

  def render_sidebar
    content_tag(:section, class: "umm-preview #{form_id}") do
      concat(content_tag(:h4, class: 'umm-preview-sidebar-title') do
        title
      end)

      fields.each do |field|
        concat UmmPreviewField.new(schema_type: schema_type, form_json: field, data: data, form_id: form_id, key: full_key, draft_id: draft_id, options: options).render
      end
    end
  end

  def replace_indexes(untreated_path)
    # when we have index_id in the key (for UmmPreviewMultiItems), replace the index_id with the actual index
    path = untreated_path.split('/')
    path.pop if path.last == 'index_id'
    if options['indexes'] && path.index('index_id')
      Array.wrap(options['indexes']).each do |index|
        path[path.index('index_id')] = index
      end
    end
    path
  end

  def idify_property_name(name)
    path = replace_indexes(name).join('_')
    draft = !draft_id.nil?
    output = "#{schema_type}#{'_draft_draft' if draft}_#{underscore_fix_for_related_urls(path)}"
    output
  end

  def field_title(field)
    field['title'] || last_field_key(field).titleize
  end

  def last_field_key(field)
    keys = field['key'].split('/')
    keys.pop if keys.last == 'index_id'
    keys.last
  end

  def element_value
    # grab the value of the metadata element from the full metadata by using the current full_key and reduce
    replace_indexes(full_key).reduce(data) { |a, e| a.fetch(e, {}) }
  end
end
