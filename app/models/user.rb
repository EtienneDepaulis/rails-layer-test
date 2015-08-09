class User < ActiveRecord::Base

  has_many :participants
  has_many :conversations, through: :participants

  def to_s
    name
  end

  def generate_identity_token(nonce)
    layer = Layer::Api::Client.new

    layer.generate_identity_token(user_id: id, nonce: nonce)
  end

  def layer_id
    "user_#{id}"
  end

end
