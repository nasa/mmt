describe 'Service Drafts Descriptive Keywords Form', js: true do
  before do
    login
    draft = create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first)
    visit edit_service_draft_path(draft, 'descriptive_keywords')
    click_on 'Expand All'
  end

  context 'when viewing the form with no values' do
    it 'displays the correct title' do
      within 'header .collection-basics > h2' do
        expect(page).to have_content('Descriptive Keywords')
      end
    end

    it 'displays the form title in the breadcrumbs' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Service Drafts')
        expect(page).to have_content('Descriptive Keywords')
      end
    end

    it 'displays the correct sections' do
      within '.umm-form' do
        expect(page).to have_css('.eui-accordion__header > h3', text: 'Service Keywords')
        expect(page).to have_css('.eui-accordion__header > h3', text: 'Ancillary Keywords')
      end
    end

    it 'does not display required icons for accordions on the Descriptive Keywords form' do
      expect(page).to have_css('h3.eui-required-o.always-required', count: 1)
    end

    it 'displays the correct number of required fields' do
      expect(page).to have_css('label.eui-required-o', count: 1)
    end

    it 'displays the correct buttons to add another element' do
      expect(page).to have_selector(:link_or_button, 'Add another Ancillary Keyword')
    end
  end

  context 'when filling out the form' do
    before do
      choose_keyword 'EARTH SCIENCE SERVICES'
      choose_keyword 'DATA ANALYSIS AND VISUALIZATION'
      choose_keyword 'GEOGRAPHIC INFORMATION SYSTEMS'
      choose_keyword 'MOBILE GEOGRAPHIC INFORMATION SYSTEMS'
      choose_keyword 'DESKTOP GEOGRAPHIC INFORMATION SYSTEMS'
      click_on 'Add Keyword'

      within '#ancillary-keywords' do
        within '.multiple-item-0' do
          find('input').set 'Ancillary keyword 1'
          click_on 'Add another Ancillary Keyword'
        end
        within '.multiple-item-1' do
          find('input').set 'Ancillary keyword 2'
        end
      end
    end

    context "when clicking 'Save' to save the form" do
      before do
        within '.nav-top' do
          click_on 'Save'
        end

        click_on 'Expand All'
      end

      it 'saves the values, displays a confirmation message, and repopulates the form' do
        expect(page).to have_content('Service Draft Updated Successfully!')

        within '.selected-service-keywords' do
          expect(page).to have_content 'EARTH SCIENCE SERVICES > DATA ANALYSIS AND VISUALIZATION > GEOGRAPHIC INFORMATION SYSTEMS > DESKTOP GEOGRAPHIC INFORMATION SYSTEMS'
        end

        expect(page).to have_field('service_draft_draft_ancillary_keywords_0', with: 'Ancillary keyword 1')
        expect(page).to have_field('service_draft_draft_ancillary_keywords_1', with: 'Ancillary keyword 2')
      end

      # TODO: commenting out because this is failing due to bug MMT-2269
      # uncomment this test when that bug is fixed.
      # it 'displays the correct number of required fields' do
      #   expect(page).to have_selector('label.eui-required-o', count: 1)
      # end
    end
  end
end
