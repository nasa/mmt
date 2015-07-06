#MMT-127

require 'rails_helper'

BASE_STRING = "This site may be unavailable for a brief period due to planned maintenance"

describe 'Calendar Event Query' do

  context 'When on home page and not logged in' do
    it 'shows no notifications' do
      visit "/"
      expect(page).to_not have_content(BASE_STRING)
    end
  end


  context 'On home page and logged in' do
    before :each do
      login
    end
    it 'shows no notifications if there are none' do
      VCR.use_cassette 'notifications/no_notifications' do
        visit "/"
        expect(page).to_not have_content(BASE_STRING)
      end
    end
    it 'shows the proper upcoming notification if there are several future ones' do
      VCR.use_cassette 'notifications/several_future_notifications' do
        visit "/"
        expect(page).to have_content("#{BASE_STRING} on Sunday, 7/18/2021 between 8 am - 9 am ET")
      end
    end
    it 'shows a multi-day outage correctly' do
      VCR.use_cassette 'notifications/multi_day_notification' do
        visit "/"
        expect(page).to have_content("#{BASE_STRING} between Monday, 7/12/2021 at 5 am and Tuesday, 7/13/2021 at 4 pm ET")
      end
    end
    it 'does not show expired notifications' do
      VCR.use_cassette 'notifications/expired_notifications' do
        visit "/"
        expect(page).to_not have_content(BASE_STRING)
      end
    end
    it 'shows Noon and Midnight times properly' do
      VCR.use_cassette 'notifications/noon_midnight_notifications' do
        visit "/"
        expect(page).to have_content("#{BASE_STRING} on Tuesday, 6/17/2025 between 12 Midnight - 12 Noon ET")
      end
    end

  end

end
