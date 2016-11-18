module GroupsHelper
  def options_for_user_select(users, selected = nil)
    options_for_select(users.map { |user| ["#{user[:name]} | #{user[:email]}", user[:uid]] }, selected)
  end

  def check_if_system_group?(group, concept_id)
    group['provider_id'].nil? && concept_id =~ /(CMR)$/ ? true : false
  end

  def group_provider(group)
    check_if_system_group?(group, group['concept_id']) ? 'CMR' : group['provider_id']
  end

  def system_group_checkbox(checkable = true)
    if checkable
      check_box_tag(:system_group, true, @is_system_group, class: 'system-group-checkbox')
    else
      check_box_tag(:system_group, true, @is_system_group, class: 'system-group-checkbox',
                    readonly: true, onclick: "return false;", onkeydown: "return false;")
    end
  end
end
