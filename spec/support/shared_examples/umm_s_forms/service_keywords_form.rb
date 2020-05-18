require 'rails_helper'

shared_examples_for 'Service Keywords Form' do
  it 'displays the form with values' do
    expect(page).to have_content 'EARTH SCIENCE SERVICES > DATA ANALYSIS AND VISUALIZATION > GEOGRAPHIC INFORMATION SYSTEMS > DESKTOP GEOGRAPHIC INFORMATION SYSTEMS'
  end
end
