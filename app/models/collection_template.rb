class CollectionTemplate < Template
  include CollectionDraftsHelper

  class << self
    def forms
      CollectionDraftsHelper::DRAFT_FORMS
    end

    def get_next_form(name, direction)
      delta = direction == 'Next' ? 1 : -1
      index = CollectionDraftsHelper::DRAFT_FORMS.index(name)
      CollectionDraftsHelper::DRAFT_FORMS[index + delta] || CollectionDraftsHelper::DRAFT_FORMS.first
    end

    def create_template(draft, user, name)
      template = CollectionTemplate.new do |temp|
        temp.draft = draft.draft
        temp.user = user
        temp.entry_title = draft.entry_title
        temp.template_name = name
        temp.provider_id = user.provider_id
        temp.short_name = draft.short_name
      end
      template.save
      template
    end

    def create_from_collection(collection, user, native_id)
      new_entry_title = (collection['EntryTitle'].blank?) ? nil : collection['EntryTitle']

      if native_id
        # Edited record
        draft = CollectionTemplate.find_or_create_by(native_id: native_id)
        draft.entry_title = new_entry_title
        draft.short_name = (collection['ShortName'].blank?) ? nil : collection['ShortName']
      else
        # Cloned record
        draft = CollectionTemplate.create
        draft.entry_title = "#{new_entry_title} - Cloned Template"
        collection['EntryTitle'] = "#{new_entry_title} - Cloned Template"
        draft.short_name = nil
        collection.delete('ShortName')
        collection.delete('MetadataDates')
        collection['TemplateName'] = template_name
      end
      draft.user = user
      draft.provider_id = user.provider_id # TODO: is this problematic for collections editing permissions?
      draft.draft = collection
      draft.template_name = template_name
      draft.save
      draft
    end
  end
end
