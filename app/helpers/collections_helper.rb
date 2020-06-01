module CollectionsHelper
  DOWNLOAD_XML_OPTIONS = [
    { format: 'atom',     title: 'ATOM' },
    { format: 'dif10',    title: 'DIF 10' },
    { format: 'echo10',   title: 'ECHO 10' },
    # Fixed the ISO formats due to MMT-2268. Both 'iso' and 'iso19115' refer to 'application/iso19115+xml' for MENDS.
    # For SMAP the correct format is 'iso-smap' which refers to 'application/iso:smap+xml'.
    { format: 'iso19115', title: 'ISO 19115 (MENDS)' },
    { format: 'iso-smap', title: 'ISO 19115 (SMAP)' }
  ]

  def render_change_provider_collection_action_link(collection_action, concept_id, revision_id = nil)
    case collection_action
    when 'edit'
      link_to('Edit Collection', edit_collection_path(concept_id, revision_id: revision_id),
              class: 'is-invisible', id: 'change-provider-edit-collection')
    when 'clone'
      link_to('Clone Collection', clone_collection_path(concept_id),
              class: 'is-invisible', id: 'change-provider-clone-collection')
    when 'delete'
      link_to('Edit Collection', collection_path(concept_id), method: :delete,
              class: 'is-invisible', id: 'change-provider-delete-collection')
    when 'revert'
      link_to('Edit Collection', edit_collection_path(concept_id, revision_id: revision_id),
              class: 'is-invisible', id: 'change-provider-revert-collection')
    end
  end

  def all_collections_selected?(collections, selected_concept_ids)
    (collections.map { |c| c.fetch('meta', {})['concept-id'] } - selected_concept_ids).empty?
  end

  def render_collection_download_xml_link(download_format, download_link_title, concept_id, revision_id)
    link_to(download_link_title, download_collection_xml_path(concept_id, download_format, revision_id),
            id: download_format)
  end

  def nrt_badge(metadata)
    if metadata['CollectionDataType'] == 'NEAR_REAL_TIME'
      content_tag(:span, 'NRT', class: 'eui-badge nrt')
    end
  end
end
