class CollectionDraft < Draft
  include CollectionDraftsHelper

  def display_entry_title
    entry_title || '<Untitled Collection Record>'
  end

  class << self
    def forms
      CollectionDraftsHelper::DRAFT_FORMS
    end

    def get_next_form(name, direction)
      delta = direction == 'Next' ? 1 : -1
      index = CollectionDraftsHelper::DRAFT_FORMS.index(name)
      CollectionDraftsHelper::DRAFT_FORMS[index + delta] || CollectionDraftsHelper::DRAFT_FORMS.first
    end

    def create_from_template(template, user)
      template['draft'].delete('TemplateName')
      draft = CollectionDraft.new do |d|
        d.draft = template.draft
        d.entry_title = template.entry_title
        d.user = user
        d.provider_id = template.provider_id
        d.short_name = template.short_name
      end
      draft.save
      draft
    end

    def create_from_collection(collection, user, native_id)
      new_entry_title = (collection['EntryTitle'].blank?) ? nil : collection['EntryTitle']

      if native_id
        # Edited record
        draft = CollectionDraft.find_or_create_by(native_id: native_id)
        draft.entry_title = new_entry_title
        draft.short_name = (collection['ShortName'].blank?) ? nil : collection['ShortName']
      else
        # Cloned record
        draft = CollectionDraft.create
        draft.entry_title = "#{new_entry_title} - Cloned"
        collection['EntryTitle'] = "#{new_entry_title} - Cloned"
        draft.short_name = nil
        collection.delete('ShortName')
        collection.delete('MetadataDates')
      end
      draft.user = user
      draft.provider_id = user.provider_id # TODO is this problematic for collections editing permissions?
      draft.draft = collection
      draft.save
      draft
    end
  end
end
