describe 'Publishing collection draft records', js: true do
  before do
    login
  end

  context 'when publishing a collection draft with newly added forms, values, features when UMM-C is updated' do
    before do
      draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first)
      visit collection_draft_path(draft)
    end

    context 'when new Direct Distribution Information fieldset is added in UMM 1.17.0',js:true do
      before do
        find('i.direct-distribution-information').click
      end

      it 'contains the expected factory values' do
        within '.direct-distribution-information' do
          expect(page).to have_field('Region', with: 'us-east-2')
          expect(page).to have_field('S3 Credentials API Endpoint', with: 'link.com')
          expect(page).to have_field('S3 Credentials API Documentation URL', with: 'amazon.com')
          within ('.simple-multiple.s3-bucket-and-object-prefix-names') do
            expect(page).to have_field(with: 'prefix-1')
            expect(page).to have_field(with: 'prefix-2')
            expect(page).to have_field(with: 'prefix-3')
          end
        end
      end

      context 'when adding new values, saving, and publishing' do
        before do
          within '.direct-distribution-information' do
            select 'us-east-1', from: 'Region'
            find('.multiple-item-0').fill_in with: 'prefix-1'
            click_on 'Add another Prefix Name'
            find('.multiple-item-1').fill_in with: 'prefix-2'
            click_on 'Add another Prefix Name'
            find('.multiple-item-2').fill_in with: 'prefix-3'
            fill_in 'S3 Credentials API Endpoint', with: 'linkage.com'
            fill_in 'S3 Credentials API Documentation URL', with: 'aws.com'
          end
          within '.nav-top' do
            click_on 'Done'
          end
          click_on 'Publish'
        end

        it 'shows the new information in the preview' do
          within '#metadata-preview' do
            screenshot_and_open_image
            expect(page).to have_content('us-east-1')
            expect(page).to have_content('prefix-1')
            expect(page).to have_content('prefix-2')
            expect(page).to have_content('prefix-3')
            expect(page).to have_content('linkage.com')
            expect(page).to have_content('aws.com')
          end
        end
      end
    end

    context 'when new Associated DOIs fieldset is added in UMM 1.17.0' do
      before do
        click_on 'Collection Information'
      end

      it 'contains the expected factory values' do
        expect(page).to have_field('DOI', with: 'Associated DOI')
        expect(page).to have_field('Title', with: 'Associated DOI Title')
        expect(page).to have_field('Authority', with: 'Associated DOI Authority')
      end

      context 'when adding new values, saving, and publishing' do
        before do
          click_on 'Add another Associated DOI'
          fill_in 'draft_associated_dois_1_doi', with: 'Associated DOI 1'
          fill_in 'draft_associated_dois_1_title', with: 'Associated DOI Title 1'
          fill_in 'draft_associated_dois_1_authority', with: 'Associated DOI Authority 1'

          within '.nav-top' do
            click_on 'Done'
          end
          click_on 'Publish'
        end

        it 'shows the new information in the preview' do
          within '#metadata-preview' do
            expect(page).to have_content('Associated DOI')
            expect(page).to have_content('Associated DOI Title')
            expect(page).to have_content('Associated DOI Authority')
            expect(page).to have_content('Associated DOI 1')
            expect(page).to have_content('Associated DOI Title 1')
            expect(page).to have_content('Associated DOI Authority 1')
          end
        end
      end
    end
  end

  context 'when publishing a collection draft record' do
    before do
      @email_count = ActionMailer::Base.deliveries.count

      draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first, draft_short_name: '12345', draft_entry_title: 'Draft Title')
      visit collection_draft_path(draft)
      click_on 'Publish'
    end

    it 'displays the published record page' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('12345_1')
      end
    end

    it 'displays the published metadata' do
      within '#metadata-preview' do
        expect(page).to have_content('12345')
        expect(page).to have_content('Draft Title')
        expect(page).to have_no_css('td', text: 'Not Provided', count: 8)
      end
    end
  end

  context 'when publishing an incomplete record' do
    before do
      draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
      visit collection_draft_path(draft)
      click_on 'Publish'
    end

    it 'displays a message to the user' do
      message = 'This draft is not ready to be published. Please use the progress indicators on the draft preview page to address incomplete or invalid fields.'
      expect(page).to have_content(message)
    end
  end

  context 'when publishing a new draft that has a non url encoded native id' do
    before do
      draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first, native_id: 'not & url, encoded / native id', draft_short_name: 'test short name')
      visit collection_draft_path(draft)
      click_on 'Publish'
    end

    it 'displays the published record page' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('test short name_1')
      end
    end
  end
end
