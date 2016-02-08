module FormHelper
  def mmt_text_field(options)
    options[:name] = add_pipes(options[:name])

    classes = ['full-width']
    classes << 'validate' if options[:validate]
    classes << options[:classes]

    text_field_html = text_field_tag(
      name_to_param(options[:prefix] + options[:name]),
      options[:value],
      class: classes.join(' '),
      data: { level: remove_pipes(options[:prefix]) }
    )

    mmt_label(options) + mmt_help_icon(options) + text_field_html
  end

  def mmt_text_area(options)
    options[:name] = add_pipes(options[:name])

    classes = []
    classes << 'validate' if options[:validate]
    classes << options[:classes]

    text_area_html = text_area_tag(
      name_to_param(options[:prefix] + options[:name]),
      options[:value],
      rows: 8,
      class: classes.join(' '),
      data: { level: remove_pipes(options[:prefix]) }
    )

    mmt_label(options) + mmt_help_icon(options) + text_area_html
  end

  def mmt_select(options)
    options[:name] = add_pipes(options[:name])

    classes = ["half-width #{remove_pipes(options[:name])}-select"]
    classes << options[:classes]

    # default values when not multi-select
    is_multi_select = false
    prompt = "Select #{options[:title]}"
    size = nil

    is_multi_select = true if options[:multiple]

    if is_multi_select
      prompt = nil
      size = 4
    end

    select_html = select_tag(
      name_to_param(options[:prefix] + options[:name]),
      options_for_select(options[:options], options[:value]),
      multiple: is_multi_select,
      size: size,
      class: classes,
      prompt: prompt,
      data: { level: remove_pipes(options[:prefix]) }
    )

    mmt_label(options) + mmt_help_icon(options) + select_html
  end

  def mmt_datetime(options)
    options[:name] = add_pipes(options[:name])

    classes = ['full-width']
    classes << 'validate' if options[:validate]
    classes << options[:classes]

    datetime_html = datetime_field_tag(
      name_to_param(options[:prefix] + options[:name]),
      options[:value],
      class: classes.join(' '),
      data: { level: remove_pipes(options[:prefix]) }
    )

    mmt_label(options) + mmt_help_icon(options) + datetime_html
  end

  def mmt_number(options)
    options[:name] = add_pipes(options[:name])

    classes = []
    classes << 'validate' if options[:validate]
    classes << options[:classes]

    number_html = number_field_tag(
      name_to_param(options[:prefix] + options[:name]),
      options[:value],
      class: classes.join(' '),
      data: { level: remove_pipes(options[:prefix]) }
    )

    mmt_label(options) + mmt_help_icon(options) + number_html
  end

  def mmt_label(options)
    options[:name] = add_pipes(options[:name])
    id = remove_pipes(options[:prefix] + options[:name]) if options[:set_id]
    label_for = id.nil? ? remove_pipes(options[:prefix] + options[:name]) : nil

    classes = []
    classes << 'required' if options[:required]
    classes << 'always-required icon-required' if options[:always_required]
    label_tag(
      label_for,
      options[:title],
      class: classes,
      id: id
    )
  end

  def mmt_help_icon(options)
    return unless options[:help]
    link_to('#help-modal', class: 'display-modal', tabindex: -1) do
      "<i class=\"ed-icon ed-fa-info-circle\" data-help-path=\"#{options[:help]}\"></i><span class=\"is-hidden\">Help modal for #{options[:title]}</span>".html_safe
    end
  end

  def add_pipes(name)
    "|#{name}|"
  end

  def hidden_metadata_date_fields(metadata)
    dates = metadata['MetadataDates']
    if dates && dates.any? { |date| date['Type'] == 'CREATE' }
      create_type = hidden_field_tag('draft[metadata_dates][-2][type]',
        get_metadata_create_date(metadata)['Type'])
      create_datetime = hidden_field_tag('draft[metadata_dates][-2][date]',
        get_metadata_create_date(metadata)['Date'])
      update_type = hidden_field_tag('draft[metadata_dates][-1][type]',
        get_metadata_update_date(metadata)['Type'])
      update_datetime = hidden_field_tag('draft[metadata_dates][-1][date]',
        get_metadata_update_date(metadata)['Date'])

      create_type + create_datetime + update_type + update_datetime
    end
  end
end
