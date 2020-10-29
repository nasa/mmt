require File.join(Rails.root, 'db', 'migrate', '20201013182007_umm_s_1_3_4_data_migration')

describe 'Migration tests for UMM-S v1.3.3 => 1.3.4' do
  context 'when doing the up migration' do
    before :all do
      @draft = create(:full_service_draft_1_3_3)
      @draft.draft['ServiceOptions']['SubsetTypes'] = ['Spatial', 'Temporal', 'Variable']
      @draft.save
      @empty_draft = create(:empty_service_draft)

      # Draft with type opendap to test subset conversion
      @opendap_draft = create(:full_service_draft_1_3_3)
      @opendap_draft.draft['Type'] = 'OPeNDAP'
      @opendap_draft.draft['ServiceOptions']['SubsetTypes'] = ['Spatial', 'Temporal', 'Variable']
      @opendap_draft.save

      # draft with type esi to test subset conversion
      @esi_draft = create(:full_service_draft_1_3_3)
      @esi_draft.draft['Type'] = 'ESI'
      @esi_draft.draft['ServiceOptions']['SubsetTypes'] = ['Spatial', 'Variable']
      @esi_draft.save

      # draft with outputs and no inputs to test reformatting conversion
      @no_inputs_draft = create(:full_service_draft_1_3_3)
      @no_inputs_draft.draft['ServiceOptions'].delete('SupportedInputFormats')
      @no_inputs_draft.save

      #draft with inputs and no outputs to test reformatting conversion
      @no_outputs_draft = create(:full_service_draft_1_3_3)
      @no_outputs_draft.draft['ServiceOptions'].delete('SupportedOutputFormats')
      @no_outputs_draft.save

      # draft with no relevant fields to show migration does not alter draft
      @no_relevant_fields_draft = create(:full_service_draft_1_3_3)
      @no_relevant_fields_draft.draft['ServiceOptions'].delete('SubsetTypes')
      @no_relevant_fields_draft.draft['ServiceOptions'].delete('SupportedInputFormats')
      @no_relevant_fields_draft.draft['ServiceOptions'].delete('SupportedOutputFormats')
      @no_relevant_fields_draft.save

      # some malformed drafts for testing the bad data handling
      @malformed_draft1 = create(:full_service_draft_1_3_3)
      @malformed_draft1.draft['ServiceOptions'] = ['Totally Invalid']
      @malformed_draft1.save
      @malformed_draft2 = create(:full_service_draft_1_3_3)
      @malformed_draft2.draft['ServiceOptions']['SubsetTypes'] = {'Totally' => 'Invalid'}
      @malformed_draft2.draft['ServiceOptions']['SupportedInputFormats'] = {'Totally' => 'Invalid'}
      @malformed_draft2.save

      UmmS134DataMigration.new.up
    end

    after :all do
      ServiceDraft.delete([@draft.id, @empty_draft.id, @opendap_draft.id, @esi_draft.id, @no_inputs_draft.id, @no_outputs_draft.id, @no_relevant_fields_draft.id, @malformed_draft1.id, @malformed_draft2.id])
    end

    it 'adds the output formats to the first input formats' do
      expect(Draft.find(@draft.id).draft['ServiceOptions']['SupportedReformattings']).to eq(
        [
          {
            'SupportedInputFormat' => 'HDF-EOS2',
            # This is the first HDF-EOS2 entry, so it gains HDF-EOS2 and WKT as
            # outputs.
            'SupportedOutputFormats' => ['HDF-EOS5', 'HDF-EOS2', 'WKT']
          },
          {
            'SupportedInputFormat' => 'HDF-EOS2',
            'SupportedOutputFormats' => ['HDF-EOS2', 'HDF-EOS']
          },
          {
            'SupportedInputFormat' => 'GEOJSON',
            # This is the first GEOJSON entry, so it gains 'HDF-EOS5', 'WKT' as
            # outputs at the end
            'SupportedOutputFormats' => ['HDF-EOS2', 'HDF-EOS', 'HDF-EOS5', 'WKT']
          },
          {
            'SupportedInputFormat' => 'HDF-EOS2',
            'SupportedOutputFormats' => ['GEOJSON', 'Shapefile']
          },
          {
            'SupportedInputFormat' => 'HDF-EOS2',
            'SupportedOutputFormats' => ['ASCII', 'Shapefile']
          },
          {
            'SupportedInputFormat' => 'HDF-EOS2'
          },
          {
            'SupportedOutputFormats' => ['ASCII']
          },
          {
            'SupportedInputFormat' => 'GEOJSON',
            'SupportedOutputFormats' => ['GEOJSON', 'Shapefile']
          },
          # This entry is added because there was previously no HDF-EOS5 input.
          {
            'SupportedInputFormat' => 'HDF-EOS5',
            'SupportedOutputFormats' => ['HDF-EOS2', 'HDF-EOS5', 'WKT']
          }
        ]
      )

      expect(Draft.find(@draft.id).draft['ServiceOptions'].keys).not_to include('SupportedInputFormats', 'SupportedOutputFormats')

      expect(Draft.find(@no_inputs_draft.id).draft['ServiceOptions']['SupportedReformattings'].last).to eq({ 'SupportedOutputFormats' => ['HDF-EOS2', 'HDF-EOS5', 'WKT'] })
      expect(Draft.find(@no_outputs_draft.id).draft['ServiceOptions']['SupportedReformattings'][-1]).to eq('SupportedInputFormat' => 'HDF-EOS5')
      # The no_outputs_draft has three inputs but both the hdf-eos2 and geojson
      # inputs are not added to the reformattings because at least one
      # reformatting exists with those as the input.
    end

    it 'makes correct subsets' do
      expect(Draft.find(@opendap_draft.id).draft['ServiceOptions']['Subset']).to eq(
        {
          'SpatialSubset' => { 'BoundingBox' => { 'AllowMultipleValues' => false } },
          'TemporalSubset' => { 'AllowMultipleValues' => false },
          'VariableSubset' => { 'AllowMultipleValues' => true }
        }
      )

      expect(Draft.find(@esi_draft.id).draft['ServiceOptions']['Subset']).to eq(
        {
          'SpatialSubset' =>
            {
              'BoundingBox' => { 'AllowMultipleValues' => false },
              'Shapefile' => [{'Format' => 'ESRI'}, {'Format' => 'KML'}, {'Format' => 'GeoJSON'}]
            },
          'VariableSubset' => { 'AllowMultipleValues' => true }
        }
      )

      expect(Draft.find(@draft.id).draft['ServiceOptions']['Subset']).to eq(
        {
          'TemporalSubset' => { 'AllowMultipleValues' => false },
          'VariableSubset' => { 'AllowMultipleValues' => false }
        }
      )

      expect(Draft.find(@draft.id).draft['ServiceOptions'].keys).not_to include('SubsetTypes')
    end

    it 'does not modify blank drafts' do
      expect(Draft.find(@empty_draft.id).draft).to eq({})
    end

    it 'does not modify drafts which do not contain the expected fields' do
      expect(Draft.find(@no_relevant_fields_draft.id).draft).to eq(@no_relevant_fields_draft.draft)
    end

    it 'does not choke on invalidly formatted data' do
      expected_draft = @malformed_draft1.draft
      expected_draft.delete('ServiceOptions')
      expect(Draft.find(@malformed_draft1.id).draft).to eq(expected_draft)

      expected_draft2 = @malformed_draft2.draft
      expected_draft2['ServiceOptions'].delete('SubsetTypes')
      expected_draft2['ServiceOptions'].delete('SupportedInputFormats')
      expected_draft2['ServiceOptions'].delete('SupportedOutputFormats')
      expect(Draft.find(@malformed_draft2.id).draft).to eq(expected_draft2)
      expect(Draft.find(@malformed_draft2.id).draft['ServiceOptions'].keys).not_to include('Subset')
    end
  end

  context 'when doing the down migration' do
    before :all do
      @draft = create(:full_service_draft_1_3_4)
      @draft.draft['Type'] = 'Harmony' # verify that this value is being cleared
      @draft.save
      @empty_draft = create(:empty_service_draft)
      @no_relevant_fields_draft = create(:full_service_draft_1_3_4)
      @no_relevant_fields_draft.draft['ServiceOptions'].delete('Subset')
      @no_relevant_fields_draft.draft['ServiceOptions'].delete('SupportedReformattings')
      @no_relevant_fields_draft.save

      # some malformed drafts for testing the bad data handling
      @malformed_draft1 = create(:full_service_draft_1_3_4)
      @malformed_draft1.draft['ServiceOptions'] = ['Totally Invalid']
      @malformed_draft1.save
      @malformed_draft2 = create(:full_service_draft_1_3_4)
      @malformed_draft2.draft['ServiceOptions']['Subset'] = ['Totally', 'Invalid']
      @malformed_draft2.draft['ServiceOptions']['SupportedReformattings'] = {'Totally' => 'Invalid'}
      @malformed_draft2.save

      UmmS134DataMigration.new.down
    end

    after :all do
      ServiceDraft.delete([@draft.id, @empty_draft.id, @no_relevant_fields_draft.id, @malformed_draft1.id, @malformed_draft2.id])
    end

    it 'properly removes new enums' do
      expect(Draft.find(@draft.id).draft['ServiceOptions']['SupportedReformattings']).to eq(
        [
          {
            'SupportedInputFormat' => 'HDF-EOS2',
          },
          {
            'SupportedOutputFormats' => ['HDF-EOS2', 'HDF-EOS']
          }
        ]
      )

      expect(Draft.find(@draft.id).draft['Type']).to eq(nil)
    end

    it 'properly reduces subset' do
      expect(Draft.find(@draft.id).draft['ServiceOptions']['SubsetTypes']).to eq(['Spatial', 'Temporal', 'Variable'])
    end

    it 'does not change empty records' do
      expect(Draft.find(@empty_draft.id).draft).to eq({})
    end

    it 'does not change records without the requisite fields' do
      expect(Draft.find(@no_relevant_fields_draft.id).draft).to eq(@no_relevant_fields_draft.draft)
    end

    it 'does not choke on invalid data' do
      expected_draft = @malformed_draft1.draft
      expected_draft.delete('ServiceOptions')
      expect(Draft.find(@malformed_draft1.id).draft).to eq(expected_draft)

      expected_draft2 = @malformed_draft2.draft
      expected_draft2['ServiceOptions'].delete('Subset')
      expected_draft2['ServiceOptions'].delete('SupportedReformattings')
      expect(Draft.find(@malformed_draft2.id).draft).to eq(expected_draft2)
      expect(Draft.find(@malformed_draft2.id).draft['ServiceOptions'].keys).not_to include('SubsetTypes')
    end
  end
end
