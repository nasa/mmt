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
end
