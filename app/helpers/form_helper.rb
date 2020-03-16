module FormHelper
  def mmt_text_field(options)
    options[:name] = add_pipes(options[:name]) unless options[:name].include?('|')

    classes = ['full-width']
    classes << 'validate' if options[:validate]
    classes << options[:classes]

    # for data center contact person/groups in data contacts form, need to keep the data center information
    # at the same data-level and data-required-level as the contact person/ group, so the required fields
    # appear/disappear with the contact person/group information
    if options[:prefix] =~ /\|contact_person_data_center\|_$/ #== 'draft_|data_contacts|_|contact_person_data_center|_'
      data_level = remove_pipes(options[:prefix] + '|contact_person|_')
      options[:required_level] += 1
    elsif options[:prefix] =~ /\|contact_group_data_center\|_$/ #== 'draft_|data_contacts|_|contact_group_data_center|_'
      data_level = remove_pipes(options[:prefix] + '|contact_group|_')
      options[:required_level] += 1
    else
      data_level = remove_pipes(options[:prefix])
    end

    data_attrs = { level: data_level }
    data_attrs[:required_level] = options[:required_level] if options[:required_level]
    data_attrs[:required_group] = options[:required_group] if options[:required_group]

    text_field_html = text_field_tag(
      name_to_param(options[:prefix] + options[:name]),
      options[:value],
      class: classes.join(' '),
      data: data_attrs,
      readonly: options[:readonly],
      autocomplete: options[:autocomplete]
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
    classes += options[:classes].split(' ') if options[:classes]
    classes << 'validate'

    # default values when not multi-select
    is_multi_select = false
    prompt = "Select #{options[:title]}"
    size = nil

    is_multi_select = true if options[:multiple]

    select_options = options[:options].clone
    if options[:grouped]
      if options[:value] && invalid_select_option(select_options, options[:value], true)
        disabled_options = content_tag(:optgroup, label: 'Invalid') do
          content_tag(:option, options[:value], selected: 'selected', disabled: 'disabled')
        end
      end

      select_options = grouped_options_for_select(select_options, options[:value])
      select_options = disabled_options + select_options if disabled_options
    else
      # restrict options for drop down if for metadata_date
      select_options.shift(2) if options[:metadata_date]

      disabled_options = []

      if is_multi_select
        prompt = nil
        size = 4
        values = options[:value] || []
        values.each do |value|
          if value && invalid_select_option(select_options, value)
            # handle invalid options for multi_select
            select_options.unshift value
            disabled_options << value
          end
        end
      else
        # prepend invalid disabled option
        if options[:value] && invalid_select_option(select_options, options[:value])
          select_options.unshift options[:value]
          disabled_options = options[:value]
        end
      end

      select_options = options_for_select(select_options, selected: options[:value], disabled: disabled_options)
    end

    if classes.include? 'select2-select'
      styles = 'width: 100%;'
      classes.delete('half-width')
    end

    # for data center contact person/groups in data contacts form, need to keep the data center information
    # at the same data-level and data-required-level as the contact person/ group, so the required fields
    # appear/disappear with the contact person/group information
    if options[:prefix] =~ /\|contact_person_data_center\|_$/ #== 'draft_|data_contacts|_|contact_person_data_center|_'
      data_level = remove_pipes(options[:prefix] + '|contact_person|_')
      options[:required_level] += 1
    elsif options[:prefix] =~ /\|contact_group_data_center\|_$/ #== 'draft_|data_contacts|_|contact_group_data_center|_'
      data_level = remove_pipes(options[:prefix] + '|contact_group|_')
      options[:required_level] += 1
    else
      data_level = remove_pipes(options[:prefix])
    end
    # need to make sure the required icons act the way we want with this change
    # labels, name, id will be different than data-level ...

    data_attrs = { level: data_level }
    data_attrs[:required_level] = options[:required_level] if options[:required_level]

    select_html = select_tag(
      name_to_param(options[:prefix] + options[:name]),
      select_options,
      multiple: is_multi_select,
      size: size,
      class: classes,
      prompt: prompt,
      data: data_attrs,
      style: styles
    )

    mmt_label(options) + mmt_help_icon(options) + select_html
  end

  # RAILS5.1 -- datetime_field_tag returns a datetime_local instead of date_time
  # datetime_local doesn't support UTC and is supported in some, but not all
  # browsers.  custom-datetimes are managed by datepicker.coffee and
  # datepicker.scss and are unrelated to the deprecated html datetime input type
  def mmt_datetime_field_tag(name, dt, options)
    datetime_field_tag(name,dt,options).gsub('datetime-local','custom-datetime').html_safe
  end

  def mmt_extended_datetime_field_tag(name, dt, cls, placeholder, data)
    datetime_field_tag(name,dt,cls, placeholder, data).gsub('datetime-local','custom-datetime').html_safe
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
      placeholder: "YYYY-MM-DDTHH:MM:SSZ",
      data: { level: remove_pipes(options[:prefix]) }
    )

    mmt_label(options) + mmt_help_icon(options) + datetime_html.gsub('datetime-local','custom-datetime').html_safe
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
    classes << 'always-required eui-required-o' if options[:always_required]
    label_tag(
      label_for,
      options[:title],
      class: classes,
      id: id
    )
  end

  def mmt_help_icon(options)
    return unless options[:help]
    link_to('#help-modal', class: 'display-modal') do
      "<i class=\"eui-icon eui-fa-info-circle\" data-help-path=\"#{options[:help]}\" data-help-url=\"#{options[:help_url]}\"></i><span class=\"is-invisible\">Help modal for #{options[:title]}</span>".html_safe
    end
  end

  def add_pipes(name)
    "|#{name}|"
  end

  def editable_metadata_dates(metadata)
    dates = metadata['MetadataDates'] || []
    editable_dates = dates.reject { |date| date['Type'] == 'CREATE' || date['Type'] == 'UPDATE' }
    editable_dates.empty? ? [{}] : editable_dates
  end

  def metadata_create_date(metadata)
    dates = metadata['MetadataDates']
    create_date = dates.find { |date| date['Type'] == 'CREATE' }
    create_date
  end

  def metadata_update_date(metadata)
    dates = metadata['MetadataDates']
    update_date = dates.find { |date| date['Type'] == 'UPDATE' }
    update_date
  end

  def hidden_metadata_date_fields(metadata)
    dates = metadata['MetadataDates']
    return unless dates && dates.any? { |date| date['Type'] == 'CREATE' }

    create_type = hidden_field_tag('draft[metadata_dates][-2][type]',
                                   metadata_create_date(metadata)['Type'])
    create_datetime = hidden_field_tag('draft[metadata_dates][-2][date]',
                                       metadata_create_date(metadata)['Date'])
    update_type = hidden_field_tag('draft[metadata_dates][-1][type]',
                                   metadata_update_date(metadata)['Type'])
    update_datetime = hidden_field_tag('draft[metadata_dates][-1][date]',
                                       metadata_update_date(metadata)['Date'])

    create_type + create_datetime + update_type + update_datetime
  end

  def invalid_select_option(options, value, grouped = false)
    matches = if options[0].class == Carmen::Country
                options.select { |option| option.name.include? value }
              elsif grouped
                values = options.map { |option| option[1] }.flatten
                Array.wrap(values).select { |option| option.include? value }
              else
                options.select { |option| option.include? value }
              end
    matches.empty?
  end
end
