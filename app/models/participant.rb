class Participant < ActiveRecord::Base
  belongs_to :user
  belongs_to :conversation

  validates_presence_of :user, :conversation
end
