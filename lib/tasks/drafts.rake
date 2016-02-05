require 'factory_girl'

namespace :drafts do
  desc 'Load full draft into database'
  task load_full: :environment do
    draft = FactoryGirl.build(:full_draft)

    found_draft = Draft.where(native_id: draft.native_id)
    if found_draft.empty?
      new_draft = FactoryGirl.create(:full_draft,
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

  desc 'Load required fields only draft into database'
  task load_required: :environment do
    draft = FactoryGirl.build(:draft_all_required_fields)

    found_draft = Draft.where(native_id: draft.native_id)
    if found_draft.empty?
      new_draft = FactoryGirl.create(:draft_all_required_fields,
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
end
