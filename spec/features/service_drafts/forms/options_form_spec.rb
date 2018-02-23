require 'rails_helper'

describe 'Options Form', js: true do
  before do
    login
    draft = create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first)
    visit edit_service_draft_path(draft, 'options')
  end

  context 'when submitting the form' do
    before do
      select('Spatial', from: 'Subset Types')
      select('Geographic', from: 'Supported Projections')
      select('Bilinear Interpolation', from: 'Interpolation Types')
      select('Bicubic Interpolation', from: 'Interpolation Types')
      select('HDF-EOS4', from: 'Supported Formats')
      select('HDF-EOS5', from: 'Supported Formats')

      within '.nav-top' do
        click_on 'Save'
      end
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Service Draft Updated Successfully!')
    end

    context 'when viewing the form' do
      include_examples 'Options Form'
    end
  end
end
