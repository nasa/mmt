class Draft < ActiveRecord::Base
  belongs_to :user
  serialize :draft, JSON

  DRAFT_FORMS = [ # array of hashes provide flexibility to add additional fiels
      {:form_partial_name=>'data_identification'},
      {:form_partial_name=>'descriptive_keywords'},
      {:form_partial_name=>'metadata_information'},
      {:form_partial_name=>'temporal_extent'},
      {:form_partial_name=>'spatial_extent'},
      {:form_partial_name=>'acquisition_information'},
      {:form_partial_name=>'distribution_information'}
  ]

  def self.get_next_form(cur_form_name)
    DRAFT_FORMS.each_with_index do |f, i|
      if f[:form_partial_name] == cur_form_name
        next_index = i+1
        next_index = 0 if next_index == DRAFT_FORMS.size
        return DRAFT_FORMS[next_index][:form_partial_name]
      end
    end
    return nil
  end

  def title
    self.draft['EntryTitle'] || '<Untitled Collection Record>'
  end

  def update_draft(params)
    if params
      json_params = fix_params(params)
      self.draft.merge!(json_params)
      self.save
    end
    # TODO take out
    true
  end

  def fix_params(params)
    # fields that need to be arrays need to be mapped to arrays
    if params['responsible_organization']
      orgs = params['responsible_organization'].map{|key, value| value}
      # puts orgs.inspect
      params['responsible_organization'] = orgs
    end
    if params['related_url']
      related_urls = params['related_url'].map{|key, value| value}
      # puts related_urls.inspect
      params['related_url'] = related_urls
    end

    # if param is empty remove it from params
    params = params.delete_if{|k,v| v.empty?}
    # puts "PARAMS: #{params.inspect}"

    # Convert parameter keys to CamelCase for UMM
    params.to_hash.to_camel_keys
  end
end
