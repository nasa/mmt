# MMT-295

# View specs are described here: https://robots.thoughtbot.com/how-we-test-rails-applications#view-specs

require 'rails_helper'
include DraftsHelper

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
            {"Scope"=>"METADATA"},
            # Regular object populating
            {"Scope"=>"METADATA",
             "Date"=>[{"Type"=>"CREATE", "Date"=>"2010-12-25", "Description"=>"test 1 Description",
                       "Responsibility"=>[{"Role"=>"RESOURCEPROVIDER",
                                           "Party"=>{"Person"=>{"FirstName"=>"test 1 FirstName", "MiddleName"=>"test 1 MiddleName", "LastName"=>"test 1 LastName"},
                                                     "ServiceHours"=>"test 1 ServiceHours",
                                                     "ContactInstructions"=>"test 1 ContactInstructions",
                                                     "Contact"=>[{"Type"=>"test 1 Type", "Value"=>"test 1 Value"}, {"Type"=>"test 1b Type", "Value"=>"test 1b Value"}],
                                                     "Address"=>[{"StreetAddress"=>["test 1 123", "test 1 4321"],
                                                                  "City"=>"test 1 City", "StateProvince"=>"test 1 StateProvince",
                                                                  "PostalCode"=>"test 1 PostalCode", "Country"=>"test 1 Country"},
                                                                 {"StreetAddress"=>["test 1b 123", "test 1b 4321"],
                                                                  "City"=>"test 1b City", "StateProvince"=>"test 1b StateProvince",
                                                                  "PostalCode"=>"test 1b PostalCode", "Country"=>"test 1b Country"}],
                                                     "RelatedUrl"=>[{"URL"=>["test 1 URL"], "Description"=>"test 1 Description", "Protocol"=>"HTTP",
                                                                     "MimeType"=>"test 1 MimeType", "Caption"=>"test 1 Caption", "Title"=>"test 1 Title",
                                                                     "FileSize"=>{"Size"=>"test 1 123", "Unit"=>"test 1 Unit"},
                                                                     "ContentType"=>{"Type"=>"test 1 Type", "Subtype"=>"test 1 Subtype"}}]}},
                                          {"Role"=>"POINTOFCONTACT",
                                           "Party"=>{"Person"=>{"FirstName"=>"test 2 FirstName", "MiddleName"=>"test 2 MiddleName", "LastName"=>"test 2 LastName"},
                                                     "OrganizationName"=>{'ShortName'=>'test 2 ShortName', 'LongName'=>'test 2 LongName'},
                                                     "ServiceHours"=>"test 2 ServiceHours",
                                                     "ContactInstructions"=>"test 2 ContactInstructions",
                                                     "Contact"=>[{"Type"=>"test 2 Type", "Value"=>"test 2 Value"}, {"Type"=>"test 2b Type", "Value"=>"test 2b Value"}],
                                                     "Address"=>[{"StreetAddress"=>["test 2 123", "test 2 4321"],
                                                                  "City"=>"test 2 City", "StateProvince"=>"test 2 StateProvince",
                                                                  "PostalCode"=>"test 2 PostalCode", "Country"=>"test 2 Country"},
                                                                 {"StreetAddress"=>["test 2b 123", "test 2b 4321"],
                                                                  "City"=>"test 2b City", "StateProvince"=>"test 2b StateProvince",
                                                                  "PostalCode"=>"test 2b PostalCode", "Country"=>"test 2b Country"}],
                                                     "RelatedUrl"=>[{"URL"=>["test 2 URL"], "Description"=>"test 2 Description", "Protocol"=>"HTTP",
                                                                     "MimeType"=>"test 2 MimeType", "Caption"=>"test 2 Caption", "Title"=>"test 2 Title",
                                                                     "FileSize"=>{"Size"=>"test 2 123", "Unit"=>"test 2 Unit"},
                                                                     "ContentType"=>{"Type"=>"test 2 Type", "Subtype"=>"test 2 Subtype"}}]}}
                       ]}]}
        ]

        assign(:draft, build(:draft, draft: draft_json))
        render
      end

      it 'shows the values in the correct places and formats in the draft preview page' do
        rendered_node = Capybara.string(rendered)
#puts rendered.gsub(/\s+/, " ").strip
        check_section_for_display_of_values(rendered_node.find(".#{name_to_class('MetadataLanguage')}"), draft_json['MetadataLanguage'], 'MetadataLanguage')
        check_section_for_display_of_values(rendered_node.find(".#{name_to_class('MetadataStandard')}"), draft_json['MetadataStandard'], 'MetadataStandard')

        draft_json['MetadataLineage'].each_with_index do |metadata_lineage, index|
          check_section_for_display_of_values(rendered_node.find(".#{name_to_class('MetadataLineage')}-#{index}"), metadata_lineage, 'MetadataLineage',
                                              {Role: :handle_as_role, Scope: :handle_as_invisible, Type: :handle_as_date_type})
        end

      end

    end

  end

end


