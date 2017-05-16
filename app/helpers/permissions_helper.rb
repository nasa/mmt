# :nodoc:
module PermissionsHelper
  ErrorCodeMessages = {
    409 => 'This permission could not be created because there is already another permission with the same name.',
    403 => 'You are not authorized to create a permission. Please contact your system administrator.'
  }.freeze

  def display_access_constraints(access_value)
    return unless access_value.any?

    filters = ['which have access constraint values']

    if access_value['min_value'] && access_value['max_value']
      filters << if access_value['min_value'] == access_value['max_value']
                   "equal to #{access_value['min_value']}"
                 else
                   "between #{access_value['min_value']} and #{access_value['max_value']}"
                 end

      filters << '(or are undefined)' if access_value['include_undefined_value'] == true
    elsif access_value['include_undefined_value']
      filters << 'that are undefined'
    end

    filters.join(' ')
  end

  def collection_constraint_summary(permission)
    collection_applicable = permission.fetch('catalog_item_identity', {}).fetch('collection_applicable', false)

    collection_entry_titles = permission.fetch('catalog_item_identity', {}).fetch('collection_identifier', {}).fetch('entry_titles', [])
    puts collection_entry_titles

    sentence_fragments = ['This permission']

    if collection_applicable
      sentence_fragments << if collection_entry_titles.any?
                              "grants its assigned groups access to #{pluralize(collection_entry_titles.count, 'collection')}"
                            else
                              'grants its assigned groups access to all of it\'s collections'
                            end

      sentence_fragments << display_access_constraints(permission.fetch('catalog_item_identity', {}).fetch('collection_identifier', {}).fetch('access_value', {}))
    else
      sentence_fragments << 'does not grant access to collections'
    end

    "#{sentence_fragments.join(' ')}."
  end

  def granule_constraint_summary(permission)
    granule_applicable = permission.fetch('catalog_item_identity', {}).fetch('granule_applicable', false)

    collection_entry_titles = permission.fetch('catalog_item_identity', {}).fetch('collection_identifier', {}).fetch('entry_titles', [])

    sentence_fragments = ['This permission']

    if granule_applicable
      sentence_fragments << 'grants its assigned groups access to the granules'

      sentence_fragments << display_access_constraints(permission.fetch('catalog_item_identity', {}).fetch('granule_identifier', {}).fetch('access_value', {}))

      sentence_fragments << if collection_entry_titles.any?
                              "that belong to the #{pluralize(collection_entry_titles.count, 'selected collection')}"
                            else
                              'that belong to any of its collections'
                            end

      sentence_fragments << display_access_constraints(permission.fetch('catalog_item_identity', {}).fetch('collection_identifier', {}).fetch('access_value', {}))
    else
      sentence_fragments << 'does not grant access to granules'
    end

    "#{sentence_fragments.join(' ')}."
  end

  def permission_collections(permission)
    entry_titles = permission.fetch('catalog_item_identity', {}).fetch('collection_identifier', {}).fetch('entry_titles', [])

    return {} unless entry_titles.any?

    collection_response = cmr_client.get_collections_by_post({ provider_id: permission['provider_id'], entry_title: entry_titles, page_size: entry_titles.count }, token, 'umm_json')

    return {} unless collection_response.success?
    
    collection_response.body
  end

  def unauthorized_permission_collections(permission)
    entry_titles = permission.fetch('catalog_item_identity', {}).fetch('collection_identifier', {}).fetch('entry_titles', [])

    permitted_collections = permission_collections(permission).fetch('items', []).map { |collection| collection.fetch('umm', {}).fetch('EntryTitle') }

    entry_titles.reject { |entry_title| permitted_collections.include?(entry_titles) }
  end
end
