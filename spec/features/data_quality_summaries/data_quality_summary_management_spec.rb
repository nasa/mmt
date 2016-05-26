# MMT-129

require 'rails_helper'

describe 'Viewing Data Quality Summaries', js: true do
  context 'when viewing the data quality summaries page' do
    before do
      login

      click_on 'Manage CMR'

      VCR.use_cassette('echo_soap/data_management_service/data_quality_summaries/empty', record: :none) do
        click_on 'View All Summaries'
      end
    end

    it 'displays the create data quality summary button' do
      expect(page).to have_content('No MMT_2 Data Quality Summaries found.')

      expect(page).to have_content('Create a Data Quality Summary')
    end

    context 'when clicking the create data quality summary button' do
      before do
        click_on 'Create a Data Quality Summary'
      end

      it 'displays the new order policies form' do
        expect(page).to have_content('New MMT_2 Data Quality Summary')
      end

      context 'when submitting an invalid order policies form' do
        before do
          fill_in 'Name', with: ''
          fill_in 'Summary', with: ''

          click_on 'Submit'
        end

        it 'displays validation errors within the form' do
          expect(page).to have_content('Name is required.')
          expect(page).to have_content('Summary is required.')
        end
      end

      context 'when submitting a valid order policies form' do
        before do
          fill_in 'Name', with: 'DQS #1'
          fill_in 'Summary', with: '<p>Maecenas faucibus mollis interdum.</p>'

          VCR.use_cassette('echo_soap/data_management_service/data_quality_summaries/create', record: :none) do
            click_on 'Submit'
          end
        end

        it 'successfully creates a data quality summary' do
          expect(page).to have_content('Data Quality Summary successfully created')

          expect(page).to have_content('DQS #1')
          expect(page).to have_content('Maecenas faucibus mollis interdum.')
        end
      end
    end
  end
end
