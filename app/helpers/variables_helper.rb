module VariablesHelper
  def render_change_provider_variable_action_link(variable_action, concept_id, revision_id = nil)
    case variable_action
    when 'edit'
      link_to('Edit Collection', edit_variable_path(concept_id, revision_id: revision_id), class: 'is-invisible', id: 'change-provider-edit-variable')
    when 'delete'
      link_to('Edit Collection', variable_path(concept_id), method: :delete, class: 'is-invisible', id: 'change-provider-delete-variable')
    end
  end
end
