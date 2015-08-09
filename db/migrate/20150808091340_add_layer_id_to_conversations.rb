class AddLayerIdToConversations < ActiveRecord::Migration
  def change
    add_column :conversations, :layer_id, :string
  end
end
