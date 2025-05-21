module JsonSchemaForm
  module UmmPreviewElements
    # Renders cards for Tool Organizations

    # :nodoc:
    class UmmPreviewToolOrganizations < UmmPreviewOrganizations
      def render_card_body(tool_organization, _index)
        capture do
          concat(content_tag(:div, class: 'card-body active') do
            concat(content_tag(:div, class: 'card-body-details') do
              concat content_tag(:h6, tool_organization['LongName']) if tool_organization['LongName']

              if tool_organization['URLValue']
                concat link_to tool_organization['URLValue'], tool_organization['URLValue']
              else
                'Not Provided'
              end
            end)
          end)
        end
      end
    end
  end
end
