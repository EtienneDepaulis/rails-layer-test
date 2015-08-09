class Conversation < ActiveRecord::Base

  has_many :participants
  has_many :users, through: :participants

  after_create :create_on_layer_and_save_url

  def add_user(user)
    users << user

    add_user_on_layer(user)
  end

  def remove_user(user)
    users.delete(user)

    remove_user_on_layer(user)
  end


  private

    def create_on_layer_and_save_url
      conversation_params = { "participants": [], "metadata": { "title": name } }

      layer_conversation = layer_client.create_conversation(conversation_params)

      self.update_attributes(layer_url: layer_conversation["url"], layer_id: layer_conversation["id"])

      Rails.logger.info "Conversation created on Layer -> #{layer_url}"
    end

    def layer_client
      @layer_client ||= Layer::Api::Client.new
    end

    def stripped_layer_id
      layer_id.sub("layer:///conversations/", "")
    end

    def add_user_on_layer(user)
      operations = [{operation: "add", property: "participants", value: user.layer_id}]

      Rails.logger.info "Adding User #{user.layer_id} on Conversation #{stripped_layer_id}"
      layer_client.edit_conversation(stripped_layer_id, operations)
    end

    def remove_user_on_layer(user)
      operations = [{operation: "remove", property: "participants", value: user.layer_id}]

      layer_client.edit_conversation(stripped_layer_id, operations)
    end
end
