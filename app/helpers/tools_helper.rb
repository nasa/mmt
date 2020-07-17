module ToolsHelper
  def render_change_provider_tool_action_link(tool_action, concept_id, revision_id = nil)
    case tool_action
    when 'edit'
      link_to('Edit Service', edit_tool_path(concept_id, revision_id: revision_id), class: 'is-invisible', id: 'change-provider-tool-edit')
    when 'clone'
      link_to('Clone Service', clone_tool_path(concept_id, revision_id: revision_id), class: 'is-invisible', id: 'change-provider-tool-clone')
    when 'delete'
      link_to('Delete Service', tool_path(concept_id), method: :delete, class: 'is-invisible', id: 'change-provider-tool-delete')
    end
  end

  # Simplifies shared code between V/S/T
  def tool_action_text(tool_action)
    tool_action
  end
end