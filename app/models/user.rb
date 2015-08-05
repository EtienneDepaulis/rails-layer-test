class User < ActiveRecord::Base

  def to_s
    name
  end

  def identity_token
    "#{id}-secret-identity-token"
  end

end
