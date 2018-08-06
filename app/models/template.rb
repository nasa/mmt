class Template < ActiveRecord::Base
  belongs_to :user
  serialize :draft, JSON

  def display_title
    title || '<Untitled Template>'
  end

  class << self
    def create_collection_template(draft, user, name)
      template = Template.new do |temp|
        temp.draft = draft.draft
        temp.entry_title = draft.entry_title
        temp.user = user
        temp.title = name
        temp.provider_id = user.provider_id
        temp.template_type = 'CollectionTemplate'
      end
      template.save
      template
    end
  end
end
