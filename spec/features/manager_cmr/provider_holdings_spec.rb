require 'rails_helper'

describe 'Manage CMR provider holdings' do
  before do
    login
    publish_draft
  end

  context 'when visiting the provider holdings with one available provider' do
    before do
      visit manage_cmr_path

      click_on 'Holdings Report'
    end

    it 'displays the available provider holdings' do
      within '#collections' do
        within all('tr')[1] do
          expect(page).to have_content('Draft Title	0')
        end
      end
    end
  end

  context 'when visiting the provider holdings with multiple available providers' do
    before do
      user = User.first
      user.available_providers = %w(MMT_1 MMT_2)
      user.save

      visit manage_cmr_path

      click_on 'Holdings Report'
    end

    it 'displays a list of available providers' do
      within '#provider-holdings' do
        within all('tr')[1] do
          # Don't test number of collections in MMT_1 because it will fail locally if the developer has published collections
          expect(page).to have_content('MMT_1')
        end
        within all('tr')[2] do
          expect(page).to have_content('MMT_2 1 0')
        end
      end
    end

    context 'when selecting a provider' do
      before do
        click_on 'MMT_2'
      end

      it 'displays the available provider holdings' do
        within '#collections' do
          within all('tr')[1] do
            expect(page).to have_content('Draft Title 0')
          end
        end
      end
    end
  end
end
