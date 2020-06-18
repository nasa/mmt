module OnlineResourceHelper
  def render_online_resource(online_resources)
    capture do
      if online_resources
        Array.wrap(online_resources).each do |online_resource|
          concat(content_tag(:div, class: 'card-body') do
            concat(content_tag(:div, class: 'card-body-details-full') do
              concat content_tag(:p, online_resource['Name']) if online_resource['Name']
              concat content_tag(:p, online_resource['Description']) if online_resource['Description']

              concat(if online_resource['Linkage']
                       link_to online_resource['Linkage'], online_resource['Linkage'], title: online_resource.fetch('Name', 'Online Resource Linkage')
                     else
                       'Not provided'
                     end)

              concat content_tag(:p, "Protocol: #{online_resource['Protocol']}")
              concat content_tag(:p, "Application Profile: #{online_resource['ApplicationProfile']}")
              concat content_tag(:p, "Function: #{online_resource['Function']}")
            end)
          end)
        end
      end
    end
  end
end