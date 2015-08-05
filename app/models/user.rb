class User < ActiveRecord::Base

  def to_s
    name
  end

  def generate_identity_token(nonce)
    layer = Layer::Api::Client.new

    layer.generate_identity_token(user_id: id, nonce: nonce)
  end

end
