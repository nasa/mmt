# MMT-293

# View specs are described here: https://robots.thoughtbot.com/how-we-test-rails-applications#view-specs

require 'rails_helper'
include DraftsHelper

template_path = 'drafts/previews/_data_identification.html.erb'


describe template_path, type: :view do
  context 'when the data identification data' do
    context 'is empty' do
      before do
        assign(:draft, build(:draft, draft: {}))
        render :template => template_path, :locals=>{draft: {}}
      end

      it 'does not crash or have data identification data' do
        expect(rendered).to have_content('Data Identification')
        expect(rendered).to_not have_content('Processing Level')
        expect(rendered).to_not have_content('Abstract')
      end
    end

    context 'is populated' do
      draft_json = {}
      before do

        draft_json =
            {"Abstract"=>"This is a long description of the collection",

             "EntryId"=>{"Id"=>"12345", "Version"=>"1", "Authority"=>"Authority"},
             "EntryTitle"=>"Draft Title", "Purpose"=>"This is the purpose field",
             "DataLanguage"=>"English",
             "DataLineage"=>[{"Scope"=>"DATA",
                              "Date"=>[{"Type"=>"CREATE", "Date"=>"2015-07-01", "Description"=>"Create data",
                                        "Responsibility"=>[{"Role"=>"RESOURCEPROVIDER",
                                                            "Party"=>{"OrganizationName"=>{"ShortName"=>"ORG_SHORT", "LongName"=>"Organization Long Name"},
                                                                      "ServiceHours"=>"9-5, M-F",
                                                                      "ContactInstructions"=>"Email only",
                                                                      "Contact"=>[{"Type"=>"Email", "Value"=>"example@example.com"},
                                                                                  {"Type"=>"Email", "Value"=>"example2@example.com"}],
                                                                      "Address"=>[{"StreetAddress"=>["300 E Street Southwest", "Room 203"],
                                                                                   "City"=>"Washington", "StateProvince"=>"DC", "PostalCode"=>"20546", "Country"=>"United States"},
                                                                                  {"StreetAddress"=>["8800 Greenbelt Road"], "City"=>"Greenbelt", "StateProvince"=>"MD", "PostalCode"=>"20771", "Country"=>"United States"}],
                                                                      "RelatedUrl"=>[{"URL"=>["http://example.com", "http://another-example.com"],
                                                                                      "Description"=>"Example Description", "Protocol"=>"FTP", "MimeType"=>"text/html", "Caption"=>"Example Caption", "Title"=>"Example Title",
                                                                                      "FileSize"=>{"Size"=>"42", "Unit"=>"MB"},
                                                                                      "ContentType"=>{"Type"=>"Type", "Subtype"=>"Subtype"}},
                                                                                     {"URL"=>["http://example.com/1"]}]}},
                                                           {"Role"=>"OWNER",
                                                            "Party"=>{"Person"=>{"FirstName"=>"First Name", "MiddleName"=>"Middle Name", "LastName"=>"Last Name"},
                                                                      "ServiceHours"=>"10-2, M-W", "ContactInstructions"=>"Email only",
                                                                      "Contact"=>[{"Type"=>"Email", "Value"=>"example@example.com"},
                                                                                  {"Type"=>"Email", "Value"=>"example2@example.com"}],
                                                                      "Address"=>[{"StreetAddress"=>["300 E Street Southwest", "Room 203"], "City"=>"Washington", "StateProvince"=>"DC", "PostalCode"=>"20546", "Country"=>"United States"},
                                                                                  {"StreetAddress"=>["8800 Greenbelt Road"], "City"=>"Greenbelt", "StateProvince"=>"MD", "PostalCode"=>"20771", "Country"=>"United States"}],
                                                                      "RelatedUrl"=>[{"URL"=>["http://example.com", "http://another-example.com"],
                                                                                      "Description"=>"Example Description", "Protocol"=>"FTP", "MimeType"=>"text/html", "Caption"=>"Example Caption", "Title"=>"Example Title",
                                                                                      "FileSize"=>{"Size"=>"42", "Unit"=>"MB"},
                                                                                      "ContentType"=>{"Type"=>"Type", "Subtype"=>"Subtype"}},
                                                                                     {"URL"=>["http://example.com/1"]}]}}]},
                                       {"Type"=>"REVIEW", "Date"=>"2015-07-02", "Description"=>"Reviewed data",
                                        "Responsibility"=>[{"Role"=>"EDITOR", "Party"=>{"OrganizationName"=>{"ShortName"=>"short_name"}}}]}]},
                             {"Scope"=>"DATA",
                              "Date"=>[{"Type"=>"CREATE", "Date"=>"2016-07-05", "Description"=>"Create data",
                                        "Responsibility"=>[{"Role"=>"USER", "Party"=>{"OrganizationName"=>{"ShortName"=>"another_short_name"}}}]}]}],
             "ResponsibleOrganization"=>[{"Role"=>"RESOURCEPROVIDER", "Party"=>{"OrganizationName"=>{"ShortName"=>"ORG_SHORT 2", "LongName"=>"Organization Long Name 2"},
                                                                                "ServiceHours"=>"9-6, M-F", "ContactInstructions"=>"Email only",
                                                                                "Contact"=>[{"Type"=>"Email", "Value"=>"example@example.com"}, {"Type"=>"Email", "Value"=>"example2@example.com"}],
                                                                                "Address"=>[{"StreetAddress"=>["300 E Street Southwest", "Room 203"], "City"=>"Washington", "StateProvince"=>"DC", "PostalCode"=>"20546", "Country"=>"United States"},
                                                                                            {"StreetAddress"=>["8800 Greenbelt Road"], "City"=>"Greenbelt", "StateProvince"=>"MD", "PostalCode"=>"20771", "Country"=>"United States"}],
                                                                                "RelatedUrl"=>[{"URL"=>["http://example.com", "http://another-example.com"],
                                                                                                "Description"=>"Example Description", "Protocol"=>"FTP", "MimeType"=>"text/html", "Caption"=>"Example Caption 2", "Title"=>"Example Title",
                                                                                                "FileSize"=>{"Size"=>"42", "Unit"=>"MB"},
                                                                                                "ContentType"=>{"Type"=>"Type", "Subtype"=>"Subtype"}}, {"URL"=>["http://example1.com/1"]}]}},
                                         {"Role"=>"OWNER", "Party"=>{"OrganizationName"=>{"ShortName"=>"ORG_SHORT 3", "LongName"=>"Organization Long Name 3"},
                                                                     "ServiceHours"=>"10-2, M-W", "ContactInstructions"=>"Email only", "Contact"=>[{"Type"=>"Email", "Value"=>"example@example.com"},
                                                                                                                                                   {"Type"=>"Email", "Value"=>"example2@example.com"}],
                                                                     "Address"=>[{"StreetAddress"=>["300 E Street Southwest", "Room 203"], "City"=>"Washington", "StateProvince"=>"DC", "PostalCode"=>"20546", "Country"=>"United States"},
                                                                                 {"StreetAddress"=>["8800 Greenbelt Road"], "City"=>"Greenbelt", "StateProvince"=>"MD", "PostalCode"=>"20771", "Country"=>"United States"}],
                                                                     "RelatedUrl"=>[{"URL"=>["http://example.com", "http://another-example.com"],
                                                                                     "Description"=>"Example Description", "Protocol"=>"FTP", "MimeType"=>"text/html", "Caption"=>"Example Caption 3", "Title"=>"Example Title",
                                                                                     "FileSize"=>{"Size"=>"42", "Unit"=>"MB"}, "ContentType"=>{"Type"=>"Type", "Subtype"=>"Subtype"}},
                                                                                    {"URL"=>["http://example2.com/1"]}]}}],
             "ResponsiblePersonnel"=>[{"Role"=>"RESOURCEPROVIDER",
                                       "Party"=>{"Person"=>{"FirstName"=>"First Name", "MiddleName"=>"Middle Name", "LastName"=>"Last Name"},
                                                 "ServiceHours"=>"9-5, M-F", "ContactInstructions"=>"Email only",
                                                 "Contact"=>[{"Type"=>"Email", "Value"=>"example@example.com"},
                                                             {"Type"=>"Email", "Value"=>"example2@example.com"}],
                                                 "Address"=>[{"StreetAddress"=>["300 E Street Southwest", "Room 203"], "City"=>"Washington", "StateProvince"=>"DC", "PostalCode"=>"20546", "Country"=>"United States"},
                                                             {"StreetAddress"=>["8800 Greenbelt Road"], "City"=>"Greenbelt", "StateProvince"=>"MD", "PostalCode"=>"20771", "Country"=>"United States"}],
                                                 "RelatedUrl"=>[{"URL"=>["http://example.com", "http://another-example.com"],
                                                                 "Description"=>"Example Description", "Protocol"=>"FTP", "MimeType"=>"text/html", "Caption"=>"Example Caption", "Title"=>"Example Title",
                                                                 "FileSize"=>{"Size"=>"42", "Unit"=>"MB"},
                                                                 "ContentType"=>{"Type"=>"Type", "Subtype"=>"Subtype"}}, {"URL"=>["http://example.com/1"]}]}},
                                      {"Role"=>"OWNER", "Party"=>{"Person"=>{"FirstName"=>"First Name 2", "MiddleName"=>"Middle Name 2", "LastName"=>"Last Name 2"},
                                                                  "ServiceHours"=>"10-2, M-W", "ContactInstructions"=>"Email only", "Contact"=>[{"Type"=>"Email", "Value"=>"example1@example.com"},
                                                                                                                                                {"Type"=>"Email", "Value"=>"example2@example.com"}], "Address"=>[{"StreetAddress"=>["300 E Street Southwest", "Room 203"], "City"=>"Washington", "StateProvince"=>"DC", "PostalCode"=>"20546", "Country"=>"United States"},
                                                                                                                                                                                                                 {"StreetAddress"=>["8800 Greenbelt Road"], "City"=>"Greenbelt", "StateProvince"=>"MD", "PostalCode"=>"20771", "Country"=>"United States"}],
                                                                  "RelatedUrl"=>[{"URL"=>["http://example.com", "http://another-example.com"],
                                                                                  "Description"=>"Example Description", "Protocol"=>"FTP", "MimeType"=>"text/html", "Caption"=>"Example Caption", "Title"=>"Example Title",
                                                                                  "FileSize"=>{"Size"=>"42", "Unit"=>"MB"}, "ContentType"=>{"Type"=>"Type", "Subtype"=>"Subtype"}},
                                                                                 {"URL"=>["http://example.com/1"]}]}}],
             "CollectionDataType"=>'SCIENCE_QUALITY',
             "ProcessingLevel"=>{"Id"=>"Level 1", "ProcessingLevelDescription"=>"Level 1 Description"},
             "CollectionCitation"=>[{"Version"=>"v1", "Title"=>"Citation title", "Creator"=>"Citation creator", "Editor"=>"Citation editor",
                                     "SeriesName"=>"Citation series name",
                                     "ReleaseDate"=>"2015-07-01T00:00:00Z", "ReleasePlace"=>"Citation release place", "Publisher"=>"Citation publisher",
                                     "IssueIdentification"=>"Citation issue identification", "DataPresentationForm"=>"Citation data presentation form",
                                     "OtherCitationDetails"=>"Citation other details",
                                     "DOI"=>{"DOI"=>"Citation DOI", "Authority"=>"Citation DOI Authority"},
                                     "RelatedUrl"=>{"URL"=>["http://example.com", "http://another-example.com"], "Description"=>"Example Description",
                                                    "Protocol"=>"FTP", "MimeType"=>"text/html", "Caption"=>"Example Caption", "Title"=>"Example related URL Title 1",
                                                    "FileSize"=>{"Size"=>"42", "Unit"=>"MB"},
                                                    "ContentType"=>{"Type"=>"Type", "Subtype"=>"Subtype"}}},
                                    {"Version"=>"v2", "Title"=>"Citation title 1", "Creator"=>"Citation creator 1",
                                     "RelatedUrl"=>{"URL"=>["http://example2.com", "http://another-example2.com"], "Description"=>"Example 2 Description",
                                                    "Protocol"=>"FTP", "MimeType"=>"text/html", "Caption"=>"Example 2 Caption", "Title"=>"Example 2 related URL Title",
                                                    "FileSize"=>{"Size"=>"42", "Unit"=>"MB"}, "ContentType"=>{"Type"=>"Type", "Subtype"=>"Subtype"}}}],
             "CollectionProgress"=>"IN WORK",
             "Quality"=>"Metadata quality summary",
             "UseConstraints"=>"These are some use constraints",
             "AccessConstraints"=>{"Value"=>"Access constraint value", "Description"=>"Access constraint description"},
             "MetadataAssociation"=>[{"Type"=>"SCIENCE ASSOCIATED", "Description"=>"Metadata association description",
                                      "EntryId"=>{"Id"=>"12345", "Version"=>"v1", "Authority"=>"Authority"}, "ProviderId"=>"LPDAAC_ECS"},
                                     {"Type"=>"LARGER CITATION WORKS",
                                      "EntryId"=>{"Id"=>"123abc"},
                                      "ProviderId"=>"ORNL_DAAC"}],
             "PublicationReference"=>[{"Title"=>"Publication reference title", "Publisher"=>"Publication reference publisher",
                                       "DOI"=>{"DOI"=>"Publication reference DOI", "Authority"=>"Publication reference authority"},
                                       "Author"=>"Publication reference author", "PublicationDate"=>"2015-07-01T00:00:00Z",
                                       "Series"=>"Publication reference series", "Edition"=>"Publication reference edition",
                                       "Volume"=>"Publication reference volume", "Issue"=>"Publication reference issue",
                                       "ReportNumber"=>"Publication reference report number", "PublicationPlace"=>"Publication reference publication place",
                                       "Pages"=>"Publication reference pages", "ISBN"=>"1234567890123", "OtherReferenceDetails"=>"Publication reference details",
                                       "RelatedUrl"=>{"URL"=>["http://example.com", "http://another-example.com"], "Description"=>"Example Description", "Protocol"=>"FTP",
                                                      "MimeType"=>"text/html", "Caption"=>"Example Caption", "Title"=>"Example URL Title",
                                                      "FileSize"=>{"Size"=>"42", "Unit"=>"MB"},
                                                      "ContentType"=>{"Type"=>"Type", "Subtype"=>"Subtype"}}},
                                      {"Title"=>"Publication reference title 1", "ISBN"=>"9876543210987"}]}



        assign(:draft, build(:draft, draft: draft_json))
        render :template => template_path, :locals=>{draft: draft_json}
      end

      it 'shows the values in the correct places and formats in the draft preview page' do
        rendered_node = Capybara.string(rendered)
        root_css_path = "ul.data-identification-preview"
        draft_json.each do |key, value|
          check_css_path_for_display_of_values(rendered_node, value, key, root_css_path,
            {Scope: :handle_as_not_shown, Type: :handle_as_date_type, Role: :handle_as_role, CollectionDataType: :handle_as_collection_data_type, CollectionProgress: :handle_as_collection_progress})
        end

        # Example of how to test a section directly
        #check_css_path_for_display_of_values(rendered_node, draft_json['EntryId'], 'EntryId', root_css_path)
      end

    end

  end

end


