module DraftsHelper
  def display_organizations(orgs)
    puts "ORGS: #{orgs.inspect}"
    html = ''
    orgs.each do |org|
      # html += org.inspect #remove
      html += "<p>"
      html += "Role: #{org['Role'].titleize} | Short Name: #{org['Party']['OrganizationName']['ShortName']} | Long Name: #{org['Party']['OrganizationName']['LongName']}"
      html += "</p>"
    end
    raw(html)
  end

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
end
