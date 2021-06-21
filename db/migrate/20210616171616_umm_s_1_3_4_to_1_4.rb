class UmmS134To14 < ActiveRecord::Migration[5.2]
  # UMM-S 1.3.4 -> 1.4
  def up
    metadata_specification = {
      'URL' => 'https://cdn.earthdata.nasa.gov/umm/service/v1.4',
      'Name' => 'UMM-S',
      'Version' => '1.4'
    }

    service_drafts = ServiceDraft.all

    service_drafts.each do |service_draft|
      service_draft.draft['MetadataSpecification'] = metadata_specification

      service_draft.save
    end
  end

  def down
    service_drafts = ServiceDraft.where.not(draft: {})

    service_drafts.each do |service_draft|
      service_draft.draft.delete('RelatedURLs')
      service_draft.draft.delete('MetadataSpecification')

      service_draft.save
    end
  end
end
