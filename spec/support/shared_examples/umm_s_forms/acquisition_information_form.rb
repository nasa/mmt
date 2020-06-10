shared_examples_for 'Acquisition Information Form' do
  it 'displays the form with values' do
    expect(page).to have_field('service_draft_draft_platforms_0_short_name', with: 'A340-600')
    expect(page).to have_field('service_draft_draft_platforms_0_long_name', with: 'Airbus A340-600')
    expect(page).to have_field('service_draft_draft_platforms_0_instruments_0_short_name', with: 'ATM')
    expect(page).to have_field('service_draft_draft_platforms_0_instruments_0_long_name', with: 'Airborne Topographic Mapper')
    expect(page).to have_field('service_draft_draft_platforms_0_instruments_1_short_name', with: 'LVIS')
    expect(page).to have_field('service_draft_draft_platforms_0_instruments_1_long_name', with: 'Land, Vegetation, and Ice Sensor')

    expect(page).to have_field('service_draft_draft_platforms_1_short_name', with: 'DMSP 5B/F3')
    expect(page).to have_field('service_draft_draft_platforms_1_long_name', with: 'Defense Meteorological Satellite Program-F3')
    expect(page).to have_field('service_draft_draft_platforms_1_instruments_0_short_name', with: 'ACOUSTIC SOUNDERS')
  end
end
