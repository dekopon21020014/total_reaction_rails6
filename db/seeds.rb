# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

# Reaction.create([{name: 'hoge'}, {name: 'foo'}, {name: 'huga'}])

reaction = Reaction.create(
    name: "Good"
)
reaction.image.attach(io: File.open("app/assets/images/happy_woman.png"), filename:"good.png")

reaction = Reaction.create(
    name: "Soso"
)
reaction.image.attach(io: File.open("app/assets/images/office_chair_man.png"), filename:"soso.png")

reaction = Reaction.create(
    name: "Bad"
)
reaction.image.attach(io: File.open("app/assets/images/smartphone_gorogoro_man.png"), filename:"bad.png")

N = LIMIT / 3
N.times do |n|
    UserReaction.create(
        reaction_id: 1
    )

    UserReaction.create(
        reaction_id: 2
    )

    UserReaction.create(
        reaction_id: 3
    )
end

# 実験説明用スライド
for i in 1..10
    slide = Slide.create(
        script_id: 0
    )
    slide.image.attach(io: File.open("app/assets/images/slide0/slide0-#{i}.png"), filename:"slide0-#{i}.png")
end

# 実際に実験で用いるスライド
NUM_OF_EXPERIMENT = 4  # 試行数が4
NUM_OF_SLIEDE     = 14 # 1試行は14スライド

for i in 1..NUM_OF_EXPERIMENT
    for j in 1..NUM_OF_SLIEDE
        slide = Slide.create(
            script_id: i
        )
        slide.image.attach(io: File.open("app/assets/images/slide#{i}/slide#{i}-#{j}.png"), filename:"slide#{i}-#{j}.png")
    end
end