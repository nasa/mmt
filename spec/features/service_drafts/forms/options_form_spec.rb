require 'rails_helper'

describe 'Service Identification Form', reset_provider: true, js: true do
  before do
    login
    draft = create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first)
    visit edit_service_draft_path(draft, 'options')
    click_on 'Expand All'
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

    it 'populates the form with the values' do
      expect(page).to have_select('Subset Types', selected: ['Spatial'])
      expect(page).to have_select('service_draft_draft_service_options_supported_projections', selected: ['Geographic'])
      expect(page).to have_select('service_draft_draft_service_options_interpolation_types', selected: ['Bilinear Interpolation', 'Bicubic Interpolation'])
      expect(page).to have_select('service_draft_draft_service_options_supported_formats', selected: ['HDF-EOS4', 'HDF-EOS5'])
    end
  end
end
