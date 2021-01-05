describe 'Related URLs information form', js: true do
  before do
    login
    draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
    visit collection_draft_path(draft)
    within '.metadata' do
      click_on 'Related URLs', match: :first
    end
  end

  context 'when checking the accordion headers for required icons' do
    it 'does not display required icons for accordions in Related URLs section' do
      expect(page).to have_no_css('h3.eui-required-o.always-required')
    end
  end

  context 'when submitting the form' do
    before do
      open_accordions

      # Complete RelatedUrl fields
      add_related_urls

      within '.nav-top' do
        click_on 'Save'
      end
      # output_schema_validation Draft.first.draft
      open_accordions
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Collection Draft Updated Successfully!')
    end

    it 'populates the form with the values' do
      within '.multiple.related-urls > .multiple-item-0' do
        expect(page).to have_field('Description', with: 'Example Description')
        expect(page).to have_field('URL Content Type', with: 'CollectionURL')
        expect(page).to have_field('Type', with: 'DATA SET LANDING PAGE')
        expect(page).to have_field('URL', with: 'http://example.com')
      end

      within '.multiple.related-urls > .multiple-item-1' do
        expect(page).to have_field('Description', with: 'Example Description 2')
        expect(page).to have_field('URL Content Type', with: 'DistributionURL')
        expect(page).to have_field('Type', with: 'GET DATA')
        expect(page).to have_field('Subtype', with: 'DIRECT DOWNLOAD')
        expect(page).to have_field('URL', with: 'https://example.com/')

        expect(page).to have_field('Format', with: 'CSV')
        expect(page).to have_field('Size', with: '42.0')
        expect(page).to have_field('Unit', with: 'KB')
        expect(page).to have_field('Fees', with: '0')
        expect(page).to have_field('Checksum', with: 'testchecksum123')
      end
    end

    context 'when changing Distribution URL and Get Data to another URL Content Type and Type' do
      # MMT-1417: Get Data & Get Service forms need to be cleared when Distribution URL and/or Get Data (or Use Service API) is changed.
      before do
        within '.multiple.related-urls > .multiple-item-1' do
          # remove the required Format field value so that, if the Get Data form isn't cleared, the Missing Format error is raised
          within '.get-data' do
            select 'Select Format', from: 'Format'
          end
          select 'Use Service API', from: 'Type'
          within '.get-service' do
            select 'application/json', from: 'Mime Type'
            select 'HTTP', from: 'Protocol'
            fill_in 'Full Name', with: 'fullname123'
            fill_in 'Data ID', with: 'dataid123'
            fill_in 'Data Type', with: 'datatype123'
          end
        end
        within '.nav-top' do
          click_on 'Save'
        end
      end

      it 'does not raise missing Format error' do
        expect(page).to have_content('Collection Draft Updated Successfully!')
      end

      context 'when navigating to the Get Data form' do
        before do
          within '.multiple.related-urls > .multiple-item-1' do
            select 'Get Data', from: 'Type'
          end
        end

        it 'cleared the Get Data form' do
          within '.multiple.related-urls > .multiple-item-1' do
            within '.get-data' do
              expect(page).to have_field('Size', with: '')
              expect(page).to have_field('Unit', with: '')
              expect(page).to have_field('Fees', with: '')
              expect(page).to have_field('Checksum', with: '')
            end
          end
        end

        it 'the Format field contains ' do
          within '.multiple.related-urls > .multiple-item-1' do
            within '.get-data' do
              expect(page).to have_select('Format', with_options: ['CSV', 'HDF4', 'HDF5', 'JPEG', 'Not provided'])
            end
          end
        end
      end

      context 'when navigating to the Get Service form' do
        before do
          within '.multiple.related-urls > .multiple-item-1' do
            select 'Goto Web Tool', from: 'Type'
            # re-select Use Service API to see if the form cleared
            select 'Use Service API', from: 'Type'
          end
        end

        it 'cleared the Get Service form' do
          within '.multiple.related-urls > .multiple-item-1' do
            within '.get-service' do
              expect(page).to have_field('Mime Type', with: '')
              expect(page).to have_field('Protocol', with: '')
              expect(page).to have_field('Full Name', with: '')
              expect(page).to have_field('Data ID', with: '')
              expect(page).to have_field('Data Type', with: '')
            end
          end
        end
      end
    end
  end
end
