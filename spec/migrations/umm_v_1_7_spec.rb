# frozen_string_literal: true

require File.join(Rails.root, 'db', 'migrate', '20200903193441_umm_v_1_7_data_migration')

describe 'Migration tests for UMM-V 1.7' do
  context 'when doing the up migration' do
    lost_keys = %w[AcquisitionSourceName Alias SizeEstimation]
    retained_keys = %w[Name LongName Definition Units DataType Scale Offset VariableType VariableSubType ValidRanges IndexRanges FillValues Dimensions MeasurementIdentifiers SamplingIdentifiers ScienceKeywords Sets]
    name_no_slash = 'name_no_slash'
    name_slash = '/name_slash'
    group_path_no_slash = 'group_path_no_slash'
    group_path_slash = 'group_path_slash/'
    before :all do
      @draft = create(:full_variable_draft_1_6)
      @no_slash_draft = create(:full_variable_draft_1_6, draft_name: name_no_slash, draft_group_path: group_path_no_slash)
      @name_slash_draft = create(:full_variable_draft_1_6, draft_name: name_slash, draft_group_path: group_path_no_slash)
      @group_path_slash_draft = create(:full_variable_draft_1_6, draft_name: name_no_slash, draft_group_path: group_path_slash)
      @two_slash_draft = create(:full_variable_draft_1_6, draft_name: name_slash, draft_group_path: group_path_slash)
      @empty_draft = create(:empty_variable_draft)
      UmmV17DataMigration.new.up
    end

    after :all do
      VariableDraft.delete([@draft.id, @empty_draft.id, @no_slash_draft.id, @name_slash_draft.id, @group_path_slash_draft.id, @two_slash_draft.id])
    end

    it 'the migration only removed the fields removed from the schema' do
      expect((VariableDraft.find(@draft.id).draft.keys - lost_keys).sort).to eq(VariableDraft.find(@draft.id).draft.keys.sort)
      expect(VariableDraft.find(@draft.id).draft.keys.sort).to eq(retained_keys.sort)
    end

    it 'the name field has been migrated correctly' do
      expect(VariableDraft.find(@no_slash_draft.id).draft['Name']).to eq("#{group_path_no_slash}/#{name_no_slash}")
      expect(VariableDraft.find(@name_slash_draft.id).draft['Name']).to eq("#{group_path_no_slash}#{name_slash}")
      expect(VariableDraft.find(@group_path_slash_draft.id).draft['Name']).to eq("#{group_path_slash}#{name_no_slash}")
      expect(VariableDraft.find(@two_slash_draft.id).draft['Name']).to eq("#{group_path_slash.chop}#{name_slash}")
    end

    it 'the index ranges are migrated correctly' do
      expect(VariableDraft.find(@draft.id).draft.keys.include?('Characteristics')).to eq(false)
      expect(VariableDraft.find(@draft.id).draft['IndexRanges']).to eq(
        'LatRange' => [
          -90.0,
          90.0
        ],
        'LonRange' => [
          -180.0,
          180.0
        ]
      )
    end

    it 'does not change an empty draft' do
      expect(VariableDraft.find(@empty_draft.id).draft).to eq({})
    end
  end

  context 'when doing the down migration' do
    lost_keys = %w[StandardName AdditionalIdentifiers]
    retained_keys = %w[Name LongName Definition Units DataType Scale Offset VariableType VariableSubType ValidRanges Characteristics FillValues Dimensions MeasurementIdentifiers SamplingIdentifiers ScienceKeywords Sets]
    before :all do
      @draft = create(:full_variable_draft_1_7)
      @empty_draft = create(:empty_variable_draft)
      UmmV17DataMigration.new.down
    end

    after :all do
      VariableDraft.delete([@draft.id, @empty_draft.id])
    end

    it 'the draft does not have the fields removed from the schema' do
      expect((VariableDraft.find(@draft.id).draft.keys - lost_keys).sort).to eq(VariableDraft.find(@draft.id).draft.keys.sort)
      expect(VariableDraft.find(@draft.id).draft.keys.sort).to eq(retained_keys.sort)
    end

    it 'the index ranges are migrated correctly' do
      expect(VariableDraft.find(@draft.id).draft.keys.include?('IndexRanges')).to eq(false)
      expect(VariableDraft.find(@draft.id).draft['Characteristics']).to eq(
        'IndexRanges' => {
          'LatRange' => [
            -90.0,
            90.0
          ],
          'LonRange' => [
            -180.0,
            180.0
          ]
        }
      )
    end

    it 'does not change an empty draft' do
      expect(VariableDraft.find(@empty_draft.id).draft).to eq({})
    end
  end
end
