describe 'Valid Variable Draft Set Preview' do
  let(:variable_draft) { create(:full_variable_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit variable_draft_path(variable_draft)
  end

  context 'When examining the Set section' do
    context 'when examining the progress circles section' do
      it 'displays the form title as an edit link' do
        within '#sets-progress' do
          expect(page).to have_link('Sets', href: edit_variable_draft_path(variable_draft, 'sets'))
        end
      end

      it 'displays the correct status icon' do
        within '#sets-progress' do
          within '.status' do
            expect(page).to have_css('.eui-icon.icon-green.eui-check')
          end
        end
      end

      it 'displays the correct progress indicators for non-required fields' do
        within '#sets-progress .progress-indicators' do
          expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.sets')
          expect(page).to have_link(nil, href: edit_variable_draft_path(variable_draft, 'sets', anchor: 'sets'))
        end
      end

      it 'displays no progress indicators for required fields' do
        within '#sets-progress .progress-indicators' do
          expect(page).to have_no_css('.eui-icon.eui-required.icon-green')
        end
      end
    end

    context 'when examining the metadata preview section' do
      it 'displays links to edit/update the data' do
        within '.umm-preview.sets' do
          expect(page).to have_link(nil, href: edit_variable_draft_path(variable_draft, 'sets', anchor: 'variable_draft_draft_sets_0_name'))
          expect(page).to have_link(nil, href: edit_variable_draft_path(variable_draft, 'sets', anchor: 'variable_draft_draft_sets_0_type'))
          expect(page).to have_link(nil, href: edit_variable_draft_path(variable_draft, 'sets', anchor: 'variable_draft_draft_sets_0_size'))
          expect(page).to have_link(nil, href: edit_variable_draft_path(variable_draft, 'sets', anchor: 'variable_draft_draft_sets_0_index'))
          expect(page).to have_link(nil, href: edit_variable_draft_path(variable_draft, 'sets', anchor: 'variable_draft_draft_sets_1_name'))
          expect(page).to have_link(nil, href: edit_variable_draft_path(variable_draft, 'sets', anchor: 'variable_draft_draft_sets_1_type'))
          expect(page).to have_link(nil, href: edit_variable_draft_path(variable_draft, 'sets', anchor: 'variable_draft_draft_sets_1_size'))
          expect(page).to have_link(nil, href: edit_variable_draft_path(variable_draft, 'sets', anchor: 'variable_draft_draft_sets_1_index'))
        end
      end

      include_examples 'Variable Sets Full Preview'
    end
  end
end
