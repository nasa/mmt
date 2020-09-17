# Data migration associated with UMM-V 1.7 schema update.
class UmmV17DataMigration < ActiveRecord::Migration[5.2]
  def up
    drafts = VariableDraft.where.not(draft: {})

    drafts.each do |draft|
      draft.draft.delete('Alias')
      draft.draft.delete('AcquisitionSourceName')
      draft.draft.delete('SizeEstimation')

      draft.draft = merge_group_path_and_name_for_1_7(draft.draft)
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
  # Merge the name and GroupPath fields with only one slash between them
  def merge_group_path_and_name_for_1_7(draft)
    return draft unless draft['Characteristics']

    characteristics = draft['Characteristics']
    return draft unless characteristics.is_a?(Hash) && characteristics['GroupPath']

    # There may be cases where an existing group_path contains the name already
    # If there is no name or if the name is already within the group_path,
    # save that as new name.
    group_path = characteristics['GroupPath']
    if group_path && !draft['Name'] || draft['Name'] && group_path.end_with?(draft['Name'])
      draft['Name'] = group_path
      return draft
    end

    draft['Name'] = if draft['Name'].start_with?('/') && group_path.end_with?('/')
                      "#{group_path.chop}#{draft['Name']}"
                    elsif draft['Name'].start_with?('/') || group_path.end_with?('/')
                      "#{group_path}#{draft['Name']}"
                    else
                      "#{group_path}/#{draft['Name']}"
                    end
    draft
  end

  def pull_indexes_to_top_for_1_7(draft)
    return draft unless draft['Characteristics']

    characteristics = draft.delete('Characteristics')
    return draft unless characteristics.is_a?(Hash) && characteristics['IndexRanges']

    draft['IndexRanges'] = characteristics['IndexRanges']
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
