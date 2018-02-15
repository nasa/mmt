require 'rails_helper'

shared_examples_for 'Science and Ancillary Keywords Form' do
  it 'displays the form with values' do
    expect(page).to have_content 'EARTH SCIENCE > SOLID EARTH > ROCKS/MINERALS/CRYSTALS > SEDIMENTARY ROCKS > SEDIMENTARY ROCK PHYSICAL/OPTICAL PROPERTIES > LUMINESCENCE'
    expect(page).to have_field 'service_draft_draft_ancillary_keywords_0', with: 'Ancillary keyword 1'
    expect(page).to have_field 'service_draft_draft_ancillary_keywords_1', with: 'Ancillary keyword 2'
  end
end
