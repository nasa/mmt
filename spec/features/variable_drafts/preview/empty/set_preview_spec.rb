require 'rails_helper'

describe 'Empty Variable Draft Set Preview' do
  before do
    login
    @draft = create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first)
    visit variable_draft_path(@draft)
  end

  context 'When examining the Set section' do
    it 'displays the form title as an edit link' do
      within '#set-progress' do
        expect(page).to have_link('Set', href: edit_variable_draft_path(@draft, 'set'))
      end
    end

    it 'displays the corrent status icon' do
      within '#set-progress' do
        within '.status' do
          expect(page).to have_content('Set is incomplete')
        end
      end
    end

    it 'displays the correct progress indicators for required fields' do
      within '#set-progress .progress-indicators' do
        expect(page).to have_css('.eui-icon.eui-required-o.icon-green.variable_draft_draft_set')
      end
    end

    it 'displays no progress indicators for non required fields' do
      within '#set-progress .progress-indicators' do
        expect(page).to have_no_css('.eui-icon.eui-fa-circle.icon-grey')
      end
    end

    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.set' do
        expect(page).to have_css('.umm-preview-field-container', count: 1)

        within '#variable_draft_draft_set_preview' do
          expect(page).to have_css('h5', text: 'Sets')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'set', anchor: 'variable_draft_draft_set'))

          expect(page).to have_css('p', text: 'No value for Sets provided.')
        end
      end
    end
  end
end
