require 'rails_helper'

describe 'Displaying the comparison report in browser', js: true do

  context 'when accessing the comparison report' do

    before do
      login
    end

    context 'when displaying json' do
      it 'properly displays the echo json report' do
        visit loss_report_collections_path(echo_id, format:'json')
        expect(page).to have_content('application/echo')
      end
      it 'properly displays the iso json report' do
        visit loss_report_collections_path(iso_id, format:'json')
        expect(page).to have_content('application/iso')
      end
      it 'properly displays the dif json report' do
        visit loss_report_collections_path(dif_id, format:'json')
        expect(page).to have_content('application/dif')
      end
    end

    context 'when displaying text' do
      it 'properly displays the echo text report' do
        visit loss_report_collections_path(echo_id, format:'text')
        expect(page).to have_content('application/echo')
      end
      it 'properly displays the iso text report' do
        visit loss_report_collections_path(iso_id, format:'text')
        expect(page).to have_content('application/iso')
      end
      it 'properly displays the dif text report' do
        visit loss_report_collections_path(dif_id, format:'text')
        expect(page).to have_content('application/dif')
      end
    end
  end
end
