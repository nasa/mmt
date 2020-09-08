describe 'Empty Variable Draft Set Preview' do
  before do
    login
    @draft = create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first)
    visit variable_draft_path(@draft)
  end

  context 'When examining the Set section' do
    it 'displays the form title as an edit link' do
      within '#sets-progress' do
        expect(page).to have_link('Sets', href: edit_variable_draft_path(@draft, 'sets'))
      end
    end

    it 'displays the correct status icon' do
      within '#sets-progress' do
        within '.status' do
          expect(page).to have_css('.eui-icon.icon-green.eui-fa-circle-o')
        end
      end
    end

    it 'displays the correct progress indicators for required fields' do
      within '#sets-progress .progress-indicators' do
        expect(page).to have_css('.eui-icon.eui-required-o.icon-green.sets')
      end
    end

    it 'displays no progress indicators for non required fields' do
      within '#sets-progress .progress-indicators' do
        expect(page).to have_no_css('.eui-icon.eui-fa-circle.icon-grey')
      end
    end

    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.sets' do
        expect(page).to have_css('.umm-preview-field-container', count: 1)

        within '#variable_draft_draft_sets_preview' do
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'sets', anchor: 'variable_draft_draft_sets'))

          expect(page).to have_css('p', text: 'No value for Sets provided.')
        end
      end
    end
  end
end
