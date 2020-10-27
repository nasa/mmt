describe 'Tool Draft Forms Required Field Icons', js: true do
  let(:empty_draft) { create(:empty_tool_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
  end

  context 'when viewing an empty form with always required fields' do
    before do
      visit edit_tool_draft_path(empty_draft, 'tool_information')
    end

    it 'displays the required icons' do
      expect(page).to have_css('label.eui-required-o', count: 8)
    end
  end

  context 'when viewing an empty form with conditionally required fields' do
    before do
      visit edit_tool_draft_path(empty_draft, 'tool_contacts')

      click_on 'Expand All'
    end

    it 'does not display the required icons' do
      expect(page).to have_no_css('label.eui-required-o')
    end

    context 'when filling in a field that causes fields to become required' do
      before do
        within '#contact-persons' do
          fill_in 'Value', with: 'who'
        end
        find('body').click
      end

      it 'displays the required icons' do
        expect(page).to have_css('label.eui-required-o', count: 4)
      end

      context 'when removing data from the field so the fields should not be required' do
        before do
          within '#contact-persons' do
            fill_in 'Value', with: ''
          end
        end

        it 'does not display the required icons' do
          expect(page).to have_no_css('label.eui-required-o')
        end
      end
    end
  end

  context 'when checking the accordion headers for required icons' do
    it 'displays required icons on the Tool Information and URL accordions' do
      visit edit_tool_draft_path(empty_draft, form: 'tool_information')
      expect(page).to have_css('h3.eui-required-o.always-required', count: 2)
      expect(page).to have_css('h3.eui-required-o.always-required', text: 'Tool Information')
      expect(page).to have_css('h3.eui-required-o.always-required', text: 'URL')
    end

    it 'does not display required icons for accordions in Related URLs section' do
      visit edit_tool_draft_path(empty_draft, form: 'related_urls')
      expect(page).to have_no_css('h3.eui-required-o.always-required')
    end

    it 'does not display required icons for accordions in Compatibility and Usability section' do
      visit edit_tool_draft_path(empty_draft, form: 'compatibility_and_usability')
      expect(page).to have_no_css('h3.eui-required-o.always-required')
    end

    it 'displays required icons on the Tool Keywords accordion' do
      visit edit_tool_draft_path(empty_draft, form: 'descriptive_keywords')
      expect(page).to have_css('h3.eui-required-o.always-required', count: 1)
      expect(page).to have_css('h3.eui-required-o.always-required', text: 'Tool Keywords')
    end

    it 'displays required icons on the Organizations accordion' do
      visit edit_tool_draft_path(empty_draft, form: 'tool_organizations')
      expect(page).to have_css('h3.eui-required-o.always-required', count: 1)
      expect(page).to have_css('h3.eui-required-o.always-required', text: 'Organizations')
    end

    it 'does not display required icons for accordions in Tool Contacts section' do
      visit edit_tool_draft_path(empty_draft, form: 'tool_contacts')
      expect(page).to have_no_css('h3.eui-required-o.always-required')
    end

    it 'does not display required icons for accordions in Smart Handoff Information section' do
      visit edit_tool_draft_path(empty_draft, form: 'smart_handoff_information')
      expect(page).to have_no_css('h3.eui-required-o.always-required')
    end
  end
end
