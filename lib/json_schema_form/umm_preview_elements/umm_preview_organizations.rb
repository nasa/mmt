module JsonSchemaForm
  module UmmPreviewElements
    # Parent for rendering cards for Service and Tool Organizations

    # :nodoc:
    class UmmPreviewOrganizations < UmmPreviewElement
      def render
        capture do
          render_preview_link_to_draft_form unless draft_id.nil?

          concat(content_tag(:ul, class: "#{organization_type}-organizations-cards cards") do

            Array.wrap(element_value).each_with_index do |organization, index|
              concat(content_tag(:li, class: 'card') do
                concat render_card_header(organization, index)
                concat render_card_body(organization, index)
              end)
            end
          end)
        end
      end

      def render_card_header(organization, index)
        title = organization.fetch('ShortName', "#{organization_type.titleize} Organization #{index + 1}")

        content_tag(:div, class: 'card-header') do
          concat content_tag(:h5, title, title: title, class: 'card-header-title')
          concat roles_badge(organization.fetch('Roles', []))
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

      private

      def organization_type
        key == 'ServiceOrganizations' ? 'service' : 'tool'
      end
    end
  end
end
