module CollectionsHelper
  DELETE_CONFIRMATION_TEXT = 'I want to delete this collection and the associated records'.freeze
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
    elsif metadata['CollectionDataType'] == 'LOW_LATENCY'
      content_tag(:span, 'LOW LATENCY', class: 'eui-badge nrt')
    elsif metadata['CollectionDataType'] == 'EXPEDITED'
      content_tag(:span, 'EXPEDITED', class: 'eui-badge nrt')
    end
  end

  # this displays tag information in the #tags-modal on the collection show page
  # tags for collection search results are handled in a coffeescript file
  def display_collection_tag_info(tags_info:, num_tags:, tags_error:, tag_keys:)
    if num_tags == 0
      # there are no tags, or there was an issue retrieving the collection tag
      # information from cmr search (.json format) in which case we are displaying
      # a flash message
      content_tag(:p, 'There are no tags associated with this collection')
    elsif tags_error
      # we retrieved the collection's tag keys, but ran into an issue retrieving
      # further tag information, so we can display the tag keys but no more
      content_tag(:div) do
        concat(content_tag(:div, "There was an error retrieving Tag information: #{tags_error}", class: 'eui-banner--danger'))

        concat(content_tag(:ul) do
          tag_keys.each do |tag_key|
            concat(content_tag(:p) do
              concat(content_tag(:li) do
                concat(content_tag(:strong, 'Tag Key: '))
                concat(content_tag(:span, tag_key))
              end)
              concat(content_tag(:li) do
                concat(content_tag(:strong, 'Description: '))
                concat(content_tag(:span, 'Not retrieved'))
              end)
            end)
          end
        end)
      end
    else
      content_tag(:ul) do
        tags_info.each do |tag|
          concat(content_tag(:p) do
            concat(content_tag(:li) do
              concat(content_tag(:strong, 'Tag Key: '))
              concat(content_tag(:span, tag.fetch('tag_key', 'Not found')))
            end)
            concat(content_tag(:li) do
              concat(content_tag(:strong, 'Description: '))
              # If there is no description, the response can hold '' so fetch is
              # not sufficient
              description = tag.fetch('description', '')
              description = 'Not provided' if description.blank?
              concat(content_tag(:span, description))
            end)
          end)
        end
      end
    end
  end

  def display_cascade_delete_modal_text(num_granules, num_variables)
    if num_granules > 0 && num_variables > 0
      associated_text = "#{num_granules} associated #{'granule'.pluralize(num_granules)} and #{num_variables} associated #{'variable'.pluralize(num_variables)}"
      delete_text = 'associated granules and variables'
    elsif num_granules > 0
      associated_text = "#{num_granules} associated #{'granule'.pluralize(num_granules)}"
      delete_text = 'associated granules'
    elsif num_variables > 0
      associated_text = "#{num_variables} associated #{'variable'.pluralize(num_variables)}"
      delete_text = 'associated variables'
    end

    content_tag(:div) do
      concat(content_tag(:p, "This collection has #{associated_text}."))
      concat(content_tag(:p, "Deleting this collection will delete all #{delete_text}."))
      concat(content_tag(:p, "Please confirm that you wish to continue by entering \"#{CollectionsHelper::DELETE_CONFIRMATION_TEXT}\" below."))
    end
  end
end
