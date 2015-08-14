# MMT-293

# View specs are described here: https://robots.thoughtbot.com/how-we-test-rails-applications#view-specs

require 'rails_helper'
include DraftsHelper

describe 'drafts/previews/_data_identification.html.erb', type: :view do
  context 'when the data identification data' do
    context 'is empty' do
      before do
        assign(:draft, build(:draft, draft: {}))
        render
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
                              "Date"=>[{"Type"=>"CREATE", "Date"=>"2015-07-05", "Description"=>"Create data",
                                        "Responsibility"=>[{"Role"=>"USER", "Party"=>{"OrganizationName"=>{"ShortName"=>"another_short_name"}}}]}]}],
             "ResponsibleOrganization"=>[{"Role"=>"RESOURCEPROVIDER", "Party"=>{"OrganizationName"=>{"ShortName"=>"ORG_SHORT", "LongName"=>"Organization Long Name"},
                                                                                "ServiceHours"=>"9-5, M-F", "ContactInstructions"=>"Email only",
                                                                                "Contact"=>[{"Type"=>"Email", "Value"=>"example@example.com"}, {"Type"=>"Email", "Value"=>"example2@example.com"}],
                                                                                "Address"=>[{"StreetAddress"=>["300 E Street Southwest", "Room 203"], "City"=>"Washington", "StateProvince"=>"DC", "PostalCode"=>"20546", "Country"=>"United States"},
                                                                                            {"StreetAddress"=>["8800 Greenbelt Road"], "City"=>"Greenbelt", "StateProvince"=>"MD", "PostalCode"=>"20771", "Country"=>"United States"}],
                                                                                "RelatedUrl"=>[{"URL"=>["http://example.com", "http://another-example.com"],
                                                                                                "Description"=>"Example Description", "Protocol"=>"FTP", "MimeType"=>"text/html", "Caption"=>"Example Caption", "Title"=>"Example Title",
                                                                                                "FileSize"=>{"Size"=>"42", "Unit"=>"MB"},
                                                                                                "ContentType"=>{"Type"=>"Type", "Subtype"=>"Subtype"}}, {"URL"=>["http://example.com/1"]}]}},
                                         {"Role"=>"OWNER", "Party"=>{"OrganizationName"=>{"ShortName"=>"ORG_SHORT", "LongName"=>"Organization Long Name"},
                                                                     "ServiceHours"=>"10-2, M-W", "ContactInstructions"=>"Email only", "Contact"=>[{"Type"=>"Email", "Value"=>"example@example.com"},
                                                                                                                                                   {"Type"=>"Email", "Value"=>"example2@example.com"}],
                                                                     "Address"=>[{"StreetAddress"=>["300 E Street Southwest", "Room 203"], "City"=>"Washington", "StateProvince"=>"DC", "PostalCode"=>"20546", "Country"=>"United States"},
                                                                                 {"StreetAddress"=>["8800 Greenbelt Road"], "City"=>"Greenbelt", "StateProvince"=>"MD", "PostalCode"=>"20771", "Country"=>"United States"}],
                                                                     "RelatedUrl"=>[{"URL"=>["http://example.com", "http://another-example.com"],
                                                                                     "Description"=>"Example Description", "Protocol"=>"FTP", "MimeType"=>"text/html", "Caption"=>"Example Caption", "Title"=>"Example Title",
                                                                                     "FileSize"=>{"Size"=>"42", "Unit"=>"MB"}, "ContentType"=>{"Type"=>"Type", "Subtype"=>"Subtype"}},
                                                                                    {"URL"=>["http://example.com/1"]}]}}],
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
                                      {"Role"=>"OWNER", "Party"=>{"Person"=>{"FirstName"=>"First Name", "MiddleName"=>"Middle Name", "LastName"=>"Last Name"},
                                                                  "ServiceHours"=>"10-2, M-W", "ContactInstructions"=>"Email only", "Contact"=>[{"Type"=>"Email", "Value"=>"example@example.com"},
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
                                     "RelatedUrl"=>{"URL"=>["http://example.com", "http://another-example.com"], "Description"=>"Example Description",
                                                    "Protocol"=>"FTP", "MimeType"=>"text/html", "Caption"=>"Example Caption", "Title"=>"Example related URL Title 2",
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
        render
      end


      it 'shows the values in the correct places and formats in the draft preview page' do
        rendered_node = Capybara.string(rendered)
#puts rendered.gsub(/\s+/, " ").strip

        root_css_path = "ul.data-identification-preview"
        check_fp_for_display_of_values(rendered_node, draft_json['CollectionCitation'], 'CollectionCitation', root_css_path)

        check_fp_for_display_of_values(rendered_node, draft_json['EntryId'], 'EntryId', root_css_path)
        check_fp_for_display_of_values(rendered_node, draft_json['EntryTitle'], 'EntryTitle', root_css_path)
        check_fp_for_display_of_values(rendered_node, draft_json['Abstract'], 'Abstract', root_css_path)
        check_fp_for_display_of_values(rendered_node, draft_json['Purpose'], 'Purpose', root_css_path)
        check_fp_for_display_of_values(rendered_node, draft_json['DataLanguage'], 'DataLanguage', root_css_path)
        check_fp_for_display_of_values(rendered_node, draft_json['DataLineage'], 'DataLineage', root_css_path, {Scope: :handle_as_not_shown, Type: :handle_as_date_type, Role: :handle_as_role})
        check_fp_for_display_of_values(rendered_node, draft_json['ResponsibleOrganization'], 'ResponsibleOrganization', root_css_path, {Role: :handle_as_role})
        check_fp_for_display_of_values(rendered_node, draft_json['ResponsiblePersonnel'], 'ResponsiblePersonnel', root_css_path, {Role: :handle_as_role})
        check_fp_for_display_of_values(rendered_node, draft_json['CollectionDataType'], 'CollectionDataType', root_css_path, {CollectionDataType: :handle_as_collection_data_type})
        check_fp_for_display_of_values(rendered_node, draft_json['ProcessingLevel'], 'ProcessingLevel', root_css_path)
        check_fp_for_display_of_values(rendered_node, draft_json['CollectionCitation'], 'CollectionCitation', root_css_path)
        check_fp_for_display_of_values(rendered_node, draft_json['CollectionProgress'], 'CollectionProgress', root_css_path, {CollectionProgress: :handle_as_collection_progress})
        check_fp_for_display_of_values(rendered_node, draft_json['Quality'], 'Quality', root_css_path)
        check_fp_for_display_of_values(rendered_node, draft_json['UseConstraints'], 'UseConstraints', root_css_path)
        check_fp_for_display_of_values(rendered_node, draft_json['AccessConstraints'], 'AccessConstraints', root_css_path)
        check_fp_for_display_of_values(rendered_node, draft_json['MetadataAssociation'], 'MetadataAssociation', root_css_path)
        #check_fp_for_display_of_values(rendered_node, draft_json['PublicationReference'], 'PublicationReference', root_css_path)


=begin

        check_section_for_display_of_values(rendered_node.first(".#{name_to_class('EntryId')}"), draft_json['EntryId'], 'EntryId') # Replaced "find" with "first" because of ambiguity
        check_section_for_display_of_values(rendered_node.find(".#{name_to_class('EntryTitle')}"), draft_json['EntryTitle'], 'EntryTitle')
        check_section_for_display_of_values(rendered_node.find(".#{name_to_class('Abstract')}"), draft_json['Abstract'], 'Abstract')
        check_section_for_display_of_values(rendered_node.find(".#{name_to_class('Purpose')}"), draft_json['Purpose'], 'Purpose')
        check_section_for_display_of_values(rendered_node.find(".#{name_to_class('DataLanguage')}"), draft_json['DataLanguage'], 'DataLanguage')
        check_section_for_display_of_values(rendered_node.find(".#{name_to_class('DataLineage')}"), draft_json['DataLineage'], 'DataLineage', {Scope: :handle_as_not_shown, Type: :handle_as_date_type, Role: :handle_as_role})
        check_section_for_display_of_values(rendered_node.find(".#{name_to_class('ResponsibleOrganization')}"), draft_json['ResponsibleOrganization'], 'ResponsibleOrganization', {Role: :handle_as_role})
        check_section_for_display_of_values(rendered_node.find(".#{name_to_class('ResponsiblePersonnel')}"), draft_json['ResponsiblePersonnel'], 'ResponsiblePersonnel', {Role: :handle_as_role})
        check_section_for_display_of_values(rendered_node.find(".#{name_to_class('CollectionDataType')}"), draft_json['CollectionDataType'], 'CollectionDataType', {CollectionDataType: :handle_as_collection_data_type})
        check_section_for_display_of_values(rendered_node.find(".#{name_to_class('ProcessingLevel')}"), draft_json['ProcessingLevel'], 'ProcessingLevel')
        #check_section_for_display_of_values(rendered_node.find(".#{name_to_class('CollectionCitation')}"), draft_json['CollectionCitation'], 'CollectionCitation')
        check_section_for_display_of_values(rendered_node.find(".#{name_to_class('CollectionProgress')}"), draft_json['CollectionProgress'], 'CollectionProgress', {CollectionProgress: :handle_as_collection_progress})
        check_section_for_display_of_values(rendered_node.find(".#{name_to_class('Quality')}"), draft_json['Quality'], 'Quality')
        check_section_for_display_of_values(rendered_node.find(".#{name_to_class('UseConstraints')}"), draft_json['UseConstraints'], 'UseConstraints')
        check_section_for_display_of_values(rendered_node.find(".#{name_to_class('AccessConstraints')}"), draft_json['AccessConstraints'], 'AccessConstraints')
        check_section_for_display_of_values(rendered_node.find(".#{name_to_class('MetadataAssociation')}"), draft_json['MetadataAssociation'], 'MetadataAssociation')
        #check_section_for_display_of_values(rendered_node.find(".#{name_to_class('PublicationReference')}"), draft_json['PublicationReference'], 'PublicationReference')
=end
      end

    end

  end

end


