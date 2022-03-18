class UmmVar18To181 < ActiveRecord::Migration[5.2]
  # UMM-Var 1.8 -> 1.8.1
  def up
    metadata_specification = {
      'Name' => 'UMM-Var',
      'URL' => 'https://cdn.earthdata.nasa.gov/umm/variable/v1.8.1',
      'Version' => '1.8.1'
    }

    variable_drafts = VariableDraft.all

    variable_drafts.each do |variable_draft|
      variable_draft.draft['MetadataSpecification'] = metadata_specification

      variable_draft.save
    end
  end

  def down
    metadata_specification = {
      'Name' => 'UMM-Var',
      'URL' => 'https://cdn.earthdata.nasa.gov/umm/variable/v1.8',
      'Version' => '1.8'
    }

    variable_drafts = VariableDraft.all

    variable_drafts.each do |variable_draft|
      draft = variable_draft.draft
      draft['MetadataSpecification'] = metadata_specification

      if draft['VariableType'] == 'COORDINATE'
        draft['VariableType'] = 'OTHER'
      end

      if draft['VariableSubType'] == 'LATITUDE' || draft['VariableSubType'] == 'LONGITUDE' || draft['VariableSubType'] == 'TIME'
        draft['VariableSubType'] = 'OTHER'
      end

      variable_draft.save
    end
  end
end
