module JsonSchemaForm
  module UmmPreviewElements
    # Renders cards for Service Contacts

    # :nodoc:
    class UmmPreviewContacts < UmmPreviewElement
      def render
        capture do
          render_preview_link_to_draft_form unless draft_id.nil?

          type = 'group' if contact_group?
          type = 'person' if contact_person?

          concat(content_tag(:ul, class: "contact-#{type}-cards cards") do
            Array.wrap(element_value).each_with_index do |contact, index|
              concat(content_tag(:li, class: 'card') do
                concat render_card_header(contact, index, type)
                concat render_card_body(contact, index, type)
              end)
            end
          end)
        end
      end

      def render_card_header(contact, index, type)
        title = contact.fetch('ShortName', "Contact #{type.titleize} #{index + 1}")

        content_tag(:div, class: 'card-header') do
          concat content_tag(:h5, title, title: title, class: 'card-header-title')
          concat roles_badge(contact.fetch('Roles', []))
        end
      end

      def roles_badge(roles)
        capture do
          if roles.size == 1
            concat content_tag(:span, roles.first, class: 'card-header-badge')
          elsif roles.size > 1
            concat(content_tag(:a, class: 'webui-popover-link card-header-badge', href: 'javascript:void(0)') do
              concat 'Multiple Roles'
              concat content_tag(:i, nil, class: 'fa fa-plus')
            end)

            concat(content_tag(:div, class: 'webui-popover-content') do
              roles.each do |role|
                concat content_tag(:p, role)
              end
            end)
          end
        end
      end

      def render_card_body(contact, index, type)
        capture do
          contact_info = contact.fetch('ContactInformation', {})
          concat(content_tag(:div, class: 'card-body active') do
            concat(content_tag(:div, class: 'card-body-details') do
              if contact_group?
                concat content_tag(:h6, contact['GroupName']) if contact['GroupName']
              elsif contact_person?
                name = [contact['FirstName'], contact['MiddleName'], contact['LastName']]
                name.delete('')
                concat content_tag(:h6, name.join(' '))
              end

              concat render_address(contact_info.fetch('Addresses', []).first, type)
            end)

            concat(content_tag(:div, class: 'card-body-aside') do
              concat content_tag(:h6, contact_info['ServiceHours'])
              concat render_contact_mechanisms(contact_info.fetch('ContactMechanisms', []), type)
            end)
          end)

          if contact_info['Addresses'] && contact_info['Addresses'].count > 1
            contact_info['Addresses'].drop(1).each do |address|
              concat(content_tag(:div, class: 'card-body') do
                concat(content_tag(:div, class: 'card-body-details-full') do
                  concat content_tag(:h6, 'Additional Address')
                  concat render_address(address, type)
                end)
              end)
            end
          end

          if contact_info['ContactInstruction']
            concat(content_tag(:div, class: 'card-body') do
              concat(content_tag(:div, class: 'card-body-details-full') do
                concat content_tag(:h6, 'Contact Details')
                concat content_tag(:p, contact_info['ContactInstruction'])
              end)
            end)
          end

          # Used in UMM-S
          concat UmmPreviewOnlineResource.new(schema_type: schema_type, preview_json: {}, data: data, form_id: form_id, key: "#{full_key}/index_id/ContactInformation", draft_id: draft_id, options: options.merge('indexes' => [index])).render

          concat render_card_navigation(contact_info)
        end
      end

      def render_address(address, type)
        capture do
          if address.blank?
            concat content_tag(:p, "This contact #{type} does not have any addresses listed.", class: 'empty-section')
          else
            street_addresses = address.fetch('StreetAddresses', [])
            concat(content_tag(:p) do
              street_addresses.each do |street_address|
                concat street_address
                concat tag(:br)
              end
              concat "#{address['City']}," if address['City']
              concat " #{address['StateProvince']}"
              concat " #{address['PostalCode']}"
            end)
          end
        end
      end

      def render_contact_mechanisms(contact_mechanisms, type)
        capture do
          if contact_mechanisms.blank?
            concat content_tag(:p, "This contact #{type} does not have any contact mechanisms listed.", class: 'empty-section')
          else
            concat(content_tag(:ul) do
              contact_mechanisms.each do |mechanism|
                type = mechanism['Type']
                value = mechanism['Value']
                concat(content_tag(:li) do
                  if ['Direct Line', 'Fax', 'Mobile', 'TDD/TTY Phone', 'Telephone', 'U.S. toll free'].include? type
                    concat content_tag(:i, nil, class: 'fa fa-phone-square')
                    concat value
                  elsif type == 'Email'
                    concat content_tag(:i, nil, class: 'fa fa-envelope')
                    concat content_tag(:a, 'Email', href: "mailto:#{value}", title: value)
                  elsif type == 'Twitter'
                    concat content_tag(:i, nil, class: 'fa fa-twitter-square')
                    concat display_value_or_add_popover(value)
                  elsif type == 'Facebook'
                    concat content_tag(:i, nil, class: 'fa fa-facebook-square')
                    concat display_value_or_add_popover(value)
                  elsif type == 'Fax'
                    concat content_tag(:i, class: 'fa fa-fax')
                    concat value
                  else
                    concat content_tag(:i, class: 'fa fa-bullhorn')
                    concat value
                  end
                end)
              end
            end)
          end
        end
      end

      def display_value_or_add_popover(value, max_length: 14)
        # If length isnt a concern just return the user provided value
        return value if value.length <= max_length

        # Otherwise use a popover
        capture do
          concat link_to(truncate(value, length: max_length),
                        'javascript:void(0)',
                        class: 'webui-popover-link')
          concat content_tag(:div, value, class: 'webui-popover-content')
        end
      end

      def render_card_navigation(contact_info)
        capture do
          content_tag(:div, class: 'card-navigation') do
            concat(content_tag(:ul) do
              concat(content_tag(:li, class: 'card-navigation-control') do
                concat content_tag(:a, content_tag(:i, nil, class: 'fa fa-chevron-left'), href: '', class: 'card-navigation-control-back')
              end)

              number_circles = 0
              number_circles += contact_info.fetch('Addresses', []).size - 1 if contact_info['Addresses']
              number_circles += contact_info.fetch('OnlineResources', []).size
              number_circles += 1 if contact_info['ContactInstruction']

              concat(content_tag(:li, class: 'card-navigation-pagination') do
                concat content_tag(:i, nil, class: 'fa fa-circle')

                number_circles.times do
                  # Have to put whitespace in to space out the navigation circles
                  # Surely there is a better solution to this
                  concat ' '
                  concat content_tag(:i, nil, class: 'fa fa-circle-o')
                end
              end)

              concat(content_tag(:li, class: 'card-navigation-control') do
                concat content_tag(:a, content_tag(:i, nil, class: 'fa fa-chevron-right'), href: '', class: 'card-navigation-control-forward')
              end)
            end)
          end
        end
      end

      def contact_person?
        key == 'ContactPersons'
      end

      def contact_group?
        key == 'ContactGroups'
      end
    end
  end
end