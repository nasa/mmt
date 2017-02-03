# :nodoc:
module ServiceTags
  extend ActiveSupport::Concern

  def construct_tags(provider_guid, collections)
    collections.map do |collection|
      "DATASET_#{provider_guid}_#{collection}"
    end
  end
end
