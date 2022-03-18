describe 'Variable Drafts Science Keywords Form', js: true do
  let(:variable_draft) { create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit edit_variable_draft_path(variable_draft, 'science_keywords')
  end

  context 'When viewing the form with no stored values' do
    it 'does not display required icons for accordions in Science Keywords section' do
      expect(page).to have_no_css('h3.eui-required-o.always-required')
    end

    it 'displays the correct title and description' do
      within '.umm-form' do
        expect(page).to have_content('Science Keywords')
        expect(page).to have_content('Controlled Science Keywords describing the measurements/variables. The controlled vocabulary for Science Keywords is maintained in the Keyword Management System (KMS).')
      end
    end

    it 'displays the form title in the breadcrumbs' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Variable Drafts')
        expect(page).to have_content('Science Keywords')
      end
    end

    it 'has 0 required fields' do
      expect(page).to have_no_selector('label.eui-required-o')
    end

    it 'displays the nested item picker' do
      expect(page).to have_css('div.eui-nested-item-picker')
    end

    it 'does not list any selected science keywords' do
      within '.selected-science-keywords ul', visible: :any do
        expect(page).to have_no_css('li')
      end
    end
  end

  context 'when filling out the form' do
    before do
      choose_keyword 'EARTH SCIENCE'
      choose_keyword 'SOLID EARTH'
      choose_keyword 'ROCKS/MINERALS/CRYSTALS'
      click_on 'Add Keyword'

      choose_keyword 'EARTH SCIENCE'
      choose_keyword 'ATMOSPHERE'
      choose_keyword 'ATMOSPHERIC TEMPERATURE'
      click_on 'Add Keyword'
    end

    context 'When clicking `Save` to save the form' do
      before do
        within '.nav-top' do
          click_button 'Save'
        end
      end

      it 'displays 2 selected science keywords' do
        expect(page).to have_css('.selected-science-keywords ul > li', count: 2)
      end

      it 'saves the values, displays a confirmation message, and repopulates the form' do
        expect(page).to have_content('Variable Draft Updated Successfully!')

        within '.selected-science-keywords' do
          expect(page).to have_content('EARTH SCIENCE > SOLID EARTH > ROCKS/MINERALS/CRYSTALS')
          expect(page).to have_content('EARTH SCIENCE > ATMOSPHERE > ATMOSPHERIC TEMPERATURE')
        end
      end
    end
  end
end
