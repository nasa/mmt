class UmmVar17To18 < ActiveRecord::Migration[5.2]
  # UMM-Var 1.7 -> 1.8
  def up
    metadata_specification = {
      'Name' => 'UMM-Var',
      'URL' => 'https://cdn.earthdata.nasa.gov/umm/variable/v1.8',
      'Version' => '1.8'
    }

    variable_drafts = VariableDraft.all

    variable_drafts.each do |variable_draft|
      variable_draft.draft['MetadataSpecification'] = metadata_specification

      variable_draft.save
    end
  end

  def down
    variable_drafts = VariableDraft.where.not(draft: {})

    variable_drafts.each do |variable_draft|
      variable_draft.draft.delete('RelatedURLs')
      variable_draft.draft.delete('MetadataSpecification')

      variable_draft.save
    end
  end
end
