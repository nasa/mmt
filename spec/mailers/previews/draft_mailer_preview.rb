# Preview emails at http://localhost:3000/rails/mailers/draft_mailer
class DraftMailerPreview < ActionMailer::Preview
  def new_draft_published_notification
    user = { name: 'Captain Planet', email: 'supergreen@bluemarble.com' }
    concept_id = 'C1200000007-SEDAC'
    revision_id = 1
    short_name = 'CIESIN_SEDAC_EPI_2010'
    version = 2010

    DraftMailer.draft_published_notification(user, concept_id, revision_id, short_name, version)
  end

  def record_updated_notification
    user = { name: 'Captain Planet', email: 'supergreen@bluemarble.com' }
    concept_id = 'C1200000059-LARC'
    revision_id = 3
    short_name = 'AE_5DSno'
    version = 1
    existing_errors = nil
    warnings = nil

    DraftMailer.draft_published_notification(user, concept_id, revision_id, short_name, version, existing_errors, warnings)
  end

  def record_updated_with_errors_notification
    user = { name: 'Captain Planet', email: 'supergreen@bluemarble.com' }
    concept_id = 'C1200000091-MMT_2'
    revision_id = 4
    short_name = 'ERS-2_L0'
    version = 3
    existing_errors = 'After translating item to UMM-C the metadata had the following existing error(s): [:TemporalExtents 0 :RangeDateTimes 0] BeginningDateTime [2011-07-04T00:23:48.000Z] must be no later than EndingDateTime [1995-10-01T03:13:03.000Z]. [:Platforms] The Platform ShortName [ERS-3] must be unique. This record contains duplicates.. [:AdditionalAttributes 0] Parameter Range Begin is not allowed for type [STRING]. [:Projects] Projects must be unique. This contains duplicates named [IceBridge].. [:MetadataAssociations] Metadata Associations must be unique. This contains duplicates named [(EntryId [C1234453343-ECHO_REST] & Version [1])].. [:TilingIdentificationSystems] Tiling Identification Systems must be unique. This contains duplicates named [CALIPSO].'
    warnings = 'After translating item to UMM-C the metadata had the following issue(s): [:TemporalExtents 0 :RangeDateTimes 0] BeginningDateTime [2011-07-04T00:23:48.000Z] must be no later than EndingDateTime [1995-10-01T03:13:03.000Z]. [:Platforms] The Platform ShortName [ERS-3] must be unique. This record contains duplicates.. [:AdditionalAttributes 0] Parameter Range Begin is not allowed for type [STRING]. [:Projects] Projects must be unique. This contains duplicates named [IceBridge].. [:MetadataAssociations] Metadata Associations must be unique. This contains duplicates named [(EntryId [C1234453343-ECHO_REST] & Version [1])].. [:TilingIdentificationSystems] Tiling Identification Systems must be unique. This contains duplicates named [CALIPSO].'

    DraftMailer.draft_published_notification(user, concept_id, revision_id, short_name, version, existing_errors, warnings)
  end
end
