# :nodoc:
module BulkUpdates
  extend ActiveSupport::Concern

  def retrieve_bulk_updates
    bulk_updates_list_response = cmr_client.get_bulk_updates(current_user.provider_id, token)

    bulk_updates = if bulk_updates_list_response.success?
                     bulk_updates_list_response.body.fetch('tasks', [])
                   else
                     Rails.logger.error("Error retrieving Bulk Updates Jobs List: #{bulk_updates_list_response.inspect}")
                     []
                   end

    bulk_updates.each { |update| hydrate_task(update) }

    bulk_updates.sort_by { |option| option['task-id'] }
  end

  # When the bulk update task comes back from CMR it needs a bit of
  # massaging before its ready for the view
  def hydrate_task(task, flatten_keys: true)
    task['request-json-body'] = JSON.parse(task['request-json-body'])

    if flatten_keys
      # Pull out all of the keys from the originial
      # request object and insert them into the root
      task['request-json-body'].each do |key, value|
        task[key] = value
      end
    end
  end

  # The response from CMR only includes the concept-id
  # but for display purposes we need detailed information
  def hydrate_collections(task)
    concept_ids = task.fetch('collection-statuses', []).map { |status| status['concept-id'] }
    return unless concept_ids.any?

    collections_response = cmr_client.get_collections_by_post({ concept_id: concept_ids, page_size: concept_ids.count }, token)
    return unless collections_response.success?

    collections_response.body['items'].each do |collection|
      task.fetch('collection-statuses', []).find { |status| status['concept-id'] == collection.fetch('meta', {})['concept-id'] }['collection'] = collection
    end
  end

  def parse_hierarchical_facets(facets, key, parent = nil, all_keywords = {})
    ## TODO: comment about what this method is doing and resulting structure that
    # is created

    facets[key].map do |facet|
      all_keywords[key] ||= []
      all_keywords[key] << { value: facet['value'], parent: parent }

      next_level = facet.fetch('subfields', []).first
      parse_hierarchical_facets(facet, next_level, facet['value'], all_keywords) if next_level
    end

    all_keywords
  end

  def retrieve_collection_facets(concept_ids)
    ## Q: do facets have location keywords? if so, how are science keyword 'category' and location keyword 'category' kept distinct?

    ## Q: does page size affect the facets that come back? (i.e. if we use default page size and there are many more, do the facets reflect the collections in the page or all collections?)

    # shouldn't be able to get here if no collections. should we guard against that possibility?
    # return unless concept_ids.any?
    response = cmr_client.get_collections_by_post({ concept_id: concept_ids, include_facets: true, hierarchical_facets: true }, token, 'json')
    return unless response.success?

    # flat_response = cmr_client.search_collections({ concept_id: concept_ids, include_facets: true }, token)
    # return unless flat_response.success?
    # flat_facets = flat_response.body.fetch('feed', {}).fetch('facets', {})

    # hierarchical_response = cmr_client.search_collections({ concept_id: concept_ids, include_facets: true, hierarchical_facets: true }, token)
    # return unless hierarchical_response.success?
    # what to do about error?

    facets = response.body.fetch('feed', {}).fetch('facets', {})
    # hierarchical_facets = hierarchical_response.body.fetch('feed', {}).fetch('facets', {})

    # fail
  end

  def set_science_keyword_facets(concept_ids)
    facets = retrieve_collection_facets(concept_ids)
    raw_science_keyword_facets = facets.find { |facet| facet['field'] == 'science_keywords' }

    @science_keyword_facets = parse_hierarchical_facets(raw_science_keyword_facets, 'category')
  end

  # sk = facets.find { |f| f['field'] == 'science_keywords' }
  #
  # {"subfields"=>["category"],
  #   "category"=>[
  #     {
  #       "subfields"=>["topic"],
  #       "topic"=>[
  #         {
  #           "subfields"=>["term"],
  #           "term"=>[
  #             {
  #               "subfields"=>["variable_level_1"],
  #               "variable_level_1"=>[
  #                 {
  #                   "count"=>8, "value"=>"DESKTOP GEOGRAPHIC INFORMATION SYSTEMS"
  #                 },
  #                 {
  #                   "count"=>8, "value"=>"MOBILE GEOGRAPHIC INFORMATION SYSTEMS"
  #                 }
  #               ],
  #               "count"=>8,
  #               "value"=>"GEOGRAPHIC INFORMATION SYSTEMS"
  #             }
  #             ],
  #             "count"=>8,
  #             "value"=>"DATA ANALYSIS AND VISUALIZATION"
  #           }
  #       ],
  #       "count"=>8,
  #       "value"=>"EARTH SCIENCE SERVICES"
  #     }
  #   ],
  #   "field"=>"science_keywords"
  # }

  # {
  #   "subfields"=>["category"],
  #   "category"=>[
  #     {
  #       "subfields"=>["topic"],
  #       "topic"=>[
  #         {
  #           "subfields"=>["term"],
  #           "term"=>[
  #             {
  #               "subfields"=>["variable_level_1"],
  #               "variable_level_1"=>[
  #                 {
  #                   "count"=>8,
  #                   "value"=>"DESKTOP GEOGRAPHIC INFORMATION SYSTEMS"
  #                 },
  #                 {
  #                   "count"=>8,
  #                   "value"=>"MOBILE GEOGRAPHIC INFORMATION SYSTEMS"
  #                 }
  #               ],
  #               "count"=>8,
  #               "value"=>"GEOGRAPHIC INFORMATION SYSTEMS"
  #             }
  #           ],
  #           "count"=>8,
  #           "value"=>"DATA ANALYSIS AND VISUALIZATION"
  #         }
  #       ],
  #       "count"=>8,
  #       "value"=>"EARTH SCIENCE SERVICES"
  #     }, {
  #       "subfields"=>["topic"],
  #       "topic"=>[
  #         {
  #           "subfields"=>["term"],
  #           "term"=>[
  #             {
  #               "subfields"=>["variable_level_1"],
  #               "variable_level_1"=>[
  #                 {
  #                   "subfields"=>["variable_level_2"],
  #                   "variable_level_2"=>[
  #                     {
  #                       "count"=>1,
  #                       "value"=>"ANGSTROM EXPONENT"
  #                     }
  #                   ],
  #                   "count"=>1,
  #                   "value"=>"AEROSOL OPTICAL DEPTH/THICKNESS"
  #                 }
  #               ],
  #               "count"=>1,
  #               "value"=>"AEROSOLS"
  #             }, {
  #               "subfields"=>["variable_level_1"],
  #               "variable_level_1"=>[
  #                 {
  #                   "subfields"=>["variable_level_2"],
  #                   "variable_level_2"=>[
  #                     {
  #                       "subfields"=>["variable_level_3"],
  #                       "variable_level_3"=>[
  #                         {
  #                           "count"=>1,
  #                           "value"=>"24 HOUR MAXIMUM TEMPERATURE"
  #                         }
  #                       ],
  #                       "count"=>1,
  #                       "value"=>"MAXIMUM/MINIMUM TEMPERATURE"
  #                     }
  #                   ],
  #                   "count"=>1,
  #                   "value"=>"SURFACE TEMPERATURE"
  #                 }
  #               ],
  #               "count"=>1,
  #               "value"=>"ATMOSPHERIC TEMPERATURE"
  #             }
  #           ],
  #           "count"=>2,
  #           "value"=>"ATMOSPHERE"
  #         }, {
  #           "subfields"=>["term"],
  #           "term"=>[
  #             {
  #               "subfields"=>["variable_level_1"],
  #               "variable_level_1"=>[
  #                 {
  #                   "subfields"=>["variable_level_2"],
  #                   "variable_level_2"=>[
  #                     {
  #                       "subfields"=>["variable_level_3"],
  #                       "variable_level_3"=>[
  #                         {
  #                           "count"=>1,
  #                           "value"=>"LUMINESCENCE"
  #                         }
  #                       ],
  #                       "count"=>2,
  #                       "value"=>"SEDIMENTARY ROCK PHYSICAL/OPTICAL PROPERTIES"
  #                     }
  #                   ],
  #                   "count"=>2,
  #                   "value"=>"SEDIMENTARY ROCKS"
  #                 }
  #               ],
  #               "count"=>2,
  #               "value"=>"ROCKS/MINERALS/CRYSTALS"
  #             }
  #           ],
  #           "count"=>2,
  #           "value"=>"SOLID EARTH"
  #         }
  #       ],
  #       "count"=>3,
  #       "value"=>"EARTH SCIENCE"
  #     }
  #   ],
  #   "field"=>"science_keywords"
  # }

  # def recursive_parse_hierarchical_facets(facets)
  #   # subfields = facets['subfields'].first if facets.key?('subfields') # or each?
  #
  #   if facets.key?('subfields') # there are more nested
  #     subfields = facets['subfields'].first
  #
  #     facets[subfields].each do |nested_facet|
  #       parse_hierarchical_facets(nested_facet)
  #     end
  #   else
  #
  #   end
  # end
  #
  # def parse_hierarchical_facets(facets)
  #   return facets['value'] unless facets.key?('subfield')
  #
  #   if facets.key?('subfields')
  #     subfields = facets['subfields'].first # i.e. 'term'
  #
  #     facets[subfields].each do |nested_facet| # gets array with one or more further nested hashes
  #
  #     end
  #   else
  #
  #   end
  # end
end
