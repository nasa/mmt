# MMT-272

require 'rails_helper'

describe 'Provider context', js: true do
  context 'when the user has multiple possible provider contexts' do
    before do
      VCR.use_cassette('provider_context/multiple_providers', record: :none) do
        login
      end
    end

    context 'when a user logs in for the first time' do
      it 'saves the users echo_id' do
        expect(User.first.echo_id).to eq('user-echo-token')
      end

      it 'saves the users available providers' do
        expect(User.first.available_providers).to eq(%w(MMT_1 MMT_2))
      end

      it 'prompts the user to select a provider context' do
        expect(page).to have_content('Please select your provider context')
      end

      context 'when the user selects a provider context' do
        before do
          select 'MMT_1', from: 'select-provider'
          sleep 0.2
        end

        it 'saves the users provider' do
          expect(User.first.provider_id).to eq('MMT_1')
        end

        it 'displays the users current provider' do
          within '.badge.daac' do
            expect(page).to have_content('MMT_1')
          end
        end

        context 'when the user logs in again' do
          before do
            click_on 'Logout'
            expect(page).to have_content('Earthdata Login')
            VCR.use_cassette('provider_context/multiple_providers', record: :none) do
              login
            end
          end

          it 'displays their last used provider context' do
            within '.badge.daac' do
              expect(page).to have_content('MMT_1')
            end
          end
        end
      end
    end

    context 'when a user changes their provider context' do
      before do
        select 'MMT_1', from: 'select-provider'
        sleep 0.2

        click_on 'Change Provider'
        select 'MMT_2', from: 'select-provider'
        sleep 0.2
      end

      it 'saves the new provider context' do
        expect(User.first.provider_id).to eq('MMT_2')
      end

      it 'displays the new provider context' do
        within '.badge.daac' do
          expect(page).to have_content('MMT_2')
        end
      end
    end
  end

  context 'when the user only has one provider' do
    before do
      # By default the user only has one provider
      login
    end

    it 'saves the provider as the users provider' do
      expect(User.first.provider_id).to eq('MMT_2')
      expect(User.first.available_providers).to eq(['MMT_2'])
    end

    it 'displays the provider context' do
      within '.badge.daac' do
        expect(page).to have_content('MMT_2')
      end
    end

    context 'when a user refreshes their available providers' do
      before do
        click_on 'Change Provider'
        VCR.use_cassette('provider_context/multiple_providers', record: :none) do
          click_on 'Refresh your available providers'
        end
      end

      it 'saves the available providers' do
        expect(User.first.available_providers).to eq(%w(MMT_1 MMT_2))
      end

      it 'prompts the user to select their provider context' do
        expect(page).to have_content('Please select your provider context')
      end
    end
  end
end
