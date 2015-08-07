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
    self.entry_title || '<Untitled Collection Record>'
  end

  def display_entry_id
    self.entry_id || '<Blank Entry Id>'
  end

  def update_draft(params)
    if params
      # pull out searchable fields if provided
      self.entry_title = params['entry_title'] if params['entry_title']
      self.entry_id = params['entry_id']['id'] if params['entry_id'] && params['entry_id']['id']

      # The provider_id isn't actually part of the metadata. You can think of that as the owner of the metadata. It's meta-metadata.
      # self.provider_id = ?

      json_params = fix_params(params)
      self.draft.merge!(json_params) if json_params
      self.save
    end
    # TODO take out
    true
  end

  def fix_params(params)
    # TODO FileSize-Size needs to be a number, not a string
    params = convert_to_arrays(params.clone)

    # if param is empty remove it from params
    params = compact_blank(params.clone)

    # Convert parameter keys to CamelCase for UMM
    # TODO Detailed_Classification needs to have an underscore
    params.to_hash.to_camel_keys if params
  end

  def convert_to_arrays(object)
    case object
    when Hash
      # if the first key is an integer, change hash to array
      keys = object.keys
      if keys.first =~ /\d+/
        object = object.map{|key, value| value}
        object.each do |value|
          value = convert_to_arrays(value)
        end
      else
        object.each do |key, value|
          object[key] = convert_to_arrays(value)
        end
      end
    # if value is array, loop through each hash
    when Array
      object.each do |obj|
        obj = convert_to_arrays(obj)
      end
    end
    object
  end

  def compact_blank(node)
    return node.map {|n| compact_blank(n)}.compact.presence if node.is_a?(Array)
    return node.presence unless node.is_a?(Hash)
    result = {}
    node.each do |k, v|
      result[k] = compact_blank(v)
    end
    result = result.compact
    result = {} if result.keys.all? {|k| k.start_with?('cmep_')}
    result.compact.presence
  end
end
