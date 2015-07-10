# MMT-118

require 'rails_helper'

JS_WARNING_STRING = "Jxavascript is disabled! JavaScript must be enabled for some features to work."

describe 'Javascript status testing' do

  context 'when on home page' do
    before :each do
      visit "/"
    end

    context 'when javascript is enabled' do
      it 'does not display the javascript disabled warning' do
        expect(page).to have_css('#javascript_warning', :text => JS_WARNING_STRING, :visible => false)
      end
    end

    context 'when javascript is disabled', js: false do
      it 'does display the javascript disabled warning' do
        expect(page).to have_css('#javascript_warning', :text => JS_WARNING_STRING, :visible => true)
      end
    end

  end

end
