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
end
