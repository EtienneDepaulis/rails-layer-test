class ConversationsController < ApplicationController

  def create
    layer = Layer::Api::Client.new

    conversation = {
      participants: User.all.pluck(:id).map(&:to_s),
      distinct: false
    }

    conversation = layer.create_conversation(conversation)

    Rails.logger.info conversation.inspect

    redirect_to root_path
  end

end
