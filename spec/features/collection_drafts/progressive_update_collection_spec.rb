describe 'Progressive Update Collection Draft', reset_provider: true, js: true do
  before :all do
    @ingest_response = publish_progressive_update_collection
  end

  before do
    login

    visit collection_path(@ingest_response['concept-id'])
  end

  context 'When attempting to update a collection with existing errors' do
    before do
      click_on 'Edit Collection Record'
    end

    it 'creates a collection draft' do
      expect(page).to have_content('Collection Draft Created Successfully!')
      expect(page).to have_content('ERS-2_L0')
      expect(page).to have_content('ERS-2_LEVEL0')
      expect(page).to have_link('Publish Collection Draft')

      expect(Draft.count).to eq(1)
    end

    it 'indicates the draft has validation errors' do
      expect(page).to have_content('Warning: Your Collection Draft has missing or invalid fields.')
    end

    context 'when viewing the collection draft preview page' do
      it 'the collection draft progress circles indicate validation errors' do
        within '.progress-indicator' do
          expect(page).to have_css('.eui-icon.eui-fa-minus-circle.icon-red', count: 4)
        end
      end

      context 'When introducing a new error to the draft and attempting to publish' do
        before do
          # introduce a new error
          within '.progress-indicator' do
            click_on 'Processing Level - Required field complete'
          end

          select 'Select ID', from: 'ID'

          within '.nav-top' do
            click_on 'Done'
          end
          click_on 'Yes'

          click_on 'Publish Collection Draft'
        end

        it 'indicates the draft cannot be published' do
          within '#check-cmr-validation-draft-modal' do
            expect(page).to have_content('This draft is not ready to be published.')
            expect(page).to have_content('Please use the progress indicators on the draft preview page to address the following:')
            expect(page).to have_content('#/ProcessingLevel: required key [Id] not found')

            expect(page).to have_no_link('Yes, Publish Collection Draft')
          end
        end
      end

      context 'When attempting to publish with no new errors' do
        before do
          click_on 'Publish Collection Draft'
        end

        it 'indicates the draft can be published' do
          within '#check-cmr-validation-draft-modal' do
            expect(page).to have_content('This draft will be published with the following issues:')
            expect(page).to have_content('Existing Errors: After translating item to UMM-C the metadata had the following existing error(s):')
            expect(page).to have_content('[:TemporalExtents 0 :RangeDateTimes 0] BeginningDateTime [2011-07-04T00:23:48.000Z] must be no later than EndingDateTime [1995-10-01T03:13:03.000Z]')
            expect(page).to have_content('[:Platforms] The Platform ShortName [ERS-3] must be unique. This record contains duplicates')
            expect(page).to have_content('[:AdditionalAttributes 0] Parameter Range Begin is not allowed for type [STRING]')
            expect(page).to have_content('[:Projects] Projects must be unique. This contains duplicates named [IceBridge]')
            expect(page).to have_content('[:MetadataAssociations] Metadata Associations must be unique. This contains duplicates named [(EntryId [C1234453343-ECHO_REST] & Version [1])]')
            expect(page).to have_content('[:TilingIdentificationSystems] Tiling Identification Systems must be unique. This contains duplicates named [CALIPSO]')
            expect(page).to have_content('Warnings: After translating item to UMM-C the metadata had the following issue(s):')
            expect(page).to have_content('[:RelatedUrls 0 :URL] [https=>//vertex.daac.asf.alaska.edu/] is not a valid URL')
            expect(page).to have_content('Are you sure you want to publish this draft now?')
            expect(page).to have_link('Yes, Publish Collection Draft')
          end
        end

        context 'when publishing the draft' do
          before do
            click_on 'Yes, Publish Collection Draft'
          end

          it 'successfully publishes the update and displays the provided warnings' do
            expect(page).to have_content('Collection Draft Published Successfully!')

            expect(page).to have_content('Collection was published with the following issues:')
            expect(page).to have_content('Existing Errors: After translating item to UMM-C the metadata had the following existing error(s):')
            expect(page).to have_content('[:TemporalExtents 0 :RangeDateTimes 0] BeginningDateTime [2011-07-04T00:23:48.000Z] must be no later than EndingDateTime [1995-10-01T03:13:03.000Z]')
            expect(page).to have_content('[:Platforms] The Platform ShortName [ERS-3] must be unique. This record contains duplicates')
            expect(page).to have_content('[:AdditionalAttributes 0] Parameter Range Begin is not allowed for type [STRING]')
            expect(page).to have_content('[:Projects] Projects must be unique. This contains duplicates named [IceBridge]')
            expect(page).to have_content('[:MetadataAssociations] Metadata Associations must be unique. This contains duplicates named [(EntryId [C1234453343-ECHO_REST] & Version [1])]')
            expect(page).to have_content('[:TilingIdentificationSystems] Tiling Identification Systems must be unique. This contains duplicates named [CALIPSO]')
            expect(page).to have_content('Warnings: After translating item to UMM-C the metadata had the following issue(s):')
            expect(page).to have_no_content('Metadata Fields')
            expect(page).to have_no_css('ul.progress-indicator')
          end
        end
      end
    end
  end

  context 'When creating a new draft by cloning the collection with errors' do
    before do
      click_on 'Clone Collection Record'
    end

    it 'creates a collection draft' do
      expect(page).to have_link('Records must have a unique Short Name. Click here to enter a new Short Name.')
      expect(page).to have_content('<Blank Short Name>')
      expect(page).to have_content('ERS-2_LEVEL0 - Cloned')
      expect(page).to have_link('Publish Collection Draft')

      expect(Draft.count).to eq(1)
    end

    it 'indicates the draft has validation errors' do
      expect(page).to have_content('Warning: Your Collection Draft has missing or invalid fields.')
    end

    context 'when viewing the collection draft preview page' do
      it 'the collection draft progress circles indicate validation errors' do
        within '.progress-indicator' do
          expect(page).to have_css('.eui-icon.eui-fa-minus-circle.icon-red', count: 4)
        end
      end

      context 'when attempting to publish with no new errors' do
        before do
          # need to enter a unique short name
          click_on 'Click here to enter a new Short Name.'
          fill_in 'Short Name', with: 'ERS-2_L0-cloned'
          within '.nav-top' do
            click_on 'Done'
          end

          click_on 'Publish Collection Draft'
        end

        it 'indicates the draft cannot be published' do
          within '#invalid-draft-modal' do
            expect(page).to have_content('This draft is not ready to be published. Please use the progress indicators on the draft preview page to address incomplete or invalid fields.')

            expect(page).to have_no_link('Yes, Publish Collection Draft')
          end
        end
      end
    end
  end
end
