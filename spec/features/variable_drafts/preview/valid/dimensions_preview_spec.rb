describe 'Valid Variable Draft Dimensions Preview' do
  let(:variable_draft) { create(:full_variable_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit variable_draft_path(variable_draft)
  end

  context 'When examining the Dimensions section' do
    context 'when examining the progress circles section' do
      it 'displays the form title as an edit link' do
        within '#dimensions-progress' do
          expect(page).to have_link('Dimensions', href: edit_variable_draft_path(variable_draft, 'dimensions'))
        end
      end

      it 'displays the correct status icon' do
        within '#dimensions-progress' do
          within '.status' do
            expect(page).to have_css('.eui-icon.icon-green.eui-check')
          end
        end
      end

      it 'displays the correct progress indicators for non-required fields' do
        within '#dimensions-progress .progress-indicators' do
          expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.dimensions')
          expect(page).to have_link(nil, href: edit_variable_draft_path(variable_draft, 'dimensions', anchor: 'dimensions'))
        end
      end

      it 'displays no progress indicators for required fields' do
        within '#dimensions-progress .progress-indicators' do
          expect(page).to have_no_css('.eui-icon.eui-required.icon-green')
        end
      end
    end

    context 'when examining the metadata preview section' do
      it 'displays links to edit/update the data' do
        within '.umm-preview.dimensions' do
          expect(page).to have_css('.umm-preview-field-container', count: 7)

          expect(page).to have_link(nil, href: edit_variable_draft_path(variable_draft, 'dimensions', anchor: 'variable_draft_draft_dimensions_0_name'))
          expect(page).to have_link(nil, href: edit_variable_draft_path(variable_draft, 'dimensions', anchor: 'variable_draft_draft_dimensions_0_size'))
          expect(page).to have_link(nil, href: edit_variable_draft_path(variable_draft, 'dimensions', anchor: 'variable_draft_draft_dimensions_0_type'))
          expect(page).to have_link(nil, href: edit_variable_draft_path(variable_draft, 'dimensions', anchor: 'variable_draft_draft_dimensions_1_name'))
          expect(page).to have_link(nil, href: edit_variable_draft_path(variable_draft, 'dimensions', anchor: 'variable_draft_draft_dimensions_1_size'))
          expect(page).to have_link(nil, href: edit_variable_draft_path(variable_draft, 'dimensions', anchor: 'variable_draft_draft_dimensions_1_type'))
        end
      end

      include_examples 'Variable Dimensions Full Preview'
    end
  end
end
