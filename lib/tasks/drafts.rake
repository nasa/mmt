require 'faker'
require 'factory_bot'
require 'csv'

namespace :drafts do
  desc 'Load full draft into database'
  task load_full: :environment do
    draft = FactoryBot.build(:full_collection_draft)

    found_draft = Draft.where(native_id: draft.native_id)
    if found_draft.empty?
      new_draft = FactoryBot.create(:full_collection_draft,
                                     user: User.first,
                                     provider_id: User.first.provider_id,
                                     short_name: draft.draft['ShortName'],
                                     entry_title: draft.draft['EntryTitle']
                                    )
      puts "Loaded full draft, ID: #{new_draft.id}"
    else
      puts "Did not load full draft, it was already loaded, ID: #{found_draft.first.id}"
    end
  end

  desc 'Load full draft into database'
  task load_full_variable: :environment do
    draft = FactoryBot.build(:full_variable_draft)

    found_draft = Draft.where(native_id: draft.native_id)
    if found_draft.empty?
      new_draft = FactoryBot.create(:full_variable_draft,
                                     user: User.first,
                                     provider_id: User.first.provider_id,
                                     short_name: draft.draft['Name'],
                                     entry_title: draft.draft['LongName']
                                    )
      puts "Loaded full draft, ID: #{new_draft.id}"
    else
      puts "Did not load full draft, it was already loaded, ID: #{found_draft.first.id}"
    end
  end

  desc 'Load full draft into database'
  task load_full_service: :environment do
    draft = FactoryBot.build(:full_service_draft)

    found_draft = Draft.where(native_id: draft.native_id)
    if found_draft.empty?
      new_draft = FactoryBot.create(:full_service_draft,
                                     user: User.first,
                                     provider_id: User.first.provider_id,
                                     short_name: draft.draft['Name'],
                                     entry_title: draft.draft['LongName']
                                    )
      puts "Loaded full draft, ID: #{new_draft.id}"
    else
      puts "Did not load full draft, it was already loaded, ID: #{found_draft.first.id}"
    end
  end

  desc 'Load required fields only draft into database'
  task load_required: :environment do
    draft = FactoryBot.build(:collection_draft_all_required_fields)

    found_draft = Draft.where(native_id: draft.native_id)
    if found_draft.empty?
      new_draft = FactoryBot.create(:collection_draft_all_required_fields,
                                     user: User.first,
                                     provider_id: User.first.provider_id,
                                     short_name: draft.draft['ShortName'],
                                     entry_title: draft.draft['EntryTitle']
                                    )
      puts "Loaded required fields only draft, ID: #{new_draft.id}"
    else
      puts "Did not load required fields only draft, it was already loaded, ID: #{found_draft.first.id}"
    end
  end

  desc 'Load draft with invalid picklists into database'
  task load_invalid_picklists: :environment do
    draft = FactoryBot.build(:collection_draft_invalid_picklists)

    found_draft = Draft.where(native_id: draft.native_id)
    if found_draft.empty?
      new_draft = FactoryBot.create(:collection_draft_invalid_picklists,
                                     user: User.first,
                                     provider_id: User.first.provider_id,
                                     short_name: draft.draft['ShortName'],
                                     entry_title: draft.draft['EntryTitle']
                                    )
      puts "Loaded draft with invalid picklists, ID: #{new_draft.id}"
    else
      puts "Did not load draft with invalid picklists, it was already loaded, ID: #{found_draft.first.id}"
    end
  end

  desc 'Load draft dump for debugging'
  task load_drafts_dump: :environment do
    Draft.destroy_all
    filename = File.join(Rails.root, 'tmp', 'drafts_dump.csv')
    if File.file?(filename)
      CSV.foreach(filename) do |row|
        draft = Draft.new do |d|
          # Draft(id: integer, user_id: integer, draft: text, created_at: datetime, updated_at: datetime, short_name: string, entry_title: string, provider_id: string, native_id: string)
          d.id = row[0]
          d.user_id = row[1]
          d.draft = eval(row[2])
          d.created_at = row[3]
          d.updated_at = row[4]
          d.short_name = row[5]
          d.entry_title = row[6]
          d.provider_id = row[7]
          d.native_id = row[8]
        end
        draft.save
      end
    else
      puts "You are missing the drafts dump CSV file (#{Rails.root}/tmp/drafts_dump.csv)"
    end
  end
end
