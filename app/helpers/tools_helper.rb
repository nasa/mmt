module ToolsHelper
  def render_change_provider_tool_action_link(tool_action, concept_id, revision_id = nil)
    case tool_action
    when 'edit'
      link_to('Edit Tool', edit_tool_path(concept_id, revision_id: revision_id), class: 'is-invisible', id: 'change-provider-tool-edit')
    when 'clone'
      link_to('Clone Tool', clone_tool_path(concept_id, revision_id: revision_id), class: 'is-invisible', id: 'change-provider-tool-clone')
    when 'delete'
      link_to('Delete Tool', tool_path(concept_id), method: :delete, class: 'is-invisible', id: 'change-provider-tool-delete')
    end
  end

  # Allows metaprogramming to make the views of V/S/T to be more generic and to
  # allow customization of action text based on concept type
  def tool_action_text(tool_action)
    tool_action
  end
end