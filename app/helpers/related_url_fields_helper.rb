module RelatedUrlFieldsHelper
  ORGANIZATIONS_FORM = %w(
    title
    description
    relation
    urls
  )
  DATA_CENTERS_FORM = %w(
    title
    description
    relation
    urls
  )
# Contact Persons? Contact Groups?
  PERSONNEL_FORM = %w(
    title
    description
    relation
    urls
  )
  NON_DATA_CENTER_AFFILIATION_FORM = %w(
    title
    description
    relation
    urls
  )

  DISTRIBUTION_FORM = %w(
    title
    description
    relation
    urls
    mime_type
    file_size
  )

  COLLECTION_CITATION_FORM = %w(
    title
    description
    relation
    urls
  )

  PUBLICATION_REFERENCE_FORM = %w(
    title
    description
    relation
    urls
  )
end
