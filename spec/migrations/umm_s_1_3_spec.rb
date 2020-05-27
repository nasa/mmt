require File.join(Rails.root, 'db', 'migrate', '20200521150645_umm_s_1_3_data_migration')

describe 'Migration tests for UMM-S v1.2 => 1.3' do
  context 'when doing the up migration' do
    before :all do
      @draft = create(:full_service_draft_1_2)
      @partial_draft = create(:partial_service_draft_1_3)
      @empty_draft = create(:empty_service_draft)
      UmmS13DataMigration.new.up
    end

    after :all do
      ServiceDraft.delete([@draft.id, @empty_draft.id, @partial_draft.id])
    end

    it 'has removed platforms and science keywords' do
      expect(Draft.find(@draft.id).draft.keys.include?('Platforms')).to eq(false)
      expect(Draft.find(@draft.id).draft.keys.include?('ScienceKeywords')).to eq(false)
    end

    it 'has a url and no top level related urls' do
      expect(Draft.find(@draft.id).draft.keys.include?('RelatedURLs')).to eq(false)
      expect(Draft.find(@draft.id).draft['URL']).to eq('Description' => 'Test related url',
                                                       'URLContentType' => 'DistributionURL',
                                                       'Type' => 'GET SERVICE',
                                                       'Subtype' => 'SOFTWARE PACKAGE',
                                                       'URLValue' => 'nasa.gov')
    end

    it 'correctly migrated use constraints' do
      expect(Draft.find(@draft.id).draft['UseConstraints']).to eq('LicenseText' => 'use constraint 1')
    end

    it 'has moved contact groups and persons out of service organizations' do
      Draft.find(@draft.id).draft['ServiceOrganizations'].each do |organization|
        expect(organization.keys.include?('ContactGroups')).to eq(false)
        expect(organization.keys.include?('ContactPersons')).to eq(false)
      end
      expect(Draft.find(@draft.id).draft['ContactGroups']).to eq(@draft.draft['ContactGroups'] + @draft.draft['ServiceOrganizations'][0]['ContactGroups'])
      expect(Draft.find(@draft.id).draft['ContactPersons']).to eq(@draft.draft['ContactPersons'] + @draft.draft['ServiceOrganizations'][0]['ContactPersons'])
    end

    it 'has removed contact information and made an online resource' do
      Draft.find(@draft.id).draft['ServiceOrganizations'].each do |organization|
        expect(organization.keys.include?('ContactInformation')).to eq(false)
        expect(organization['OnlineResource']).to eq('Description' => 'Related URL 3 Description',
                                                     'Linkage' => 'https://search.earthdata.nasa.gov/',
                                                     'Name' => 'HOME PAGE')
      end
    end

    it 'modifies CRSIdentifiers' do
      expect(Draft.find(@draft.id).draft['OperationMetadata'][0]['CoupledResource']['DataResource']['DataResourceSpatialExtent']['GeneralGrid']['CRSIdentifier']).to eq('EPSG:26917')
    end

    it 'does not modify empty drafts' do
      expect(Draft.find(@empty_draft.id).draft.keys.blank?).to eq(true)
    end
  end

  context 'when doing the down migration' do
    before :all do
      @draft = create(:full_service_draft_1_3)
      @partial_draft = create(:partial_service_draft_1_3)
      @empty_draft = create(:empty_service_draft)
      UmmS13DataMigration.new.down
    end

    after :all do
      ServiceDraft.delete([@draft.id, @empty_draft.id, @partial_draft.id])
    end

    it 'makes a related url from the url' do
      expect(Draft.find(@draft.id).draft['RelatedURLs']).to eq([{
              'Description' => 'Description of primary url',
              'URLContentType' => 'DistributionURL',
              'Type' => 'GET SERVICE',
              'Subtype' => 'SUBSETTER',
              'URL' => 'httpx://testurl.earthdata.nasa.gov'
            }])
    end

    it 'adjusts use constraints back to a single field' do
      expect(Draft.find(@draft.id).draft['UseConstraints']).to eq('LicenseText Text')
    end

    it 'creates contact information from an online resource' do
      Draft.find(@draft.id).draft['ServiceOrganizations'].each do |organization|
        expect(organization.keys.include?('OnlineResource')).to eq(false)
      end
      expect(Draft.find(@draft.id).draft['ServiceOrganizations'][1]['ContactInformation'])
        .to eq('RelatedUrls' =>
          [{
            'Description' => 'ORD Text',
            'URL' => 'ORL Text',
            'Type' => 'HOME PAGE',
            'URLContentType' => 'DataCenterURL'
          }]
        )
    end

    it 'adjusts crs identifiers to not have the prepended tag' do
      expect(Draft.find(@draft.id).draft['OperationMetadata'][0]['CoupledResource']['DataResource']['DataResourceSpatialExtent']['GeneralGrid']['CRSIdentifier']).to eq('26917')
    end

    it 'validates new operation names are removed' do
      expect(Draft.find(@draft.id).draft['OperationMetadata'][0]['OperationName']).to eq(nil)
    end

    it 'validates projection authorities' do
      expect(Draft.find(@draft.id).draft['ServiceOptions']['SupportedInputProjections']).to eq(@draft.draft['ServiceOptions']['SupportedInputProjections'])
      expect(Draft.find(@draft.id).draft['ServiceOptions']['SupportedOutputProjections']).to eq([
        {
          'ProjectionName' => 'Geographic',
          'ProjectionLatitudeOfCenter' => 10.0,
          'ProjectionLongitudeOfCenter' => 10.0,
          'ProjectionFalseEasting' => 10.0,
          'ProjectionFalseNorthing' => 10.0,
          'ProjectionAuthority' => '4326',
          'ProjectionUnit' => 'Degrees',
          'ProjectionDatumName' => 'World Geodetic System (WGS) 1984'
        },
        {
          'ProjectionName' => 'NAD83 / UTM zone 17N',
          'ProjectionLatitudeOfCenter' => 10.0,
          'ProjectionLongitudeOfCenter' => 10.0,
          'ProjectionFalseEasting' => 10.0,
          'ProjectionFalseNorthing' => 10.0,
          'ProjectionUnit' => 'Meters',
          'ProjectionDatumName' => 'North American Datum (NAD) 1983'
        }
      ])
    end
    
    it 'removes zarr from formats' do
      expect(Draft.find(@draft.id).draft['ServiceOptions']['SupportedOutputFormats']).to eq(['HDF-EOS2', 'HDF-EOS5'])
      expect(Draft.find(@draft.id).draft['ServiceOptions']['SupportedInputFormats']).to eq(['HDF-EOS2', 'HDF-EOS5'])
    end

    it 'removes supported reformattings' do
      expect(Draft.find(@draft.id).draft['ServiceOptions'].keys.include?('SupportedReformattings')).to eq(false)
    end

    it 'adjusts service type' do
      expect(Draft.find(@draft.id).draft['Type']).to eq('WMS')
    end

    it 'does not modify emptry drafts' do
      expect(Draft.find(@empty_draft.id).draft.keys.blank?).to eq(true)
    end
  end
end