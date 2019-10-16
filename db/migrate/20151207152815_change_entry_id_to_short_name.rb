class ChangeEntryIdToShortName < ActiveRecord::Migration[4.2]
  def up
    Draft.find_each do |d|
      draft = d.draft
      if draft && draft['EntryId']
        entry_id = draft.delete('EntryId')
        draft['ShortName'] = entry_id
        d.draft = draft
        d.save
      end
    end

    rename_column :drafts, :entry_id, :short_name
  end

  def down
    Draft.find_each do |d|
      draft = d.draft
      if draft && draft['ShortName']
        short_name = draft.delete('ShortName')
        draft['EntryId'] = short_name
        d.draft = draft
        d.save
      end
    end

    rename_column :drafts, :short_name, :entry_id
  end
end
