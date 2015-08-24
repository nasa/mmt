#MMT-127

require 'rails_helper'

BASE_STRING = 'This site may be unavailable for a brief period due to planned maintenance'
ECHO_DOWN_STRING = 'System availability notifications may be unavailable for a brief period due to planned maintenance. We apologize for the inconvenience.'

describe 'Calendar Event Query' do

  context 'when on home page and not logged in' do
    before do
      visit "/"
    end

    it 'shows no notifications' do
      expect(page).to_not have_content(BASE_STRING)
    end
  end

  context 'when ECHO is down' do
    before do
      VCR.use_cassette('notifications/echo_down', record: :none) do
        login
        visit "/"
      end
    end

    it 'shows proper notification' do
      expect(page).to have_content(ECHO_DOWN_STRING)
    end
  end

  context 'when on home page and logged in' do
    before :each do
      login
    end

    context 'when there are no notifications in the db' do
      before do
        VCR.use_cassette('notifications/no_notifications', record: :none) do
          visit "/"
        end
      end

      it 'does not display a notification' do
        expect(page).to_not have_content(BASE_STRING)
        expect(page).to_not have_content(ECHO_DOWN_STRING)
      end
    end

    context 'when there are several future notifications in the db' do
      before do
        VCR.use_cassette('notifications/several_future_notifications', record: :none) do
          visit "/"
        end
      end

      it 'shows the proper upcoming notification' do
        expect(page).to have_content("#{BASE_STRING} on Sunday, 7/18/2021 between 8 am - 9 am ET")
      end
    end

    context 'when the notification is for a multi-day outage' do
      before do
        VCR.use_cassette('notifications/multi_day_notification', record: :none) do
          visit "/"
        end
      end

      it 'shows the multi-day outage correctly' do
        expect(page).to have_content("#{BASE_STRING} between Monday, 7/12/2021 at 5 am and Tuesday, 7/13/2021 at 4 pm ET")
      end
    end

    context 'when the notification are all expired' do
      before do
        VCR.use_cassette('notifications/expired_notifications', record: :none) do
          visit "/"
        end
      end

      it 'no notifications are shown' do
        expect(page).to_not have_content(BASE_STRING)
      end
    end

    context 'when Noon and Midnight should be shown' do
      before do
        VCR.use_cassette('notifications/noon_midnight_notifications', record: :none) do
          visit "/"
        end
      end

      it 'shows Noon and Midnight times properly' do
        expect(page).to have_content("#{BASE_STRING} on Tuesday, 6/17/2025 between 12 Midnight - 12 Noon ET")
      end
    end

  end

end
