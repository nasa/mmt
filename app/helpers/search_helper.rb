# :nodoc:
module SearchHelper
  def results_query_label(query)
    query.delete('page_num')
    query.delete('page_size')

    # Remove * from entry title searches
    query['entry_title'] = query['entry_title'][1..-2] if query['entry_title']
    query.delete('options[entry_title][pattern]')

    # Remove keyword if blank
    query.delete('keyword') if query['keyword'].blank?

    pruned = query.clone
    # We might want to worry about how we order this at some point
    return if pruned.empty?

    results = []

    pruned.each do |key, value|
      if key == 'sort_key'
        value = value.gsub('revision_date', 'last_modified')
        descending = value.starts_with?('-')
        usable_value = value.tr('-', ' ').tr('_', ' ').titleize
        usable_value += descending ? ' Desc' : ' Asc'
      else
        usable_value = value
      end
      results << "#{key.to_s.tr('_', ' ').titleize}: #{usable_value}"
    end
    "for: #{results.join(' | ')}"
  end

  def sort_by_link(title, sort_key, query, record_type, specified_url = nil)
    params = query.clone
    params['record_type'] = record_type unless specified_url

    link_type = nil
    if query['sort_key'] && query['sort_key'].include?(sort_key)
      link_type = 'desc'
      unless query['sort_key'].starts_with?('-')
        link_type = 'asc'
        sort_key = "-#{sort_key}"
      end
    end

    params['sort_key'] = sort_key

    url = if specified_url
            "#{specified_url}?#{params.to_query}"
          else
            "/search?#{params.to_query}"
          end

    link_to "#{title} <i class='fa fa-sort#{'-' + link_type if link_type}'></i>".html_safe, url, title: "Sort by #{title} #{link_type == 'asc' ? 'Desc' : 'Asc'}"
  end

  def display_last_modified(record)
    revision_date = record.fetch('meta', {})['revision-date']
    if revision_date.blank?
      'UNKNOWN'
    else
      DateTime.parse(revision_date).to_fs(:date)
    end
  end

  def display_tag_count(record)
    tag_keys = record.dig('added_fields', 'tags')&.keys
    tag_count = tag_keys&.count || 0

    if tag_count > 0
      content_tag(:div) do
        concat(link_to(tag_count, '#tags-modal', class: 'col-tag-key-link display-modal', data: { 'col_tag_keys': "#{record.fetch('meta', {})['concept-id']}-tag-keys" }))
        concat(content_tag(:span) do
          hidden_field_tag "#{record.fetch('meta', {})['concept-id']}-tag-keys[]", tag_keys
        end)
      end
    else
      tag_count
    end
  end

  def dropdown_size_modification
    # search dropdown is smaller if radio buttons are hidden in DMMT
    return ' search-dropdown-short' if Rails.configuration.proposal_mode

    # TODO: Make this a permanent change when the UMM-T toggle is removed.
    # search dropdown is wider if tools radio button is enabled
    ' search-dropdown-wide' if Rails.configuration.umm_t_enabled
  end

  # TODO: Make this a permanent change when the UMM-T toggle is removed.
  def search_field_size_modification
    return if Rails.configuration.proposal_mode

    ' search-field-wide' if Rails.configuration.umm_t_enabled
  end

  # search radio buttons are hidden in DMMT, visible in MMT
  def proposal_mode_button_visibility
    Rails.configuration.proposal_mode ? " search-disabled-radio-buttons" : " search-enabled-radio-buttons"
  end
end
