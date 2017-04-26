require 'rails_helper'

describe 'Viewing a bulk update', reset_provider: true do
  # before do
  #   when the endpoint accepts and returns real data we will need to create a bulk update
  # end

  context 'when visiting a bulk update show page' do
    before do
      login
    end

    context 'when the bulk update has errors' do
      let(:task_id) { '123ABC' }
      before do
        visit bulk_update_path(task_id)
      end

      it 'displays the bulk update information' do
        expect(page).to have_content("Bulk Update #{task_id}")
        expect(page).to have_css('.eui-badge--sm', text: 'COMPLETE')
        expect(page).to have_content('The bulk update completed with 2 errors')
      end

      it 'displays the bulk update errors table' do
        expect(page).to have_content('Bulk Update Errors')
        within '#bulk-update-errors-table' do
          within 'tbody > tr:nth-child(1)' do
            expect(page).to have_content('C1-PROV')
            expect(page).to have_content('Missing required properties')
          end
          within 'tbody > tr:nth-child(2)' do
            expect(page).to have_content('C2-PROV')
            expect(page).to have_content('Invalid XML')
          end
        end
      end
    end

    # TODO: add when we can create bulk updates
    # context 'when the bulk update has no errors' do
    #   it 'does not display the bulk update errors table'
    # end
  end
end
