describe 'Valid Variable Draft Set Preview' do
  before do
    login
    @draft = create(:full_variable_draft, user: User.where(urs_uid: 'testuser').first)
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
          expect(page).to have_css('.eui-icon.icon-green.eui-check')
        end
      end
    end

    it 'displays the correct progress indicators for required fields' do
      within '#sets-progress .progress-indicators' do
        expect(page).to have_css('.eui-icon.eui-required.icon-green.sets')
      end
    end

    it 'displays no progress indicators for non required fields' do
      within '#sets-progress .progress-indicators' do
        expect(page).to have_no_css('.eui-icon.eui-fa-circle.icon-grey')
      end
    end

    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.sets' do
        expect(page).to have_css('.umm-preview-field-container', count: 9)

        within '#variable_draft_draft_sets_preview' do
          expect(page).to have_css('h6', text: 'Set 1')

          within '#variable_draft_draft_sets_0_name_preview' do
            expect(page).to have_css('h5', text: 'Name')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'sets', anchor: 'variable_draft_draft_sets_0_name'))
            expect(page).to have_css('p', text: 'Science')
          end

          within '#variable_draft_draft_sets_0_type_preview' do
            expect(page).to have_css('h5', text: 'Type')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'sets', anchor: 'variable_draft_draft_sets_0_type'))
            expect(page).to have_css('p', text: 'Land')
          end

          within '#variable_draft_draft_sets_0_size_preview' do
            expect(page).to have_css('h5', text: 'Size')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'sets', anchor: 'variable_draft_draft_sets_0_size'))
            expect(page).to have_css('p', text: '50')
          end

          within '#variable_draft_draft_sets_0_index_preview' do
            expect(page).to have_css('h5', text: 'Index')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'sets', anchor: 'variable_draft_draft_sets_0_index'))
            expect(page).to have_css('p', text: '1')
          end

          expect(page).to have_css('h6', text: 'Set 2')

          within '#variable_draft_draft_sets_1_name_preview' do
            expect(page).to have_css('h5', text: 'Name')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'sets', anchor: 'variable_draft_draft_sets_1_name'))
            expect(page).to have_css('p', text: 'Fiction')
          end

          within '#variable_draft_draft_sets_1_type_preview' do
            expect(page).to have_css('h5', text: 'Type')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'sets', anchor: 'variable_draft_draft_sets_1_type'))
            expect(page).to have_css('p', text: 'Water')
          end

          within '#variable_draft_draft_sets_1_size_preview' do
            expect(page).to have_css('h5', text: 'Size')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'sets', anchor: 'variable_draft_draft_sets_1_size'))
            expect(page).to have_css('p', text: '100')
          end

          within '#variable_draft_draft_sets_1_index_preview' do
            expect(page).to have_css('h5', text: 'Index')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'sets', anchor: 'variable_draft_draft_sets_1_index'))
            expect(page).to have_css('p', text: '2')
          end
        end
      end
    end
  end
end
