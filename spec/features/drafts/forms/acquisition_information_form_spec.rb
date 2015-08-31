# MMT-298

require 'rails_helper'

describe 'Acquisition information form', js: true do
  before do
    login
    draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
    visit draft_path(draft)
  end

  context 'when submitting the form' do
    before do
      click_on 'Acquisition Information'

      add_platforms

      # Project
      within '.projects' do
        fill_in 'Short Name', with: 'Project short name'
        fill_in 'Long Name', with: 'Project long name'
        within '.multiple.campaign' do
          fill_in 'Campaign', with: 'Project campaign'
          click_on 'Add another'
          within all('.multiple-item').last do
            fill_in 'Campaign', with: 'Project campaign 1'
          end
        end
        fill_in 'Start Date', with: '2015-07-01T00:00:00Z'
        fill_in 'End Date', with: '2015-08-01T00:00:00Z'
      end

      within '.nav-top' do
        click_on 'Save & Done'
      end
      # output_schema_validation Draft.first.draft
      open_accordions
    end

    it 'shows the draft preview page' do
      expect(page).to have_content('<Untitled Collection Record> DRAFT RECORD')
    end

    it "shows pre-entered values in the draft preview page" do
      expect(page).to have_content('Project campaign')
      expect(page).to have_content('Characteristics data type 1', :count=>5)
      expect(page).to have_content('Characteristics data type', :count=>10)
      expect(page).to have_content('Characteristics description 1', :count=>5)
      expect(page).to have_content('Characteristics description', :count=>10)
      expect(page).to have_content('Instrument mode 1', :count=>2)
      expect(page).to have_content('Instrument mode', :count=>4)
      expect(page).to have_content('Instrument long name', :count=>2)
      expect(page).to have_content('Platform long name')
      expect(page).to have_content('Project long name')
      expect(page).to have_content('Sensor long name', :count=>2)
      expect(page).to have_content('Characteristics name 1', :count=>5)
      expect(page).to have_content('Characteristics name', :count=>10)
      expect(page).to have_content('2468', :count=>2)
      expect(page).to have_content('Project campaign 1')
      expect(page).to have_content('Instrument short name 1', :count=>2)
      expect(page).to have_content('Instrument short name', :count=>4)
      expect(page).to have_content('Platform short name 1')
      expect(page).to have_content('Platform short name', :count=>2)
      expect(page).to have_content('Project short name')
      expect(page).to have_content('Sensor short name 1', :count=>2)
      expect(page).to have_content('Sensor short name', :count=>4)
      expect(page).to have_content('Instrument technique', :count=>2)
      expect(page).to have_content('Sensor technique', :count=>2)
      expect(page).to have_content('Platform type')
      expect(page).to have_content('unit 1', :count=>5)
      expect(page).to have_content('unit', :count=>10)
      expect(page).to have_content('Characteristics value 1', :count=>5)
      expect(page).to have_content('Characteristics value', :count=>10)
    end

    context 'when returning to the form' do
      before do
        click_on 'Acquisition Information'

        open_accordions
      end

      it 'populates the form with the values' do
        within '.multiple.platforms' do
          within first('.multiple-item-0') do
            expect(page).to have_field('Type', with: 'Platform type')
            expect(page).to have_field('draft_platforms_0_short_name', with: 'Platform short name')
            expect(page).to have_field('draft_platforms_0_long_name', with: 'Platform long name')

            # Characteristics
            within first('.multiple.characteristics') do
              within '.multiple-item-0' do
                expect(page).to have_field('Name', with: 'Characteristics name')
                expect(page).to have_field('Description', with: 'Characteristics description')
                expect(page).to have_field('Value', with: 'Characteristics value')
                expect(page).to have_field('Unit', with: 'unit')
                expect(page).to have_field('Data Type', with: 'Characteristics data type')
              end
              within '.multiple-item-1' do
                expect(page).to have_field('Name', with: 'Characteristics name 1')
                expect(page).to have_field('Description', with: 'Characteristics description 1')
                expect(page).to have_field('Value', with: 'Characteristics value 1')
                expect(page).to have_field('Unit', with: 'unit 1')
                expect(page).to have_field('Data Type', with: 'Characteristics data type 1')
              end
            end
          end
          # Instruments
          within first('.multiple.instruments') do
            expect(page).to have_field("draft_platforms_0_instruments_0_short_name", with: 'Instrument short name')
            expect(page).to have_field("draft_platforms_0_instruments_0_long_name", with: 'Instrument long name')
            expect(page).to have_field("draft_platforms_0_instruments_0_technique", with: 'Instrument technique')
            expect(page).to have_field('Number Of Sensors', with: 2468)
            expect(page).to have_field('Operational Mode', with: 'Instrument mode')
            expect(page).to have_field('Operational Mode', with: 'Instrument mode 1')
            # Characteristics
            within first('.multiple.characteristics') do
              within '.multiple-item-0' do
                expect(page).to have_field('Name', with: 'Characteristics name')
                expect(page).to have_field('Description', with: 'Characteristics description')
                expect(page).to have_field('Value', with: 'Characteristics value')
                expect(page).to have_field('Unit', with: 'unit')
                expect(page).to have_field('Data Type', with: 'Characteristics data type')
              end
              within '.multiple-item-1' do
                expect(page).to have_field('Name', with: 'Characteristics name 1')
                expect(page).to have_field('Description', with: 'Characteristics description 1')
                expect(page).to have_field('Value', with: 'Characteristics value 1')
                expect(page).to have_field('Unit', with: 'unit 1')
                expect(page).to have_field('Data Type', with: 'Characteristics data type 1')
              end
            end
            # Sensors
            within first('.multiple.sensors') do
              expect(page).to have_field("draft_platforms_0_instruments_0_sensors_0_short_name", with: 'Sensor short name')
              expect(page).to have_field("draft_platforms_0_instruments_0_sensors_0_long_name", with: 'Sensor long name')
              expect(page).to have_field("draft_platforms_0_instruments_0_sensors_0_technique", with: 'Sensor technique')
              # Characteristics
              within first('.multiple.characteristics') do
                within '.multiple-item-0' do
                  expect(page).to have_field('Name', with: 'Characteristics name')
                  expect(page).to have_field('Description', with: 'Characteristics description')
                  expect(page).to have_field('Value', with: 'Characteristics value')
                  expect(page).to have_field('Unit', with: 'unit')
                  expect(page).to have_field('Data Type', with: 'Characteristics data type')
                end
                within '.multiple-item-1' do
                  expect(page).to have_field('Name', with: 'Characteristics name 1')
                  expect(page).to have_field('Description', with: 'Characteristics description 1')
                  expect(page).to have_field('Value', with: 'Characteristics value 1')
                  expect(page).to have_field('Unit', with: 'unit 1')
                  expect(page).to have_field('Data Type', with: 'Characteristics data type 1')
                end
              end

              # Sensor 2
              expect(page).to have_field("draft_platforms_0_instruments_0_sensors_1_short_name", with: 'Sensor short name 1')
            end

            # Instrument 2
            expect(page).to have_field("draft_platforms_0_instruments_1_short_name", with: 'Instrument short name 1')
          end

          # Platform 2
          expect(page).to have_field('draft_platforms_1_short_name', with: 'Platform short name 1')
          # Instruments
          within all('.multiple.instruments').last do
            expect(page).to have_field("draft_platforms_1_instruments_0_short_name", with: 'Instrument short name')
            expect(page).to have_field("draft_platforms_1_instruments_0_long_name", with: 'Instrument long name')
            expect(page).to have_field("draft_platforms_1_instruments_0_technique", with: 'Instrument technique')
            expect(page).to have_field('Number Of Sensors', with: 2468)
            expect(page).to have_field('Operational Mode', with: 'Instrument mode')
            expect(page).to have_field('Operational Mode', with: 'Instrument mode 1')
            # Characteristics
            within first('.multiple.characteristics') do
              within '.multiple-item-0' do
                expect(page).to have_field('Name', with: 'Characteristics name')
                expect(page).to have_field('Description', with: 'Characteristics description')
                expect(page).to have_field('Value', with: 'Characteristics value')
                expect(page).to have_field('Unit', with: 'unit')
                expect(page).to have_field('Data Type', with: 'Characteristics data type')
              end
              within '.multiple-item-1' do
                expect(page).to have_field('Name', with: 'Characteristics name 1')
                expect(page).to have_field('Description', with: 'Characteristics description 1')
                expect(page).to have_field('Value', with: 'Characteristics value 1')
                expect(page).to have_field('Unit', with: 'unit 1')
                expect(page).to have_field('Data Type', with: 'Characteristics data type 1')
              end
            end
            # Sensors
            within first('.multiple.sensors') do
              expect(page).to have_field("draft_platforms_1_instruments_0_sensors_0_short_name", with: 'Sensor short name')
              expect(page).to have_field("draft_platforms_1_instruments_0_sensors_0_long_name", with: 'Sensor long name')
              expect(page).to have_field("draft_platforms_1_instruments_0_sensors_0_technique", with: 'Sensor technique')
              # Characteristics
              within first('.multiple.characteristics') do
                within '.multiple-item-0' do
                  expect(page).to have_field('Name', with: 'Characteristics name')
                  expect(page).to have_field('Description', with: 'Characteristics description')
                  expect(page).to have_field('Value', with: 'Characteristics value')
                  expect(page).to have_field('Unit', with: 'unit')
                  expect(page).to have_field('Data Type', with: 'Characteristics data type')
                end
                within '.multiple-item-1' do
                  expect(page).to have_field('Name', with: 'Characteristics name 1')
                  expect(page).to have_field('Description', with: 'Characteristics description 1')
                  expect(page).to have_field('Value', with: 'Characteristics value 1')
                  expect(page).to have_field('Unit', with: 'unit 1')
                  expect(page).to have_field('Data Type', with: 'Characteristics data type 1')
                end
              end

              # Sensor 2
              expect(page).to have_field("draft_platforms_1_instruments_0_sensors_1_short_name", with: 'Sensor short name 1')
            end

            # Instrument 2
            expect(page).to have_field("draft_platforms_1_instruments_1_short_name", with: 'Instrument short name 1')
          end
        end

        within '.projects' do
          expect(page).to have_field('Short Name', with: 'Project short name')
          expect(page).to have_field('Long Name', with: 'Project long name')
          expect(page).to have_field('Campaign', with: 'Project campaign')
          expect(page).to have_field('Campaign', with: 'Project campaign 1')
          expect(page).to have_field('Start Date', with: '2015-07-01T00:00:00Z')
          expect(page).to have_field('End Date', with: '2015-08-01T00:00:00Z')
        end

      end
    end

  end
end
