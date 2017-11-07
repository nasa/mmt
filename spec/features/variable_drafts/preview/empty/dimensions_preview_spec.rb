require 'rails_helper'

describe 'Empty Variable Draft Dimensions Preview' do
  before do
    login
    @draft = create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first)
    visit variable_draft_path(@draft)
  end

  context 'When examining the Dimensions section' do
    it 'displays the form title as an edit link' do
      within '#dimensions-progress' do
        expect(page).to have_link('Dimensions', href: edit_variable_draft_path(@draft, 'dimensions'))
      end
    end

    it 'displays the corrent status icon' do
      within '#dimensions-progress' do
        within '.status' do
          expect(page).to have_content('Dimensions is incomplete')
        end
      end
    end

    it 'displays the correct progress indicators for required fields' do
      within '#dimensions-progress .progress-indicators' do
        expect(page).to have_css('.eui-icon.eui-required-o.icon-green.variable_draft_draft_dimensions')
      end
    end

    it 'displays no progress indicators for non required fields' do
      within '#dimensions-progress .progress-indicators' do
        expect(page).to have_no_css('.eui-icon.eui-fa-circle.icon-grey')
      end
    end

    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.dimensions' do
        expect(page).to have_css('.umm-preview-field-container', count: 1)

        within '#variable_draft_draft_dimensions_preview' do
          expect(page).to have_css('h5', text: 'Dimensions')
          expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'dimensions', anchor: 'variable_draft_draft_dimensions'))

          expect(page).to have_css('p', text: 'No value for Dimensions provided.')
        end
      end
    end
  end
end
