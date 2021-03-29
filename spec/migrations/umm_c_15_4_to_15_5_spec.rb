require File.join(Rails.root, 'db', 'migrate', '20201221134953_umm_c_15_4_to_15_5')

# Testing cases where:
# 0. No GetData or Format keys      (both)
# 1. same but different case
  # 1.1 same but upcase             (only for up migration) jpeg
  # 1.2 same but downcase           (only for down migration) jpeg
  # 1.3 same but capitalize         (only for up migration) binary
  # 1.4 same but weirdcase          (only for up migration) geotiff
# 2. different                      (only for down migration)
# 3. equivalent HDF4                (both)

describe 'Migration tests for UMM-C v1.15.4 => 1.15.5' do
  let(:getdata_hash)                       { {'Size' => 42, 'Unit' => 'KB'} }
  let(:getdata_hash_binary_format_up)      { getdata_hash.merge('Format' => 'binary')  }
  let(:getdata_hash_geotiff_format_up)     { getdata_hash.merge('Format' => 'geotiff') }
  let(:getdata_hash_hdf4_format)           { getdata_hash.merge('Format' => 'HDF4')    }
  let(:getdata_hash_binary_format_down)    { getdata_hash.merge('Format' => 'Binary')  }
  let(:getdata_hash_geotiff_format_down)   { getdata_hash.merge('Format' => 'GeoTIFF') }
  let(:getdata_hash_different_format_down) { getdata_hash.merge('Format' => 'GeoPackage') }


  context 'when doing the migration for MMT' do
    before do
      @draft = create(:full_collection_draft)
      @template = create(:full_collection_template)

      draft = @draft.draft
      base_related_url = draft.dig('RelatedUrls',1).clone
      draft['RelatedUrls'][2] = base_related_url.merge('GetData' => getdata_hash_binary_format_up)
      draft['RelatedUrls'][3] = base_related_url.merge('GetData' => getdata_hash_geotiff_format_up)
      draft['RelatedUrls'][4] = base_related_url.merge('GetData' => getdata_hash_hdf4_format)
      draft['RelatedUrls'][5] = base_related_url.merge('GetData' => getdata_hash_binary_format_down)
      draft['RelatedUrls'][6] = base_related_url.merge('GetData' => getdata_hash_geotiff_format_down)
      draft['RelatedUrls'][7] = base_related_url.merge('GetData' => getdata_hash_different_format_down)
      @draft.save

      template = @template.draft
      template['RelatedUrls'][2] = base_related_url.merge('GetData' => getdata_hash_binary_format_up)
      template['RelatedUrls'][3] = base_related_url.merge('GetData' => getdata_hash_geotiff_format_up)
      template['RelatedUrls'][4] = base_related_url.merge('GetData' => getdata_hash_hdf4_format)
      template['RelatedUrls'][5] = base_related_url.merge('GetData' => getdata_hash_binary_format_down)
      template['RelatedUrls'][6] = base_related_url.merge('GetData' => getdata_hash_geotiff_format_down)
      template['RelatedUrls'][7] = base_related_url.merge('GetData' => getdata_hash_different_format_down)
      @template.save
    end

    after do
      CollectionDraft.delete([@draft.id])
      CollectionTemplate.delete([@template.id])
    end

    context 'when doing the up migration' do
      before do
        UmmC154To155.new.up
      end

      it 'ignores the Related URLs with no GetData form' do
        expect(CollectionDraft.find(@draft.id).draft.dig('RelatedUrls', 0)).to eq({
          'Description' => 'Related URL 1 Description',
          'URLContentType' => 'CollectionURL',
          'Type' => 'DATA SET LANDING PAGE',
          'URL' => 'http://example.com/'
        })
        expect(CollectionTemplate.find(@template.id).draft.dig('RelatedUrls', 0)).to eq({
          'Description' => 'Related URL 1 Description',
          'URLContentType' => 'CollectionURL',
          'Type' => 'DATA SET LANDING PAGE',
          'URL' => 'http://example.com/'
        })
      end

      it 'ignores the Related URLs that have compatible GetData Formats' do
        expect(CollectionDraft.find(@draft.id).draft.dig('RelatedUrls', 4, 'GetData', 'Format')).to eq('HDF4')
        expect(CollectionTemplate.find(@template.id).draft.dig('RelatedUrls', 4, 'GetData', 'Format')).to eq('HDF4')
      end

      it 'adjusts the case when the formats are "equal ignoring case"' do
        expect(CollectionDraft.find(@draft.id).draft.dig('RelatedUrls', 1, 'GetData', 'Format')).to eq('JPEG')
        expect(CollectionDraft.find(@draft.id).draft.dig('RelatedUrls', 2, 'GetData', 'Format')).to eq('Binary')
        expect(CollectionDraft.find(@draft.id).draft.dig('RelatedUrls', 3, 'GetData', 'Format')).to eq('GeoTIFF')
        expect(CollectionTemplate.find(@template.id).draft.dig('RelatedUrls', 1, 'GetData', 'Format')).to eq('JPEG')
        expect(CollectionTemplate.find(@template.id).draft.dig('RelatedUrls', 2, 'GetData', 'Format')).to eq('Binary')
        expect(CollectionTemplate.find(@template.id).draft.dig('RelatedUrls', 3, 'GetData', 'Format')).to eq('GeoTIFF')
      end
    end

    context 'when doing the down migration' do
      before do
        UmmC154To155.new.down
      end

      it 'ignores the Related URLs with no GetData form' do
        expect(CollectionDraft.find(@draft.id).draft.dig('RelatedUrls', 0)).to eq({
          'Description' => 'Related URL 1 Description',
          'URLContentType' => 'CollectionURL',
          'Type' => 'DATA SET LANDING PAGE',
          'URL' => 'http://example.com/'
        })
        expect(CollectionTemplate.find(@template.id).draft.dig('RelatedUrls', 0)).to eq({
          'Description' => 'Related URL 1 Description',
          'URLContentType' => 'CollectionURL',
          'Type' => 'DATA SET LANDING PAGE',
          'URL' => 'http://example.com/'
        })
      end

      it 'ignores the Related URLs that have compatible GetData Formats' do
        expect(CollectionDraft.find(@draft.id).draft.dig('RelatedUrls', 4, 'GetData', 'Format')).to eq('HDF4')
        expect(CollectionTemplate.find(@template.id).draft.dig('RelatedUrls', 4, 'GetData', 'Format')).to eq('HDF4')
      end

      it 'adjusts the case when the formats are "equal ignoring case"' do
        expect(CollectionDraft.find(@draft.id).draft.dig('RelatedUrls', 1, 'GetData', 'Format')).to eq('jpeg')
        expect(CollectionDraft.find(@draft.id).draft.dig('RelatedUrls', 5, 'GetData', 'Format')).to eq('binary')
        expect(CollectionDraft.find(@draft.id).draft.dig('RelatedUrls', 6, 'GetData', 'Format')).to eq('geotiff')
        expect(CollectionTemplate.find(@template.id).draft.dig('RelatedUrls', 1, 'GetData', 'Format')).to eq('jpeg')
        expect(CollectionTemplate.find(@template.id).draft.dig('RelatedUrls', 5, 'GetData', 'Format')).to eq('binary')
        expect(CollectionTemplate.find(@template.id).draft.dig('RelatedUrls', 6, 'GetData', 'Format')).to eq('geotiff')
      end

      it 'deletest the GetData form if the kms format is not found within the old enum' do
        expect(CollectionDraft.find(@draft.id).draft.dig('RelatedUrls', 7, 'GetData')).to be_nil
        expect(CollectionTemplate.find(@template.id).draft.dig('RelatedUrls', 7, 'GetData')).to be_nil
      end
    end

  end

  context 'when doing the migration for dMMT' do
    before do
      set_as_proposal_mode_mmt
      @draft_proposal = create(:full_collection_draft_proposal)
      draft_proposal = @draft_proposal.draft

      base_related_url = draft_proposal.dig('RelatedUrls',1).clone
      draft_proposal['RelatedUrls'][2] = base_related_url.merge('GetData' => getdata_hash_binary_format_up)
      draft_proposal['RelatedUrls'][3] = base_related_url.merge('GetData' => getdata_hash_geotiff_format_up)
      draft_proposal['RelatedUrls'][4] = base_related_url.merge('GetData' => getdata_hash_hdf4_format)
      draft_proposal['RelatedUrls'][5] = base_related_url.merge('GetData' => getdata_hash_binary_format_down)
      draft_proposal['RelatedUrls'][6] = base_related_url.merge('GetData' => getdata_hash_geotiff_format_down)
      draft_proposal['RelatedUrls'][7] = base_related_url.merge('GetData' => getdata_hash_different_format_down)

      @draft_proposal.save
    end

    after do
      CollectionDraftProposal.delete([@draft_proposal.id])
    end

    context 'when doing the up migration' do
      before do
        UmmC154To155.new.up
      end

      it 'ignores the Related URLs with no GetData form' do
        expect(CollectionDraftProposal.find(@draft_proposal.id).draft.dig('RelatedUrls', 0)).to eq({
          'Description' => 'Related URL 1 Description',
          'URLContentType' => 'CollectionURL',
          'Type' => 'DATA SET LANDING PAGE',
          'URL' => 'http://example.com/'
        })
      end

      it 'ignores the Related URLs that have compatible GetData Formats' do
        expect(CollectionDraftProposal.find(@draft_proposal.id).draft.dig('RelatedUrls', 4, 'GetData', 'Format')).to eq('HDF4')
      end

      it 'adjusts the case when the formats are "equal ignoring case"' do
        expect(CollectionDraftProposal.find(@draft_proposal.id).draft.dig('RelatedUrls', 1, 'GetData', 'Format')).to eq('JPEG')
        expect(CollectionDraftProposal.find(@draft_proposal.id).draft.dig('RelatedUrls', 2, 'GetData', 'Format')).to eq('Binary')
        expect(CollectionDraftProposal.find(@draft_proposal.id).draft.dig('RelatedUrls', 3, 'GetData', 'Format')).to eq('GeoTIFF')
      end
    end

    context 'when doing the down migration' do
      before do
        UmmC154To155.new.down
      end

      it 'ignores the Related URLs with no GetData form' do
        expect(CollectionDraftProposal.find(@draft_proposal.id).draft.dig('RelatedUrls', 0)).to eq({
          'Description' => 'Related URL 1 Description',
          'URLContentType' => 'CollectionURL',
          'Type' => 'DATA SET LANDING PAGE',
          'URL' => 'http://example.com/'
        })
      end

      it 'ignores the Related URLs that have compatible GetData Formats' do
        expect(CollectionDraftProposal.find(@draft_proposal.id).draft.dig('RelatedUrls', 4, 'GetData', 'Format')).to eq('HDF4')
      end

      it 'adjusts the case when the formats are "equal ignoring case"' do
        expect(CollectionDraftProposal.find(@draft_proposal.id).draft.dig('RelatedUrls', 1, 'GetData', 'Format')).to eq('jpeg')
        expect(CollectionDraftProposal.find(@draft_proposal.id).draft.dig('RelatedUrls', 5, 'GetData', 'Format')).to eq('binary')
        expect(CollectionDraftProposal.find(@draft_proposal.id).draft.dig('RelatedUrls', 6, 'GetData', 'Format')).to eq('geotiff')
      end

      it 'deletest the GetData form if the kms format is not found within the old enum' do
        expect(CollectionDraftProposal.find(@draft_proposal.id).draft.dig('RelatedUrls', 7, 'GetData')).to be_nil
      end
    end
  end
end
