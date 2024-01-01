class Slide < ApplicationRecord
    has_one_attached :image
    def get_image(width, height)
        unless image.attached?
            file_path = Rails.root.join('app/assets/images/soso.svg')
            image.attach(io: File.open(file_path), filename: 'default-image.jpg', content_type: 'image/jpeg')
        end
        image.variant(resize_to_fit: [width, height]).processed
    end
end
