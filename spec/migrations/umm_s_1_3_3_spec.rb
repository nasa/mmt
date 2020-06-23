require File.join(Rails.root, 'db', 'migrate', '20200619123435_umm_s_1_3_3_data_migration')

describe 'Migration tests for UMM-S v1.3 => 1.3.3' do
  context 'when doing the up migration' do
    before :all do
      @draft = create(:full_service_draft_1_3)
      @empty_draft = create(:empty_service_draft)
      UmmS133DataMigration.new.up
    end

    after :all do
      ServiceDraft.delete([@draft.id, @empty_draft.id])
    end

    it 'has an array of outputs within supported reformattings' do
      expect(Draft.find(@draft.id).draft['ServiceOptions']['SupportedReformattings'][0]['SupportedOutputFormats']).to eq(['HDF-EOS5'])
    end

    it 'has a LicenseURL' do
      expect(Draft.find(@draft.id).draft['UseConstraints']['LicenseURL']).to eq('LicenseUrl Text')
    end

    it 'has online resources in its service contacts' do
      expect(Draft.find(@draft.id).draft['ContactPersons'][0]['ContactInformation']['OnlineResources'][0]).to eq({
        'Linkage' => 'http://example.com/',
        'Name' => 'DATA SET LANDING PAGE',
        'Description' => 'Related URL 1 Description'
      })
      expect(Draft.find(@draft.id).draft['ContactPersons'][0]['ContactInformation']['OnlineResources'][1]).to eq({
        'Linkage' => 'https://example.com/',
        'Name' => 'GET SERVICE',
        'Description' => 'Related URL 2 Description'
      })
      expect(Draft.find(@draft.id).draft['ContactPersons'][0]['ContactInformation']['OnlineResources'][2]).to eq({
        'Linkage' => 'https://search.earthdata.nasa.gov/',
        'Name' => 'GET DATA',
        'Description' => 'Related URL 3 Description'
      })

      expect(Draft.find(@draft.id).draft['ContactGroups'][0]['ContactInformation']['OnlineResources'][0]).to eq({
        'Linkage' => 'http://example.com/',
        'Name' => 'DATA SET LANDING PAGE',
        'Description' => 'Related URL 1 Description'
      })
      expect(Draft.find(@draft.id).draft['ContactGroups'][0]['ContactInformation']['OnlineResources'][1]).to eq({
        'Linkage' => 'https://example.com/',
        'Name' => 'GET SERVICE',
        'Description' => 'Related URL 2 Description'
      })
      expect(Draft.find(@draft.id).draft['ContactGroups'][0]['ContactInformation']['OnlineResources'][2]).to eq({
        'Linkage' => 'https://search.earthdata.nasa.gov/',
        'Name' => 'GET DATA',
        'Description' => 'Related URL 3 Description'
      })
    end

    it 'has the correct fields in its URL field' do
      expect(Draft.find(@draft.id).draft['URL']).to eq({
        'Description' => 'Description of primary url',
        'URLValue' => 'httpx://testurl.earthdata.nasa.gov'
      })
    end

    it 'does not modify empty drafts' do
      expect(Draft.find(@empty_draft.id).draft.keys.blank?).to eq(true)
    end
  end

  context 'when doing the down migration' do
    before :all do
      @draft = create(:full_service_draft_1_3_3)
      @empty_draft = create(:empty_service_draft)
      UmmS133DataMigration.new.down
    end

    after :all do
      ServiceDraft.delete([@draft.id, @empty_draft.id])
    end

    it 'correctly adjusts supported reformattings and does not retain new formats' do
      expect(Draft.find(@draft.id).draft['ServiceOptions']['SupportedReformattings']).to eq([
        # First reformatting in 1.3.3 factory
        { 'SupportedInputFormat' => 'HDF-EOS2', 'SupportedOutputFormat' => 'HDF-EOS5' },
        # Second reformattin in 1.3.3 factory; split two old formats
        { 'SupportedInputFormat' => 'HDF-EOS2', 'SupportedOutputFormat' => 'HDF-EOS2' },
        { 'SupportedInputFormat' => 'HDF-EOS2', 'SupportedOutputFormat' =>'HDF-EOS' },
        # Third reformatting in 1.3.3 factory; new input format is removed
        { 'SupportedOutputFormat' => 'HDF-EOS2' },
        { 'SupportedOutputFormat' => 'HDF-EOS' },
        # Fourth reformatting in 1.3.3 factory; both outputs are removed
        { 'SupportedInputFormat' => 'HDF-EOS2' },
        # Fifth reformatting in 1.3.3 factory; one output is removed
        { 'SupportedInputFormat' => 'HDF-EOS2', 'SupportedOutputFormat' => 'ASCII' },
        # Sixth reformatting in 1.3.3 factory; no output is migrated correctly
        { 'SupportedInputFormat' => 'HDF-EOS2' },
        # Seventh reformatting in 1.3.3 factory; no input is migrated correctly
        { 'SupportedOutputFormat' => 'ASCII' },
        # Eigth reformatting in 1.3.3 factory; neither input not output is valid
        # reformatting is dropped
      ])
    end

    it 'has related urls in its service contacts' do
      expect(Draft.find(@draft.id).draft['ContactPersons'][0]['ContactInformation']['RelatedUrls'][0]).to eq({
        'Description' => 'ORD1 Text',
        'URL' => 'ORL1 Text',
        'URLContentType' => 'CollectionURL',
        'Type' => 'PROJECT HOME PAGE'
      })

      expect(Draft.find(@draft.id).draft['ContactPersons'][0]['ContactInformation']['RelatedUrls'][1]).to eq({
        'Description' => 'ORD2 Text',
        'URL' => 'ORL2 Text',
        'URLContentType' => 'CollectionURL',
        'Type' => 'PROJECT HOME PAGE'
      })

      expect(Draft.find(@draft.id).draft['ContactPersons'][0]['ContactInformation']['RelatedUrls'][2]).to eq({
        'Description' => 'ORD3 Text',
        'URL' => 'ORL3 Text',
        'URLContentType' => 'CollectionURL',
        'Type' => 'PROJECT HOME PAGE'
      })

      expect(Draft.find(@draft.id).draft['ContactGroups'][0]['ContactInformation']['RelatedUrls'][0]).to eq({
        'Description' => 'ORD1 Text',
        'URL' => 'ORL1 Text',
        'URLContentType' => 'CollectionURL',
        'Type' => 'PROJECT HOME PAGE'
      })

      expect(Draft.find(@draft.id).draft['ContactGroups'][0]['ContactInformation']['RelatedUrls'][1]).to eq({
        'Description' => 'ORD2 Text',
        'URL' => 'ORL2 Text',
        'URLContentType' => 'CollectionURL',
        'Type' => 'PROJECT HOME PAGE'
      })

      expect(Draft.find(@draft.id).draft['ContactGroups'][0]['ContactInformation']['RelatedUrls'][2]).to eq({
        'Description' => 'ORD3 Text',
        'URL' => 'ORL3 Text',
        'URLContentType' => 'CollectionURL',
        'Type' => 'PROJECT HOME PAGE'
      })
    end

    it 'has the correct fields in its URL field' do
      expect(Draft.find(@draft.id).draft['URL']).to eq({
        'Description' => 'Description of primary url',
        'URLValue' => 'httpx://testurl.earthdata.nasa.gov',
        'URLContentType' => 'DistributionURL',
        'Type' => 'GET SERVICE'
      })
    end

    it 'does not retain the new formats in supported inputs and outputs' do
      expect(Draft.find(@draft.id).draft['ServiceOptions']['SupportedInputFormats']).to eq(['HDF-EOS2', 'HDF-EOS5'])
      expect(Draft.find(@draft.id).draft['ServiceOptions']['SupportedOutputFormats']).to eq(['HDF-EOS2', 'HDF-EOS5'])
    end

    it 'has the correct LicenseUrl field' do
      expect(Draft.find(@draft.id).draft['UseConstraints']['LicenseUrl']).to eq('LicenseUrl Text')
    end

    it 'does not modify emptry drafts' do
      expect(Draft.find(@empty_draft.id).draft.keys.blank?).to eq(true)
    end
  end
end