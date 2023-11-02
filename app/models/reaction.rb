class Reaction < ApplicationRecord
    validates :name, presence: true
    validates :name, uniqueness: true
    has_many :user_reactions
    has_one_attached :image

    def get_image(width, height)
        image.variant(resize_to_limit: [width, height]).processed
    end
end
