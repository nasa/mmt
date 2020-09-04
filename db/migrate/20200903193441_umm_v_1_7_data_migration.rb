# Data migration associated with UMM-V 1.7 schema update.
# Because of the removal of GroupPath and its combination with Name, this
# migration will force users to acknowledge the new variable name if the draft
# had an existing GroupPath. This will be accomplished by rendering the data
# invalid by placing a ? as the first character of the new name. This decision
# was made to try to ensure that a user is intentionally choosing to have either
# a hierarchical or flat variable rather than putting them in a position where
# the application may have made that decision for them.
class UmmV17DataMigration < ActiveRecord::Migration[5.2]
  def up
    drafts = VariableDraft.where.not(draft: {})

    drafts.each do |draft|
      draft.draft.delete('Alias')
      draft.draft.delete('AcquisitionSourceName')
      draft.draft.delete('SizeEstimation')

      draft.draft = merge_and_invalidate_name_for_1_7(draft.draft)
      draft.draft = pull_indexes_to_top_for_1_7(draft.draft)

      draft.save
    end
  end

  def down
    drafts = VariableDraft.where.not(draft: {})

    drafts.each do |draft|
      draft.draft.delete('StandardName')
      draft.draft.delete('AdditionalIdentifiers')

      draft.draft = push_indexes_into_characteristics_for_1_6(draft.draft)

      draft.save
    end
  end

  ############################# To 1.7 ########################################
  # Merge the name and GroupPath fields and invalidate them so that the user is
  # forced to confirm that this is the name they intend to submit.
  def merge_and_invalidate_name_for_1_7(draft)
    return draft unless draft['Name'] || draft.dig('Characteristics', 'GroupPath')
    return draft if draft['Name'] && !draft.dig('Characteristics', 'GroupPath')
    return draft['Name'] = "?#{draft.dig('Characteristics', 'GroupPath')}" if draft.dig('Characteristics', 'GroupPath') && !draft['Name']

    draft['Name'] = if draft['Name'].start_with?('/') && draft.dig('Characteristics', 'GroupPath').end_with?('/')
                      "?#{draft.dig('Characteristics', 'GroupPath').chop}#{draft['Name']}"
                    elsif draft['Name'].start_with?('/') || draft.dig('Characteristics', 'GroupPath').end_with?('/')
                      "?#{draft.dig('Characteristics', 'GroupPath')}#{draft['Name']}"
                    else
                      "?#{draft.dig('Characteristics', 'GroupPath')}/#{draft['Name']}"
                    end
    draft
  end

  def pull_indexes_to_top_for_1_7(draft)
    return draft unless draft.dig('Characteristics', 'IndexRanges')

    draft['IndexRanges'] = draft.delete('Characteristics')['IndexRanges']
    draft
  end

  ############################### END #########################################
  ############################# To 1.6 ########################################

  def push_indexes_into_characteristics_for_1_6(draft)
    return draft unless draft['IndexRanges']

    draft['Characteristics'] = { 'IndexRanges' => draft.delete('IndexRanges') }
    draft
  end
end
