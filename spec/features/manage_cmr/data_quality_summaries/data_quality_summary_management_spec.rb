describe 'Viewing Data Quality Summaries', js: true do
  context 'when viewing the data quality summaries page with no summaries' do
    before do
      login

      visit manage_cmr_path

      VCR.use_cassette("data_quality_summaries/#{File.basename(__FILE__, '.rb')}_empty_vcr", record: :none) do
        click_on 'View Summaries'
      end
    end

    it 'displays the create data quality summary button' do
      expect(page).to have_content('No MMT_2 Data Quality Summaries found.')
    end
  end

  context 'when creating a data quality summary which is not available after creation' do
    before do
      login
      visit manage_cmr_path
      click_on 'Create a Summary'
      fill_in 'Name', with: 'DQS #01'
      page.execute_script("$('#summary').val('<p>Maecenas faucibus mollis interdum.</p>')")
      allow_any_instance_of(DataQualitySummariesController).to receive(:get_native_id).and_return('a_native_id')
      VCR.use_cassette("data_quality_summaries/#{File.basename(__FILE__, '.rb')}_not_available_vcr", record: :none) do
        click_on 'Submit'
      end
    end
    it 'displays data quality summaries' do
      expect(page).to have_content('Data Quality Summary successfully created but not yet available, please try again in a few minutes.')
      expect(page).to have_content('MMT_2 Data Quality Summaries')
    end
  end

  context 'when creating a data quality summary' do
    before do
      login

      visit manage_cmr_path

      click_on 'Create a Summary'
    end

    it 'displays the new data quality summary form' do
      expect(page).to have_content('New MMT_2 Data Quality Summary')
    end

    context 'when submitting an invalid data quality summary form' do
      before do
        fill_in 'Name', with: ''

        # body click will trigger validations, including redactor
        find('body').click

        click_on 'Submit'
      end

      it 'displays validation errors within the form' do
        expect(page).to have_content('Name is required.')
        expect(page).to have_content('Summary is required.')
      end
    end

    context 'when setting the value of the WYSIWYG using the api' do
      before do
        # Field is hidden because of the WYSIWYG so we'll need to use js to interact with it
        page.execute_script("$('#summary').val('<p>Maecenas faucibus mollis interdum.</p>')")
      end

      it 'sets the value of the hidden field correctly' do
        expect(page).to have_field('summary', with: '<p>Maecenas faucibus mollis interdum.</p>', visible: false)
      end

      context 'when submitting a valid data quality summaries form' do
        before do
          fill_in 'Name', with: 'DQS #1'
          allow_any_instance_of(DataQualitySummariesController).to receive(:get_native_id).and_return('a_native_id')
          VCR.use_cassette("data_quality_summaries/#{File.basename(__FILE__, '.rb')}_create_vcr", record: :none) do
            click_on 'Submit'
          end
        end

        it 'successfully creates a data quality summary' do
          expect(page).to have_content('Data Quality Summary successfully created')

          expect(page).to have_content('DQS #1')
          expect(page).to have_content('Maecenas faucibus mollis interdum.')
        end

        context 'when clicking the edit link for a data quality summary' do
          before do
            VCR.use_cassette("data_quality_summaries/#{File.basename(__FILE__, '.rb')}_created_vcr", record: :none) do
              # Breadcrumbs link
              click_on 'Data Quality Summaries'

              find(:xpath, "//tr[contains(.,'DQS #1')]/td/a", text: 'Edit').click
            end
          end

          it 'displays the edit form for the selected data quality form' do
            expect(page).to have_content('Edit MMT_2 Data Quality Summary')

            expect(page).to have_field('Name', with: 'DQS #1')
            expect(page).to have_field('Summary', visible: false, with: '<p>Maecenas faucibus mollis interdum.</p>')
          end

          context 'when submitting the updated values on the data quality summary form' do
            before do
              fill_in 'Name', with: 'DQS #1 MODIFIED'

              VCR.use_cassette("data_quality_summaries/#{File.basename(__FILE__, '.rb')}_update_vcr", record: :none) do
                click_on 'Submit'
              end
            end

            it 'successfully updates the data quality summary' do
              expect(page).to have_content('Data Quality Summary successfully updated')

              expect(page).to have_content('DQS #1 MODIFIED')
            end

            context 'when clicking the delete button for a data quality summary' do
              before do
                VCR.use_cassette("data_quality_summaries/#{File.basename(__FILE__, '.rb')}_delete_vcr", record: :none) do
                  click_on 'Delete'

                  # Confirmation Dialog
                  click_on 'Yes'
                end
              end

              it 'deletes the data quality summary' do
                expect(page).to have_content('Data Quality Summary successfully deleted')
              end
            end
          end
        end
      end
    end
  end
end
