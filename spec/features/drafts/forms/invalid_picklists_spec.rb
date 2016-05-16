require 'rails_helper'

describe 'Invalid picklists', js: true do
  before do
    login
    draft = create(:draft_invalid_picklists, user: User.where(urs_uid: 'testuser').first)
    visit draft_path(draft)
  end

  context 'when viewing the progress circles' do
    it 'displays an invalid icon for Metadata Language' do
      within '.metadata #metadata-information' do
        expect(page).to have_link('Metadata Language - Invalid')
      end
    end

    it 'displays an invalid icon for Data Language' do
      within '.metadata #collection-information' do
        expect(page).to have_link('Data Language - Invalid')
      end
    end

    it 'displays an invalid icon for Processing Level ID' do
      within '.metadata #data-identification' do
        expect(page).to have_link('Processing Level - Invalid')
      end
    end

    it 'displays an invalid icon for Organizations' do
      within '.metadata #organizations' do
        expect(page).to have_link('Organizations - Invalid')
      end
    end

    it 'displays an invalid icon for Personnel' do
      within '.metadata #personnel' do
        expect(page).to have_link('Personnel - Invalid')
      end
    end

    it 'displays an invalid icon for Related Urls' do
      within '.metadata #distribution-information' do
        expect(page).to have_link('Related Urls - Invalid')
      end
    end

    it 'displays an invalid icon for Distributions' do
      within '.metadata #distribution-information' do
        expect(page).to have_link('Distributions - Invalid')
      end
    end

    it 'displays an invalid icon for Spatial Extent' do
      within '.metadata #spatial-information' do
        expect(page).to have_link('Spatial Extent - Invalid')
      end
    end

    it 'displays an invalid icon for Platforms' do
      within '.metadata #acquisition-information' do
        expect(page).to have_link('Platforms - Invalid')
      end
    end

    it 'displays an invalid icon for Temporal Keywords' do
      within '.metadata #temporal-information' do
        expect(page).to have_link('Temporal Keywords - Invalid')
      end
    end
  end

  context 'when viewing the Metadata Language field' do
    before do
      within '.metadata' do
        click_on 'Metadata Information'
      end

      open_accordions
    end

    it 'displays a summary error' do
      within '.summary-errors' do
        expect(page).to have_content('Metadata Language value [english] does not match a valid selection option')
      end
    end

    it 'displays an inline error' do
      within '#metadata-language' do
        expect(page).to have_content('Metadata Language value [english] does not match a valid selection option')
      end
    end

    it 'displays an unselectable invalid option' do
      within '.metadata_language-select' do
        expect(page).to have_css('option[disabled][selected]', text: 'english')
      end
    end
  end

  context 'when viewing the Data Language field' do
    before do
      within '.metadata' do
        click_on 'Collection Information'
      end

      open_accordions
    end

    it 'displays a summary error' do
      within '.summary-errors' do
        expect(page).to have_content('Data Language value [english] does not match a valid selection option')
      end
    end

    it 'displays an inline error' do
      within '#collection-information' do
        expect(page).to have_content('Data Language value [english] does not match a valid selection option')
      end
    end

    it 'displays an unselectable invalid option' do
      within '.data_language-select' do
        expect(page).to have_css('option[disabled][selected]', text: 'english')
      end
    end

    context 'when creating another error on the page' do
      before do
        fill_in 'Short Name', with: ''
      end

      it 'displays both summary errors' do
        within '.summary-errors' do
          expect(page).to have_content('Short Name is required')
          expect(page).to have_content('Data Language value [english] does not match a valid selection option')
        end
      end

      it 'displays both inline errors' do
        within '#collection-information' do
          expect(page).to have_content('Short Name is required')
          expect(page).to have_content('Data Language value [english] does not match a valid selection option')
        end
      end
    end
  end

  context 'when viewing the Processing Level Id field' do
    before do
      within '.metadata' do
        click_on 'Data Identification'
      end

      open_accordions
    end

    it 'displays a summary error' do
      within '.summary-errors' do
        expect(page).to have_content('ID value [1A] does not match a valid selection option')
      end
    end

    it 'displays an inline error' do
      within '#processing-level' do
        expect(page).to have_content('ID value [1A] does not match a valid selection option')
      end
    end

    it 'displays an unselectable invalid option' do
      within '.id-select' do
        expect(page).to have_css('option[disabled][selected]', text: '1A')
      end
    end
  end

  context 'when viewing the Organizations Short Name and Address fields' do
    before do
      within '.metadata' do
        click_on 'Organizations'
      end

      open_accordions
    end

    it 'displays a summary error' do
      within '.summary-errors' do
        expect(page).to have_content('Short Name value [short_name] does not match a valid selection option')
        expect(page).to have_content('Country value [usa] does not match a valid selection option')
      end
    end

    it 'displays an inline error' do
      within '.organization-name' do
        expect(page).to have_content('Short Name value [short_name] does not match a valid selection option')
      end
      within '.multiple.addresses > .multiple-item-0' do
        expect(page).to have_content('Country value [usa] does not match a valid selection option')
      end
    end

    it 'displays an unselectable invalid option' do
      within '.organization-short-name-select' do
        expect(page).to have_css('option[disabled][selected]', text: 'short_name')
      end
      within '.multiple.addresses > .multiple-item-0 .country-select' do
        expect(page).to have_css('option[disabled][selected]', text: 'usa')
      end
    end
  end

  context 'when viewing the Personnel Address field' do
    before do
      within '.metadata' do
        click_on 'Personnel'
      end

      open_accordions
    end

    it 'displays a summary error' do
      within '.summary-errors' do
        expect(page).to have_content('Country value [usa] does not match a valid selection option')
      end
    end

    it 'displays an inline error' do
      within '.multiple.addresses > .multiple-item-0' do
        expect(page).to have_content('Country value [usa] does not match a valid selection option')
      end
    end

    it 'displays an unselectable invalid option' do
      within '.multiple.addresses > .multiple-item-0 .country-select' do
        expect(page).to have_css('option[disabled][selected]', text: 'usa')
      end
    end
  end

  context 'when viewing the Distribution Information form' do
    before do
      within '.metadata' do
        click_on 'Distribution Information'
      end

      open_accordions
    end

    it 'displays a summary error' do
      within '.summary-errors' do
        expect(page).to have_content('Mime Type value [badmimetype] does not match a valid selection option')
        expect(page).to have_content('Unit value [bits] does not match a valid selection option', count: 2)
      end
    end

    it 'displays an inline error' do
      within '.related-urls' do
        expect(page).to have_content('Mime Type value [badmimetype] does not match a valid selection option')
        expect(page).to have_content('Unit value [bits] does not match a valid selection option')
      end
      within '.distributions' do
        expect(page).to have_content('Unit value [bits] does not match a valid selection option')
      end
    end

    it 'displays an unselectable invalid option' do
      within '.multiple.related-urls > .multiple-item-0 .mime_type-select' do
        expect(page).to have_css('option[disabled][selected]', text: 'badmimetype')
      end
      within '.multiple.related-urls > .multiple-item-1 .unit-select' do
        expect(page).to have_css('option[disabled][selected]', text: 'bits')
      end
      within '.distributions .unit-select' do
        expect(page).to have_css('option[disabled][selected]', text: 'bits')
      end
    end
  end

  context 'when viewing the Platform Type field' do
    before do
      within '.metadata' do
        click_on 'Acquisition Information'
      end

      open_accordions
    end

    it 'displays a summary error' do
      within '.summary-errors' do
        expect(page).to have_content('Type value [satellites] does not match a valid selection option')
      end
    end

    it 'displays an inline error' do
      within '.platforms' do
        expect(page).to have_content('Type value [satellites] does not match a valid selection option')
      end
    end

    it 'displays an unselectable invalid option' do
      within '.type-select' do
        expect(page).to have_css('option[disabled][selected]', text: 'satellites')
      end
    end
  end

  context 'when viewing the Granule Spatial Representation field' do
    before do
      within '.metadata' do
        click_on 'Spatial Information', match: :first
      end

      open_accordions
    end

    it 'displays a summary error' do
      within '.summary-errors' do
        expect(page).to have_content('Granule Spatial Representation value [cartesian] does not match a valid selection option')
      end
    end

    it 'displays an inline error' do
      within '.spatial-extent' do
        expect(page).to have_content('Granule Spatial Representation value [cartesian] does not match a valid selection option')
      end
    end

    it 'displays an unselectable invalid option' do
      within '.granule_spatial_representation-select' do
        expect(page).to have_css('option[disabled][selected]', text: 'cartesian')
      end
    end
  end

  context 'when viewing the Temporal Keywords field' do
    context 'when the Temporal Keywords field has multiple invalid options' do
      before do
        within '.metadata' do
          click_on 'Temporal Information'
        end

        open_accordions
      end

      it 'displays a summary error' do
        within '.summary-errors' do
          expect(page).to have_content('Temporal Keywords values [Keyword 2, Keyword 1] do not match a valid selection option')
        end
      end

      it 'displays an inline error' do
        within '#temporal-keywords' do
          expect(page).to have_content('Temporal Keywords values [Keyword 2, Keyword 1] do not match a valid selection option')
        end
      end

      it 'displays an unselectable invalid option' do
        within '.temporal_keywords-select' do
          expect(page).to have_css('option[disabled][selected]', text: 'Keyword 1')
          expect(page).to have_css('option[disabled][selected]', text: 'Keyword 2')
        end
      end
    end

    context 'when the Temporal Keywords field only has one invalid option' do
      before do
        draft = Draft.first
        draft_metadata = draft.draft
        draft_metadata['TemporalKeywords'] = ['Keyword 1']
        draft.draft = draft_metadata
        draft.save

        within '.metadata' do
          click_on 'Temporal Information'
        end

        open_accordions
      end

      it 'displays a summary error' do
        within '.summary-errors' do
          expect(page).to have_content('Temporal Keywords value [Keyword 1] does not match a valid selection option')
        end
      end

      it 'displays an inline error' do
        within '#temporal-keywords' do
          expect(page).to have_content('Temporal Keywords value [Keyword 1] does not match a valid selection option')
        end
      end

      it 'displays an unselectable invalid option' do
        within '.temporal_keywords-select' do
          expect(page).to have_css('option[disabled][selected]', text: 'Keyword 1')
        end
      end
    end
  end
end
