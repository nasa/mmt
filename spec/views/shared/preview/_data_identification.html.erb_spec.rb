# MMT-293

# View specs are described here: https://robots.thoughtbot.com/how-we-test-rails-applications#view-specs

require 'rails_helper'
include DraftsHelper

template_path = 'shared/preview/_data_identification.html.erb'

describe template_path, type: :view do
  context 'when the data identification data' do
    before do
      assign :language_codes, 'English' => 'eng'
    end

    context 'is empty' do
      before do
        assign :draft, build(:draft, draft: {}).draft
        render template: template_path, locals: { metadata: {} }
      end

      it 'does not crash or have data identification data' do
        expect(rendered).to have_content('Data Identification')
        expect(rendered).to have_content('Processing Level')
        expect(rendered).to_not have_content('Abstract')
      end
    end

    context 'is populated' do
      draft_json = {}
      before do
        full_draft = build(:full_draft).draft

        draft_json['EntryId'] = full_draft['EntryId']
        draft_json['Version'] = full_draft['Version']
        draft_json['EntryTitle'] = full_draft['EntryTitle']
        draft_json['Abstract'] = full_draft['Abstract']
        draft_json['Purpose'] = full_draft['Purpose']
        draft_json['DataLanguage'] = full_draft['DataLanguage']
        draft_json['DataDates'] = full_draft['DataDates']
        draft_json['Organizations'] = full_draft['Organizations']
        draft_json['Personnel'] = full_draft['Personnel']
        draft_json['CollectionDataType'] = full_draft['CollectionDataType']
        draft_json['ProcessingLevel'] = full_draft['ProcessingLevel']
        draft_json['CollectionCitations'] = full_draft['CollectionCitations']
        draft_json['CollectionProgress'] = full_draft['CollectionProgress']
        draft_json['Quality'] = full_draft['Quality']
        draft_json['UseConstraints'] = full_draft['UseConstraints']
        draft_json['AccessConstraints'] = full_draft['AccessConstraints']
        draft_json['MetadataAssociations'] = full_draft['MetadataAssociations']
        draft_json['PublicationReferences'] = full_draft['PublicationReferences']

        assign :metadata, draft_json
        render template: template_path, locals: { metadata: draft_json }
      end

      it 'shows the values in the correct places and formats in the draft preview page' do
        rendered_node = Capybara.string(rendered)
        root_css_path = 'ul.data-identification-preview'
        draft_json.each do |key, value|
          check_css_path_for_display_of_values(rendered_node, value, key, root_css_path, { Scope: :handle_as_not_shown, Type: :handle_as_date_type, Role: :handle_as_role, CollectionDataType: :handle_as_collection_data_type, CollectionProgress: :handle_as_collection_progress, DataLanguage: :handle_as_language_code }, true)
        end

        # Example of how to test a section directly
        # check_css_path_for_display_of_values(rendered_node, draft_json['EntryId'], 'EntryId', root_css_path)
      end
    end
  end
end
