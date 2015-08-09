class CreateConversations < ActiveRecord::Migration
  def change
    create_table :conversations do |t|
      t.string :name
      t.string :layer_url

      t.timestamps null: false
    end
  end
end
