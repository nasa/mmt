describe 'Tool Drafts Tool Organizations Form', js: true do
  before do
    login
    draft = create(:empty_tool_draft, user: User.where(urs_uid: 'testuser').first)
    visit edit_tool_draft_path(draft, 'tool_organizations')
  end

  context 'when viewing the form with no values' do
    it 'displays the correct title' do
      within 'header .collection-basics > h2' do
        expect(page).to have_content('Tool Organizations')
      end
    end

    it 'displays the form title in the breadcrumbs' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Tool Drafts')
        expect(page).to have_content('Tool Organizations')
      end
    end

    it 'displays the correct sections' do
      expect(page).to have_css('.eui-accordion__header > h3', text: 'Organizations')
    end

    it 'displays the correct number of required fields' do
      expect(page).to have_selector('label.eui-required-o', count: 2)
    end

    it 'displays the correct buttons to add another element' do
      expect(page).to have_selector(:link_or_button, 'Add another Organization')
    end

    it 'displays the correct prompt value for all select elements' do
      within '.umm-form' do
        expect(page).to have_select('tool_draft_draft_organizations_0_short_name', selected: 'Select a Short Name')
      end
    end
  end

  context 'when filling out the form' do
    before do
      within '#organizations' do
        within '.multiple-item-0' do
          select 'SERVICE PROVIDER', from: 'Roles', match: :first
          select 'DEVELOPER', from: 'Roles', match: :first

          select 'UCAR/NCAR/EOL/CEOPDM', from: 'Short Name'
        end

        click_on 'Add another Organization'

        within '.multiple-item-1' do
          select 'PUBLISHER', from: 'Roles', match: :first
          select 'AARHUS-HYDRO', from: 'Short Name'
        end
      end
    end

    context "when clicking 'Save' to save the form" do
      before do
        within '.nav-top' do
          click_on 'Save'
        end
      end

      it 'saves the values, displays a confirmation message, and repopulates the form' do
        expect(page).to have_content('Tool Draft Updated Successfully!')

        within '#organizations' do
          within '.multiple-item-0' do
            expect(page).to have_select('Roles', selected: ['SERVICE PROVIDER', 'DEVELOPER'])

            expect(page).to have_select('Short Name', selected: 'UCAR/NCAR/EOL/CEOPDM')
            expect(page).to have_field('Long Name', with: 'CEOP Data Management, Earth Observing Laboratory, National Center for Atmospheric Research, University Corporation for Atmospheric Research', readonly: true)

            expect(page).to have_field('URL Value', with: 'http://www.eol.ucar.edu/projects/ceop/dm/', readonly: true)
          end
          within '.multiple-item-1' do
            expect(page).to have_select('Roles', selected: ['PUBLISHER'])

            expect(page).to have_select('Short Name', selected: 'AARHUS-HYDRO')
            expect(page).to have_field('Long Name', with: 'Hydrogeophysics Group, Aarhus University ', readonly: true)
          end
        end
      end

      it 'displays the correct number of required fields' do
        expect(page).to have_selector('label.eui-required-o', count: 4)
      end
    end
  end
end
