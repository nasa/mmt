describe 'Tool Drafts Compatibility and Usability Form', js: true do
  before do
    login
    draft = create(:empty_tool_draft, user: User.where(urs_uid: 'testuser').first)
    visit edit_tool_draft_path(draft, 'compatibility_and_usability')

    click_on 'Expand All'
  end

  context 'when viewing the form with no values' do
    it 'does not display required icons for accordions in Compatibility and Usability section' do
      expect(page).to have_no_css('h3.eui-required-o.always-required')
    end

    it 'displays the correct title' do
      within 'header .collection-basics > h2' do
        expect(page).to have_content('Compatibility and Usability')
      end
    end

    it 'displays the form title in the breadcrumbs' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Tool Drafts')
        expect(page).to have_content('Compatibility and Usability')
      end
    end

    it 'displays the correct sections' do
      expect(page).to have_css('.eui-accordion__header > h3', text: 'Supported Formats')
      expect(page).to have_css('.eui-accordion__header > h3', text: 'Supported Operating Systems')
      expect(page).to have_css('.eui-accordion__header > h3', text: 'Supported Browsers')
      expect(page).to have_css('.eui-accordion__header > h3', text: 'Supported Software Languages')
      expect(page).to have_css('.eui-accordion__header > h3', text: 'Quality')
      expect(page).to have_css('.eui-accordion__header > h3', text: 'Constraints')
    end

    it 'displays the correct number of required fields' do
      expect(page).to have_no_selector('label.eui-required-o')
    end

    it 'displays the correct buttons to add another element' do
      expect(page).to have_selector(:link_or_button, 'Add another Supported Operating System')
      expect(page).to have_selector(:link_or_button, 'Add another Supported Browser')
      expect(page).to have_selector(:link_or_button, 'Add another Supported Software Language')
    end

    it 'displays the correct prompt value for all select elements' do
      within '.umm-form' do
        expect(page).to have_select('tool_draft_draft_quality_quality_flag', selected: 'Select a Quality Flag')
      end
    end
  end

  context 'when filling out the form' do
    before do
      select 'GEOTIFFFLOAT32', from: 'Supported Input Formats'
      select 'ICARTT', from: 'Supported Input Formats'

      select 'KML', from: 'Supported Output Formats'
      select 'NETCDF-4', from: 'Supported Output Formats'

      within '#supported-operating-systems' do
        fill_in 'Operating System Name', with: 'Puppy Linux'
        fill_in 'Operating System Version', with: '8.8'

        click_on 'Add another Supported Operating System'

        within '.multiple-item-1' do
          fill_in 'Operating System Name', with: 'Tails'
          fill_in 'Operating System Version', with: '9.5'
        end
      end

      within '#supported-browsers' do
        fill_in 'Browser Name', with: '3B'
        fill_in 'Browser Version', with: '3.0'

        click_on 'Add another Supported Browser'

        within '.multiple-item-1' do
          fill_in 'Browser Name', with: 'Retawq'
          fill_in 'Browser Version', with: '1.1'
        end
      end

      within '#supported-software-languages' do
        fill_in 'Software Language Name', with: 'LOLCODE'
        fill_in 'Software Language Version', with: 'LOL'

        click_on 'Add another Supported Software Language'

        within '.multiple-item-1' do
          fill_in 'Software Language Name', with: 'Chicken'
          fill_in 'Software Language Version', with: 'Chicken Chicken Chicken Chicken'
        end
      end

      select 'Reviewed', from: 'Quality Flag'
      fill_in 'Traceability', with: 'traceability'
      fill_in 'Lineage', with: 'lineage'

      fill_in 'Access Constraints', with: 'access constraint 1'
      fill_in 'License URL', with: 'tool.license.boo'
      fill_in 'License Text', with: 'license text text license'
    end

    context "when clicking 'Save' to save the form" do
      before do
        within '.nav-top' do
          click_on 'Save'
        end

        click_on 'Expand All'
      end

      it 'saves the values, displays a confirmation message, and repopulates the form' do
        expect(page).to have_content('Tool Draft Updated Successfully!')

        expect(page).to have_select('Supported Input Formats', selected: ['GEOTIFFFLOAT32', 'ICARTT'])
        expect(page).to have_select('Supported Output Formats', selected: ['KML', 'NETCDF-4'])

        within '#supported-operating-systems' do
          within '.multiple-item-0' do
            expect(page).to have_field('Operating System Name', with: 'Puppy Linux')
            expect(page).to have_field('Operating System Version', with: '8.8')
          end
          within '.multiple-item-1' do
            expect(page).to have_field('Operating System Name', with: 'Tails')
            expect(page).to have_field('Operating System Version', with: '9.5')
          end
        end

        within '#supported-browsers' do
          within '.multiple-item-0' do
            expect(page).to have_field('Browser Name', with: '3B')
            expect(page).to have_field('Browser Version', with: '3.0')
          end
          within '.multiple-item-1' do
            expect(page).to have_field('Browser Name', with: 'Retawq')
            expect(page).to have_field('Browser Version', with: '1.1')
          end
        end

        within '#supported-software-languages' do
          within '.multiple-item-0' do
            expect(page).to have_field('Software Language Name', with: 'LOLCODE')
            expect(page).to have_field('Software Language Version', with: 'LOL')
          end
          within '.multiple-item-1' do
            expect(page).to have_field('Software Language Name', with: 'Chicken')
            expect(page).to have_field('Software Language Version', with: 'Chicken Chicken Chicken Chicken')
          end
        end

        expect(page).to have_select('Quality Flag', selected: 'Reviewed')
        expect(page).to have_field('Traceability', with: 'traceability')
        expect(page).to have_field('Lineage', with: 'lineage')

        expect(page).to have_field('Access Constraints', with: 'access constraint 1')

        expect(page).to have_field('License URL', with: 'tool.license.boo')
        expect(page).to have_field('License Text', with: 'license text text license')
      end

      it 'displays the correct number of required fields' do
        expect(page).to have_selector('label.eui-required-o', count: 1)
      end
    end
  end
end
