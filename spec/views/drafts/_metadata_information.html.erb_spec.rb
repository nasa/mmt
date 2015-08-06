# MMT-295

# View specs are described here: https://robots.thoughtbot.com/how-we-test-rails-applications#view-specs

require 'rails_helper'

describe 'drafts/previews/_metadata_information.html.erb', type: :view do
  context 'when the metadata information' do
    context 'is empty' do
      before do
        assign(:draft, build(:draft, draft: {}))
        render
      end

      it 'does not crash or have Metadata Information' do
        expect(rendered).to have_content('Metadata Information')
        expect(rendered).to_not have_content('Metadata Language')
        expect(rendered).to_not have_content('Metadata Standard')
        expect(rendered).to_not have_content('Metadata Dates')
      end
    end

    context 'is populated' do
      draft_json = {}
      before do
        draft_json['MetadataLanguage'] = 'English'
        draft_json['MetadataStandard'] = {Name:'test name', Version:'test version'}

        draft_json['MetadataLineage'] = [
            # minimal object populating
            {},
            {MetadataLineage:[]},
            # Regular object populating
        ]

        # {"Scope"=>"METADATA", "Date"=>[{"Type"=>"CREATE", "Date"=>"2010-01-01", "Description"=>"test", "Responsibility"=>[{"Role"=>"RESOURCEPROVIDER", "Party"=>{"Person"=>{"FirstName"=>"x", "MiddleName"=>"y", "LastName"=>"z"}, "ServiceHours"=>"342", "ContactInstructions"=>"phone", "Contact"=>[{"Type"=>"432", "Value"=>"234"}], "Address"=>[{"StreetAddress"=>["123", "4321"], "City"=>"asdf", "StateProvince"=>"asdf", "PostalCode"=>"asdf", "Country"=>"asdf"}], "RelatedUrl"=>[{"URL"=>["fds"], "Description"=>"fds", "Protocol"=>"HTTP", "MimeType"=>"fds", "Caption"=>"fds", "Title"=>"fsd", "FileSize"=>{"Size"=>"123", "Unit"=>"fds"}, "ContentType"=>{"Type"=>"fds", "Subtype"=>"sdf"}}]}}]}]}
=begin
        draft_json['RelatedUrl'] = [
            # minimal object populating
            {},
            {URL:[]},
            # Regular object populating
            {Description: 'test 1 Description',Protocol: 'test 1 Protocol',URL: ['test 1a URL', 'test 1b URL'],Title:'test 1 Title',MimeType:'test 1 MimeType',Caption:'test 1 Caption',
             FileSize:{Size: 'test 1 FileSize Size', Unit: 'test 1 FileSize Unit'}, ContentType: {Type: 'test 1 ContentType Type', Subtype: 'test 1 ContentType Subtype'}},
            {Description: 'test 2 Description',Protocol: 'test 2 Protocol',Title:'test 2 Title',MimeType:'test 2 MimeType',Caption:'test 2 Caption',
             FileSize:{Size: 'test 2 FileSize Size', Unit: 'test 2 FileSize Unit'}, ContentType: {Type: 'test 2 ContentType Type', Subtype: 'test 2 ContentType Subtype'}}
        ]
        draft_json['Distribution'] = [
            {},
            {DistributionMedia:'test 2 DistributionMedia',DistributionSize:'test 2 DistributionSize',DistributionFormat:'test 2 DistributionFormat', Fees:'bad fee amount'},
            {DistributionMedia:'test 1 DistributionMedia',DistributionSize:'test 1 DistributionSize',DistributionFormat:'test 1 DistributionFormat', Fees:test_fee}
        ]
=end
        assign(:draft, build(:draft, draft: draft_json))
        render
      end

      it 'shows the values in the correct places and formats in the draft preview page' do
        rendered_node = Capybara.string(rendered)

        check_section_for_display_of_values(rendered_node.find(".MetadataLanguage"), draft_json['MetadataLanguage'], nil)
        check_section_for_display_of_values(rendered_node.find(".MetadataStandard"), draft_json['MetadataStandard'], nil)

        draft_json['MetadataLineage'].each_with_index do |metadata_lineage, index|
          check_section_for_display_of_values(rendered_node.find(".metadata_lineage-#{index}"), metadata_lineage, nil)
        end

      end

    end

  end

end


