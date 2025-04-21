module JsonSchemaForm
  module UmmPreviewElements
    # Renders cards for Service Organizations

    # :nodoc:
    class UmmPreviewServiceOrganizations < UmmPreviewOrganizations
      def render_card_body(service_organization, index)
        capture do
          concat(content_tag(:div, class: 'card-body active') do
            concat(content_tag(:div, class: 'card-body-details-full') do
              concat content_tag(:h6, service_organization['LongName']) if service_organization['LongName']
            end)
          end)

          concat UmmPreviewOnlineResource.new(schema_type: schema_type, preview_json: {}, data: data, form_id: form_id, key: "#{full_key}/index_id/OnlineResource", draft_id: draft_id, options: options.merge('indexes' => [index])).render

          concat render_card_navigation(service_organization['OnlineResource'])
        end
      end

      def render_card_navigation(online_resource)
        capture do
          if online_resource
            content_tag(:div, class: 'card-navigation') do
              concat(content_tag(:ul) do
                concat(content_tag(:li, class: 'card-navigation-control') do
                  concat content_tag(:a, content_tag(:i, nil, class: 'fa fa-chevron-left'), href: '', class: 'card-navigation-control-back')
                end)

                concat(content_tag(:li, class: 'card-navigation-pagination') do
                  concat content_tag(:i, nil, class: 'fa fa-circle')
                  # Have to put whitespace in to space out the navigation circles
                  # Surely there is a better solution to this
                  concat ' '
                  concat content_tag(:i, nil, class: 'fa fa-circle-o')
                end)

                concat(content_tag(:li, class: 'card-navigation-control') do
                  concat content_tag(:a, content_tag(:i, nil, class: 'fa fa-chevron-right'), href: '', class: 'card-navigation-control-forward')
                end)
              end)
            end
          end
        end
      end
    end
  end
end
