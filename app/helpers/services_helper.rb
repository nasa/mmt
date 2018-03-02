module ServicesHelper
  def render_change_provider_service_action_link(service_action, concept_id, revision_id = nil)
    case service_action
    when 'edit'
      link_to('Edit Service', edit_service_path(concept_id, revision_id: revision_id), class: 'is-invisible', id: 'change-provider-service-edit')
    when 'clone'
      link_to('Clone Service', clone_service_path(concept_id, revision_id: revision_id), class: 'is-invisible', id: 'change-provider-service-clone')
    when 'delete'
      link_to('Delete Service', service_path(concept_id), method: :delete, class: 'is-invisible', id: 'change-provider-service-delete')
    when 'manage-collection-associations'
      link_to('Manage Collection Associations', service_collection_associations_path(concept_id, revision_id: revision_id), class: 'is-invisible', id: 'change-provider-service-manage-collection-associations')
    end
  end

  def service_action_text(service_action)
    if service_action == 'manage-collection-associations'
      'manage collection associations for'
    else
      service_action
    end
  end
end
