describe 'Acquisition information form', js: true do
  before do
    login
    draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
    visit collection_draft_path(draft)
  end

  context 'when submitting the form' do
    before do
      within '.metadata' do
        click_on 'Acquisition Information'
      end

      click_on 'Expand All'

      add_platforms

      # Project
      within '.projects' do
        find('.select2-container .select2-selection').click
        find(:xpath, '//body').find('.select2-dropdown li.select2-results__option', text: 'AA').click

        within '.multiple.campaigns' do
          within '.multiple-item-0' do
            find('.campaign').set 'Project campaign 1'
            click_on 'Add another Campaign'
          end
          within '.multiple-item-1' do
            find('.campaign').set 'Project campaign 2'
          end
        end
        fill_in 'Start Date', with: '2015-07-01T00:00:00Z'
        fill_in 'End Date', with: '2015-08-01T00:00:00Z'

        click_on 'Add another Project'
        within '.multiple-item-1' do
          find('.select2-container .select2-selection').click
          find(:xpath, '//body').find('.select2-dropdown li.select2-results__option', text: 'EUCREX-94').click
        end
      end

      within '.nav-top' do
        click_on 'Save'
      end
      # output_schema_validation Draft.first.draft
      click_on 'Expand All'
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Collection Draft Updated Successfully!')
    end

    it 'populates the form with the values' do
      within '.multiple.platforms' do
        within first('.multiple-item-0') do
          expect(page).to have_content('Type: Aircraft')
          expect(page).to have_field('draft_platforms_0_short_name', with: 'A340-600')
          expect(page).to have_field('draft_platforms_0_long_name', with: 'Airbus A340-600')

          # Characteristics
          within first('.multiple.characteristics') do
            within '.multiple-item-0' do
              expect(page).to have_field('Name', with: 'Characteristics name')
              expect(page).to have_field('Description', with: 'Characteristics description')
              expect(page).to have_field('Value', with: 'Characteristics value')
              expect(page).to have_field('Unit', with: 'unit')
              expect(page).to have_field('Data Type', with: 'STRING')
            end
            within '.multiple-item-1' do
              expect(page).to have_field('Name', with: 'Characteristics name 1')
              expect(page).to have_field('Description', with: 'Characteristics description 1')
              expect(page).to have_field('Value', with: 'Characteristics value 1')
              expect(page).to have_field('Unit', with: 'unit 1')
              expect(page).to have_field('Data Type', with: 'STRING')
            end
          end
        end
        # Instruments
        within first('.multiple.instruments') do
          expect(page).to have_field('draft_platforms_0_instruments_0_short_name', with: 'ATM')
          expect(page).to have_field('draft_platforms_0_instruments_0_long_name', with: 'Airborne Topographic Mapper')
          expect(page).to have_field('draft_platforms_0_instruments_0_technique', with: 'Instrument technique')
          expect(page).to have_field('Number Of Instruments', with: 2468)
          expect(page).to have_selector('input.operational-mode[value="Instrument mode 1"]')
          expect(page).to have_selector('input.operational-mode[value="Instrument mode 2"]')
          # Characteristics
          within first('.multiple.characteristics') do
            within '.multiple-item-0' do
              expect(page).to have_field('Name', with: 'Characteristics name')
              expect(page).to have_field('Description', with: 'Characteristics description')
              expect(page).to have_field('Value', with: 'Characteristics value')
              expect(page).to have_field('Unit', with: 'unit')
              expect(page).to have_field('Data Type', with: 'STRING')
            end
            within '.multiple-item-1' do
              expect(page).to have_field('Name', with: 'Characteristics name 1')
              expect(page).to have_field('Description', with: 'Characteristics description 1')
              expect(page).to have_field('Value', with: 'Characteristics value 1')
              expect(page).to have_field('Unit', with: 'unit 1')
              expect(page).to have_field('Data Type', with: 'STRING')
            end
          end
          # Instrument Child
          within first('.multiple.instrument-children') do
            expect(page).to have_field('draft_platforms_0_instruments_0_composed_of_0_short_name', with: 'ADS')
            expect(page).to have_field('draft_platforms_0_instruments_0_composed_of_0_long_name', with: 'Automated DNA Sequencer')
            expect(page).to have_field('draft_platforms_0_instruments_0_composed_of_0_technique', with: 'Instrument Child technique')
            # Characteristics
            within first('.multiple.characteristics') do
              within '.multiple-item-0' do
                expect(page).to have_field('Name', with: 'Characteristics name')
                expect(page).to have_field('Description', with: 'Characteristics description')
                expect(page).to have_field('Value', with: 'Characteristics value')
                expect(page).to have_field('Unit', with: 'unit')
                expect(page).to have_field('Data Type', with: 'STRING')
              end
              within '.multiple-item-1' do
                expect(page).to have_field('Name', with: 'Characteristics name 1')
                expect(page).to have_field('Description', with: 'Characteristics description 1')
                expect(page).to have_field('Value', with: 'Characteristics value 1')
                expect(page).to have_field('Unit', with: 'unit 1')
                expect(page).to have_field('Data Type', with: 'STRING')
              end
            end

            # Instrument Child 2
            expect(page).to have_field('draft_platforms_0_instruments_0_composed_of_1_short_name', with: 'SMAP L-BAND RADIOMETER')
            expect(page).to have_field('draft_platforms_0_instruments_0_composed_of_1_long_name', with: 'SMAP L-Band Radiometer')
          end

          # Instrument 2
          expect(page).to have_field('draft_platforms_0_instruments_1_short_name', with: 'LVIS')
          expect(page).to have_field('draft_platforms_0_instruments_1_long_name', with: 'Land, Vegetation, and Ice Sensor')
        end

        # Platform 2
        expect(page).to have_content('Type: Earth Observation Satellites')
        expect(page).to have_field('draft_platforms_1_short_name', with: 'DIADEM-1D')
        # Instruments
        within all('.multiple.instruments').last do
          expect(page).to have_field('draft_platforms_1_instruments_0_short_name', with: 'ATM')
          expect(page).to have_field('draft_platforms_1_instruments_0_long_name', with: 'Airborne Topographic Mapper')
          expect(page).to have_field('draft_platforms_1_instruments_0_technique', with: 'Instrument technique')
          expect(page).to have_field('Number Of Instruments', with: 2468)
          expect(page).to have_selector('input.operational-mode[value="Instrument mode 1"]')
          expect(page).to have_selector('input.operational-mode[value="Instrument mode 2"]')
          # Characteristics
          within first('.multiple.characteristics') do
            within '.multiple-item-0' do
              expect(page).to have_field('Name', with: 'Characteristics name')
              expect(page).to have_field('Description', with: 'Characteristics description')
              expect(page).to have_field('Value', with: 'Characteristics value')
              expect(page).to have_field('Unit', with: 'unit')
              expect(page).to have_field('Data Type', with: 'STRING')
            end
            within '.multiple-item-1' do
              expect(page).to have_field('Name', with: 'Characteristics name 1')
              expect(page).to have_field('Description', with: 'Characteristics description 1')
              expect(page).to have_field('Value', with: 'Characteristics value 1')
              expect(page).to have_field('Unit', with: 'unit 1')
              expect(page).to have_field('Data Type', with: 'STRING')
            end
          end
          # Instrument Child
          within first('.multiple.instrument-children') do
            expect(page).to have_field('draft_platforms_1_instruments_0_composed_of_0_short_name', with: 'ADS')
            expect(page).to have_field('draft_platforms_1_instruments_0_composed_of_0_long_name', with: 'Automated DNA Sequencer')
            expect(page).to have_field('draft_platforms_1_instruments_0_composed_of_0_technique', with: 'Instrument Child technique')
            # Characteristics
            within first('.multiple.characteristics') do
              within '.multiple-item-0' do
                expect(page).to have_field('Name', with: 'Characteristics name')
                expect(page).to have_field('Description', with: 'Characteristics description')
                expect(page).to have_field('Value', with: 'Characteristics value')
                expect(page).to have_field('Unit', with: 'unit')
                expect(page).to have_field('Data Type', with: 'STRING')
              end
              within '.multiple-item-1' do
                expect(page).to have_field('Name', with: 'Characteristics name 1')
                expect(page).to have_field('Description', with: 'Characteristics description 1')
                expect(page).to have_field('Value', with: 'Characteristics value 1')
                expect(page).to have_field('Unit', with: 'unit 1')
                expect(page).to have_field('Data Type', with: 'STRING')
              end
            end

            # Instrument Child 2
            expect(page).to have_field('draft_platforms_1_instruments_0_composed_of_1_short_name', with: 'SMAP L-BAND RADIOMETER')
            expect(page).to have_field('draft_platforms_1_instruments_0_composed_of_1_long_name', with: 'SMAP L-Band Radiometer')
          end

          # Instrument 2
          expect(page).to have_field('draft_platforms_1_instruments_1_short_name', with: 'LVIS')
          expect(page).to have_field('draft_platforms_1_instruments_1_long_name', with: 'Land, Vegetation, and Ice Sensor')
        end
      end

      within '.projects' do
        expect(page).to have_field('Short Name', with: 'AA')
        expect(page).to have_field('Long Name', with: 'ARCATLAS')
        expect(page).to have_selector('input.campaign[value="Project campaign 1"]')
        expect(page).to have_selector('input.campaign[value="Project campaign 2"]')
        expect(page).to have_field('Start Date', with: '2015-07-01T00:00:00Z')
        expect(page).to have_field('End Date', with: '2015-08-01T00:00:00Z')

        expect(page).to have_field('Short Name', with: 'EUCREX-94')
      end
    end
  end
end
