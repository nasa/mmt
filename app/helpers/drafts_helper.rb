module DraftsHelper
  def display_key_value_pairs(values)
    raw(values.map{|value| "<p>#{list_key_values(value).flatten.compact.join(' | ')}</p>"}.join)
  end

  def list_key_values(hash)
    puts "HASH: #{hash.inspect}"
    hash.map do |key, value|
      if value.is_a? Hash
        list_key_values(value)
      else
        # TODO can this value improve?
          # Resource Provider instead of RESOURCEPROVIDER or Resourceprovider
        "#{key}: #{value}" unless value.empty?
      end
    end
  end

  # TODO is it possible to make this method generic?
    # I'm not sure if it is
  def hidden_fields_for_organizations(orgs)
    html = ""
    orgs.each_with_index do |org, index|
      html += hidden_field_tag("draft[responsible_organization][#{index}][role]", org['Role'])

      party = org['Party'] || {}
      organization_name = party['OrganizationName'] || {}
      html += hidden_field_tag("draft[responsible_organization][#{index}][party][organization_name][short_name]", organization_name['ShortName'])
      html += hidden_field_tag("draft[responsible_organization][#{index}][party][organization_name][long_name]", organization_name['LongName'])
    end
    raw(html)
  end

  def hidden_fields_for_related_urls(urls)
    html = ""
    urls.each_with_index do |url, index|
      html += hidden_field_tag("draft[related_url][#{index}][url]", url['Url'])
      html += hidden_field_tag("draft[related_url][#{index}][description]", url['Description'])
      html += hidden_field_tag("draft[related_url][#{index}][protocol]", url['Protocol'])
      html += hidden_field_tag("draft[related_url][#{index}][mime_type]", url['MimeType'])
      html += hidden_field_tag("draft[related_url][#{index}][caption]", url['Caption'])
      html += hidden_field_tag("draft[related_url][#{index}][title]", url['Title'])

      file_size = url['FileSize'] || {}
      html += hidden_field_tag("draft[related_url][#{index}][file_size][size]", file_size['Size'])
      html += hidden_field_tag("draft[related_url][#{index}][file_size][unit]", file_size['Unit'])

      content_type = url['ContentType'] || {}
      html += hidden_field_tag("draft[related_url][#{index}][content_type][type]", content_type['Type'])
      html += hidden_field_tag("draft[related_url][#{index}][content_type][subtype]", content_type['Subtype'])
    end
    raw(html)
  end
end
