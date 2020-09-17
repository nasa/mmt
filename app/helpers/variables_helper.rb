module VariablesHelper
  # Used when directly accessing an action
  def render_change_provider_variable_action_link(variable_action, concept_id, revision_id = nil)
    case variable_action
    when 'edit'
      link_to('Edit Variable', edit_variable_path(concept_id, revision_id: revision_id), class: 'is-invisible', id: 'change-provider-variable-edit')
    when 'clone'
      link_to('Clone Variable', clone_variable_path(concept_id, revision_id: revision_id), class: 'is-invisible', id: 'change-provider-variable-clone')
    when 'delete'
      link_to('Delete Variable', variable_path(concept_id), method: :delete, class: 'is-invisible', id: 'change-provider-variable-delete')
    when 'manage-collection-associations'
      link_to('Manage Collection Association', variable_collection_associations_path(concept_id, revision_id: revision_id), class: 'is-invisible', id: 'change-provider-variable-manage-collection-associations')
    end
  end

  def variable_action_text(variable_action)
    if variable_action == 'manage-collection-associations'
      'manage the collection association for'
    else
      variable_action
    end
  end
end
