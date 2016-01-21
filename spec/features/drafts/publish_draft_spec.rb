# MMT-51

require 'rails_helper'
include DraftsHelper
include ActionView::Helpers::NumberHelper

describe 'Publishing draft records', js: true, reset_provider: true do
  context 'when publishing a draft record' do
    before do
      login
      draft = create(:full_draft, user: User.where(urs_uid: 'testuser').first)
      visit draft_path(draft)
      click_on 'Publish'
      open_accordions
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Draft was successfully published')
    end

    it 'displays the published record page' do
      expect(page).to have_content 'PUBLISHED RECORD'
    end

    it 'displays the published metadata' do
      # runs through entire draft and makes sure all data is present on page
      draft = Draft.first.draft
      root_css_path = 'div.preview-collection > div.accordion-body > ul'
      options = {
        DataLanguage: :handle_as_language_code,
        Scope: :handle_as_not_shown,
        Type: :handle_as_date_type,
        Role: :handle_as_role,
        CollectionDataType: :handle_as_collection_data_type,
        CollectionProgress: :handle_as_collection_progress,
        ISOTopicCategories: :handle_as_iso_topic_categories,
        DataType: :handle_as_data_type,
        Fees: :handle_as_currency,
        MetadataLanguage: :handle_as_language_code,
        CoordinateSystem: :handle_as_coordinate_system_type,
        SpatialCoverageType: :handle_as_spatial_coverage_type,
        GranuleSpatialRepresentation: :handle_as_granule_spatial_representation,
        DurationUnit: :handle_as_duration,
        PeriodCycleDurationUnit: :handle_as_duration
      }
      draft.each do |key, value|
        check_css_path_for_display_of_values(page, value, key, root_css_path, options, true)
      end
    end

    context 'when searching for the published record' do
      before do
        fill_in 'Quick Find', with: '12345'
        click_on 'Find'
      end

      it 'displays the new published record in search results' do
        expect(page).to have_content('12345')
        expect(page).to have_content('Draft Title')
        expect(page).to have_content(today_string)
      end
    end
  end

  context 'when publishing an incomplete record' do
    before do
      login
      draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
      visit draft_path(draft)
      click_on 'Publish'
    end

    it 'displays a message to the user' do
      message = 'This draft is not ready to be published. Please use the progress indicators on the draft preview page to address incomplete or invalid fields.'
      expect(page).to have_content(message)
    end
  end

  context 'when publishing a draft that passes schema validation but CMR rejects with errors' do
    before do
      login
      draft = create(:full_draft)
      visit draft_path(draft)

      # Cause some errors that CMR will reject
      within '.metadata' do
        click_on 'Spatial Information'
      end
      open_accordions

      select 'Orbit', from: 'Granule Spatial Representation'

      within '.nav-top' do
        click_on 'Save & Done'
      end

      click_on 'Publish'
    end

    it 'does not publish the draft' do
      expect(page).to have_content('Draft was not published successfully')
    end

    it 'displays the error received from CMR' do
      expect(page).to have_content('SpatialCoverage, Orbit Parameters must be defined for a collection whose granule spatial representation is ORBIT.')
    end
  end

  context 'when publishing a draft and CMR returns a 500 error' do
    before do
      login
      draft = create(:full_draft)
      visit draft_path(draft)

      # Adding question marks to token causes a 500 error for now
      bad_response = { 'Echo-Token' => '???' }
      allow_any_instance_of(Cmr::BaseClient).to receive(:token_header).and_return(bad_response)

      # Record the request so we can keep testing for 500 errors
      VCR.configure do |c|
        c.ignore_localhost = false
      end

      VCR.use_cassette('ingest/500_error', record: :none) do
        click_on 'Publish'
      end

      VCR.configure do |c|
        c.ignore_localhost = true
      end
    end

    it 'displays a link to submit feedback' do
      recorded_request_id = 'a037669d-c94e-45d1-838c-707b884245ab'

      expect(page).to have_link('Click here to submit feedback')
      expect(page).to have_xpath("//a[contains(@href,'#{recorded_request_id}')]")
    end
  end
end
