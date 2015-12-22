# MMT-127, MMT-271

require 'rails_helper'

BASE_STRING = 'This site may be unavailable for a brief period due to planned maintenance'
ECHO_DOWN_STRING = 'System availability notifications may be unavailable for a brief period due to planned maintenance. We apologize for the inconvenience.'

describe 'Calendar Event Query' do
  context 'when on home page and not logged in' do
    before do
      visit '/'
    end

    it 'shows no notifications' do
      expect(page).to have_no_content(BASE_STRING)
    end
  end

  context 'when ECHO is down' do
    before do
      login

      VCR.use_cassette('notifications/echo_down', record: :none) do
        visit '/'
      end
    end

    it 'shows proper notification' do
      expect(page).to have_content(ECHO_DOWN_STRING)
    end
  end

  context 'when on home page and logged in' do
    before do
      login
    end

    context 'when there are no notifications' do
      before do
        VCR.use_cassette('notifications/no_notifications', record: :none) do
          visit '/'
        end
      end

      it 'does not display a notification' do
        expect(page).to have_no_content(BASE_STRING)
        expect(page).to have_no_content(ECHO_DOWN_STRING)
      end
    end

    context 'when there are several future notifications' do
      before do
        VCR.use_cassette('notifications/several_future_notifications', record: :none) do
          visit '/'
        end
      end

      it 'shows the proper upcoming notification' do
        expect(page).to have_content('Multiple calendar events have been found. Click here to see all messages.')
      end
    end

    context 'when there is a notification with no end date' do
      before do
        VCR.use_cassette('notifications/no_end_date', record: :none) do
          visit '/'
        end
      end

      it 'displays the notification' do
        expect(page).to have_content('No GPM GMI data between 2014-10-22 and 2014-10-24 (2014-10-22 04:14:00 - ongoing)')
      end
    end

    context 'when the notification is for a multi-day outage' do
      before do
        VCR.use_cassette('notifications/multi_day_notification', record: :none) do
          visit '/'
        end
      end

      it 'shows the multi-day outage correctly' do
        expect(page).to have_content('testing ncr (2021-07-12 05:00:00 - 2021-07-12 05:00:00)')
      end

      context 'when hiding the notification and reloading the page', js: true do
        before do
          click_on 'Dismiss banner'
          # Give the test some time to hide the notification
          sleep 0.1

          VCR.use_cassette('notifications/multi_day_notification', record: :none) do
            visit '/'
          end
        end

        it 'does not display the notification' do
          expect(page).to have_no_content(BASE_STRING)
        end

        context 'when a new notification is present' do
          before do
            VCR.use_cassette('notifications/several_future_notifications', record: :none) do
              visit '/'
            end
          end

          it 'displays the non-dismissed notification' do
            expect(page).to have_css('.banner-message')
          end
        end
      end
    end

    context 'when the notification are all expired' do
      before do
        VCR.use_cassette('notifications/expired_notifications', record: :none) do
          visit '/'
        end
      end

      it 'no notifications are shown' do
        expect(page).to have_no_css('.banner-message')
      end
    end
  end
end
