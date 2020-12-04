# :nodoc:
module GroupsHelper
  def check_if_system_group?(group, concept_id)
    group['provider_id'].nil? && concept_id =~ /(CMR)$/ ? true : false
  end

  def group_provider(group)
    check_if_system_group?(group, group['concept_id']) ? 'CMR' : group['provider_id']
  end

  def render_manage_provider_or_system_permissions_title
    if @user_is_system_acl_admin && check_if_system_group?(@group, @concept_id)
      # System Permissions can only be managed if user has access and group is a system group
      content_tag(:h5, 'Manage Provider and System Object Permissions')
    elsif @user_is_system_acl_admin || @user_is_current_provider_acl_admin
      content_tag(:h5, 'Manage Provider Object Permissions')
    end
  end

  def render_manage_provider_or_system_permissions_links
    content_tag(:div) do
      if @user_is_system_acl_admin && check_if_system_group?(@group, @concept_id)
        render_manage_system_permissions_link
      end

      if @user_is_system_acl_admin || @user_is_current_provider_acl_admin
        render_manage_provider_permissions_link
      end
    end
  end

  def render_manage_system_permissions_link
    concat(content_tag(:p) do
      concat(link_to('System Object Permissions', edit_system_identity_permission_path(@concept_id, redirect_to: request.fullpath)))
    end)
  end

  def render_manage_provider_permissions_link
    concat(content_tag(:p) do
      if check_if_system_group?(@group, @concept_id)
        # for system groups, Provider Permissions will be for the current provider
        concat(link_to("Provider Object Permissions for #{current_user.provider_id}", edit_provider_identity_permission_path(@concept_id, redirect_to: request.fullpath)))
      else
        # for provider groups, Provider Permissions should only be managed for the group's provider
        if current_provider?(@group['provider_id'])
          concat(link_to("Provider Object Permissions for #{@group['provider_id']}", edit_provider_identity_permission_path(@concept_id, redirect_to: request.fullpath)))
        else
          concat(link_to("Provider Object Permissions for #{@group['provider_id']}", '#not-current-provider-modal', class: 'display-modal not-current-provider', data: { 'provider': @group['provider_id'], record_action: 'edit-provider-identity-permissions' }))
        end
      end
    end)
  end
end
