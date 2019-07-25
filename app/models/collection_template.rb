class CollectionTemplate < CollectionDraft
  self.table_name = 'templates'
  # Unsure if this is still needed.  It's inherited from James.
  self.inheritance_column = :draft_type

  def display_entry_title
    template_name || '<Untitled Template>'
  end
end
