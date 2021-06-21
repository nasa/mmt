describe 'Service Drafts Service Quality form', js: true do
  before do
    login
    draft = create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first)
    visit edit_service_draft_path(draft, 'service_quality')
  end

  context 'when viewing the form with no values' do
    it 'displays the correct title' do
      within 'header .collection-basics > h2' do
        expect(page).to have_content('Service Quality')
      end
    end

    it 'displays the form title in the breadcrumbs' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Service Drafts')
        expect(page).to have_content('Service Quality')
      end
    end

    it 'displays the correct sections' do
      within '.umm-form' do
        expect(page).to have_css('.eui-accordion__header > h3', text: 'Service Quality')
      end
    end

    it 'does not display required icons for accordions on the Service Constraints form' do
      expect(page).to have_no_css('h3.eui-required-o.always-required')
    end

    it 'displays the correct number of required fields' do
      expect(page).to have_no_selector('label.eui-required-o')
    end

    it 'displays the correct prompt value for all select elements' do
      within '.umm-form' do
        expect(page).to have_select('service_draft_draft_service_quality_quality_flag', selected: ['Select a Quality Flag'])
      end
    end
  end

  context 'when filling out the form' do
    before do
      select 'Reviewed', from: 'Quality Flag'
      fill_in 'Traceability', with: 'traceability'
      fill_in 'Lineage', with: 'lineage'
    end

    context "when clicking 'Save' to save the form" do
      before do
        within '.nav-top' do
          click_on 'Save'
        end
      end

      it 'displays the correct number of required fields' do
        expect(page).to have_selector('label.eui-required-o', count: 1)
      end

      it 'saves the values, displays a confirmation message, and repopulates the form' do
        expect(page).to have_content('Service Draft Updated Successfully!')

        expect(page).to have_field('Quality Flag', with: 'Reviewed')
        expect(page).to have_field('Traceability', with: 'traceability')
        expect(page).to have_field('Lineage', with: 'lineage')
      end
    end
  end
end
