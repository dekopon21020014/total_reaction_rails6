class Reaction < ApplicationRecord
    validates :name, presence: true
    validates :name, uniqueness: true
    has_many :user_reactions
end
