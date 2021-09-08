describe DraftMailer do
  context 'draft_published_notification' do
    user = { name: 'Captain Planet', email: 'supergreen@bluemarble.com' }

    context 'when publishing a new record' do
      concept_id = 'C1200000007-SEDAC'
      revision_id = 1
      short_name = 'CIESIN_SEDAC_EPI_2010'
      version = 2010
      let(:mail) { described_class.draft_published_notification(user, concept_id, revision_id, short_name, version) }

      it 'renders the subject' do
        expect(mail.subject).to eq('New Record Published in Metadata Management Tool (test)')
      end

      it 'renders the receiver email' do
        expect(mail.to).to eq([user[:email]])
      end

      it 'renders the sender email' do
        expect(mail.from).to eq(['no-reply@earthdata.nasa.gov'])
      end

      it 'renders the new record published notice including short name + version' do
        expect(mail.html_part.body).to have_content("#{short_name}_#{version} Published")
        expect(mail.html_part.body).to have_content("#{user[:name]}, Your collection metadata record #{short_name}_#{version} has been successfully published to the CMR (test).", normalize_ws: true)
        expect(mail.text_part.body).to have_content("#{user[:name]}, Your collection metadata record #{short_name}_#{version} has been successfully published to the CMR (test).", normalize_ws: true)
      end

      it 'renders the concept id' do
        expect(mail.html_part.body).to have_content(concept_id)
        expect(mail.text_part.body).to have_content(concept_id)
      end

      it 'renders the link to the collection' do
        expect(mail.html_part.body).to have_link('View Collection', href: collection_url(concept_id, revision_id: revision_id))
        # link renders as text in text format email
        expect(mail.text_part.body).to have_content(collection_url(concept_id, revision_id: revision_id))
      end
    end

    context 'when publishing an update' do
      concept_id = 'C1200000059-LARC'
      revision_id = 3
      short_name = 'AE_5DSno'
      version = 1
      existing_errors = nil
      warnings = nil
      let(:mail) { described_class.draft_published_notification(user, concept_id, revision_id, short_name, version, existing_errors, warnings) }

      it 'renders the subject' do
        expect(mail.subject).to eq('Record Updated in Metadata Management Tool (test)')
      end

      it 'renders the receiver email' do
        expect(mail.to).to eq([user[:email]])
      end

      it 'renders the sender email' do
        expect(mail.from).to eq(['no-reply@earthdata.nasa.gov'])
      end

      it 'renders the record updated notice including short name + version' do
        expect(mail.html_part.body).to have_content("#{short_name}_#{version} Updated")
        expect(mail.html_part.body).to have_content("#{user[:name]}, Your collection metadata record #{short_name}_#{version} has been successfully updated in the CMR (test).", normalize_ws: true)
        expect(mail.text_part.body).to have_content("#{user[:name]}, Your collection metadata record #{short_name}_#{version} has been successfully updated in the CMR (test).", normalize_ws: true)
      end

      it 'does not include in the record updated notice published with issues information' do
        expect(mail.html_part.body).to have_no_content('Your collection was published with the following issues:')
        expect(mail.text_part.body).to have_no_content('Your collection was published with the following issues:')
        expect(mail.html_part.body).to have_no_content('Existing Errors: ')
        expect(mail.text_part.body).to have_no_content('Existing Errors: ')
        expect(mail.html_part.body).to have_no_content('Warnings: ')
        expect(mail.text_part.body).to have_no_content('Warnings: ')
      end

      it 'renders the concept id' do
        expect(mail.html_part.body).to have_content(concept_id)
        expect(mail.text_part.body).to have_content(concept_id)
      end

      it 'renders the link to the collection' do
        expect(mail.html_part.body).to have_link('View Collection', href: collection_url(concept_id, revision_id: revision_id))
        # link renders as text in text format email
        expect(mail.text_part.body).to have_content(collection_url(concept_id, revision_id: revision_id))
      end
    end

    context 'when publishing an update with existing errors' do
      concept_id = 'C1200000091-MMT_2'
      revision_id = 4
      short_name = 'ERS-2_L0'
      version = 3
      existing_errors = 'After translating item to UMM-C the metadata had the following existing error(s): [:TemporalExtents 0 :RangeDateTimes 0] BeginningDateTime [2011-07-04T00:23:48.000Z] must be no later than EndingDateTime [1995-10-01T03:13:03.000Z]. [:Platforms] The Platform ShortName [ERS-3] must be unique. This record contains duplicates.. [:AdditionalAttributes 0] Parameter Range Begin is not allowed for type [STRING]. [:Projects] Projects must be unique. This contains duplicates named [IceBridge].. [:MetadataAssociations] Metadata Associations must be unique. This contains duplicates named [(EntryId [C1234453343-ECHO_REST] & Version [1])].. [:TilingIdentificationSystems] Tiling Identification Systems must be unique. This contains duplicates named [CALIPSO].'
      warnings = 'After translating item to UMM-C the metadata had the following issue(s): [:TemporalExtents 0 :RangeDateTimes 0] BeginningDateTime [2011-07-04T00:23:48.000Z] must be no later than EndingDateTime [1995-10-01T03:13:03.000Z]. [:Platforms] The Platform ShortName [ERS-3] must be unique. This record contains duplicates.. [:AdditionalAttributes 0] Parameter Range Begin is not allowed for type [STRING]. [:Projects] Projects must be unique. This contains duplicates named [IceBridge].. [:MetadataAssociations] Metadata Associations must be unique. This contains duplicates named [(EntryId [C1234453343-ECHO_REST] & Version [1])].. [:TilingIdentificationSystems] Tiling Identification Systems must be unique. This contains duplicates named [CALIPSO].'
      let(:mail) { described_class.draft_published_notification(user, concept_id, revision_id, short_name, version, existing_errors, warnings) }

      it 'renders the subject' do
        expect(mail.subject).to eq('Record Updated in Metadata Management Tool (test)')
      end

      it 'renders the receiver email' do
        expect(mail.to).to eq([user[:email]])
      end

      it 'renders the sender email' do
        expect(mail.from).to eq(['no-reply@earthdata.nasa.gov'])
      end

      it 'renders the record updated notice including short name + version' do
        expect(mail.html_part.body).to have_content("#{short_name}_#{version} Updated")
        expect(mail.html_part.body).to have_content("#{user[:name]}, Your collection metadata record #{short_name}_#{version} has been successfully updated in the CMR (test).", normalize_ws: true)
        expect(mail.text_part.body).to have_content("#{user[:name]}, Your collection metadata record #{short_name}_#{version} has been successfully updated in the CMR (test).", normalize_ws: true)
      end

      it 'includes in the record updated notice published with errors information' do
        expect(mail.html_part.body).to have_content('Your collection was published with the following issues:')
        expect(mail.html_part.body).to have_content('Existing Errors: After translating item to UMM-C the metadata had the following existing error(s): [:TemporalExtents 0 :RangeDateTimes 0] BeginningDateTime [2011-07-04T00:23:48.000Z] must be no later than EndingDateTime [1995-10-01T03:13:03.000Z]. [:Platforms] The Platform ShortName [ERS-3] must be unique. This record contains duplicates.. [:AdditionalAttributes 0] Parameter Range Begin is not allowed for type [STRING]. [:Projects] Projects must be unique. This contains duplicates named [IceBridge].. [:MetadataAssociations] Metadata Associations must be unique. This contains duplicates named [(EntryId [C1234453343-ECHO_REST] & Version [1])].. [:TilingIdentificationSystems] Tiling Identification Systems must be unique. This contains duplicates named [CALIPSO].')
        expect(mail.html_part.body).to have_content('Warnings: After translating item to UMM-C the metadata had the following issue(s): [:TemporalExtents 0 :RangeDateTimes 0] BeginningDateTime [2011-07-04T00:23:48.000Z] must be no later than EndingDateTime [1995-10-01T03:13:03.000Z]. [:Platforms] The Platform ShortName [ERS-3] must be unique. This record contains duplicates.. [:AdditionalAttributes 0] Parameter Range Begin is not allowed for type [STRING]. [:Projects] Projects must be unique. This contains duplicates named [IceBridge].. [:MetadataAssociations] Metadata Associations must be unique. This contains duplicates named [(EntryId [C1234453343-ECHO_REST] & Version [1])].. [:TilingIdentificationSystems] Tiling Identification Systems must be unique. This contains duplicates named [CALIPSO].')

        expect(mail.text_part.body).to have_content('Your collection was published with the following issues:')
        expect(mail.text_part.body).to have_content('Existing Errors: After translating item to UMM-C the metadata had the following existing error(s): [:TemporalExtents 0 :RangeDateTimes 0] BeginningDateTime [2011-07-04T00:23:48.000Z] must be no later than EndingDateTime [1995-10-01T03:13:03.000Z]. [:Platforms] The Platform ShortName [ERS-3] must be unique. This record contains duplicates.. [:AdditionalAttributes 0] Parameter Range Begin is not allowed for type [STRING]. [:Projects] Projects must be unique. This contains duplicates named [IceBridge].. [:MetadataAssociations] Metadata Associations must be unique. This contains duplicates named [(EntryId [C1234453343-ECHO_REST] & Version [1])].. [:TilingIdentificationSystems] Tiling Identification Systems must be unique. This contains duplicates named [CALIPSO].')
        expect(mail.text_part.body).to have_content('Warnings: After translating item to UMM-C the metadata had the following issue(s): [:TemporalExtents 0 :RangeDateTimes 0] BeginningDateTime [2011-07-04T00:23:48.000Z] must be no later than EndingDateTime [1995-10-01T03:13:03.000Z]. [:Platforms] The Platform ShortName [ERS-3] must be unique. This record contains duplicates.. [:AdditionalAttributes 0] Parameter Range Begin is not allowed for type [STRING]. [:Projects] Projects must be unique. This contains duplicates named [IceBridge].. [:MetadataAssociations] Metadata Associations must be unique. This contains duplicates named [(EntryId [C1234453343-ECHO_REST] & Version [1])].. [:TilingIdentificationSystems] Tiling Identification Systems must be unique. This contains duplicates named [CALIPSO].')
      end

      it 'renders the concept id' do
        expect(mail.html_part.body).to have_content(concept_id)
        expect(mail.text_part.body).to have_content(concept_id)
      end

      it 'renders the link to the collection' do
        expect(mail.html_part.body).to have_link('View Collection', href: collection_url(concept_id, revision_id: revision_id))
        # link renders as text in text format email
        expect(mail.text_part.body).to have_content(collection_url(concept_id, revision_id: revision_id))
      end
    end
  end
end
